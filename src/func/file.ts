import { ConnectConfig, OpenFileReq, SaveToHttpOptions } from "../types";
import { newGuid, isNull, arrayIsNull } from '../utils'
import { addressUpload, beginUpload, deleteFile, endUpload, fileSave, sliceUpload } from "../service";
import { baseUrl, connectConfigGet, requestError } from "../config";
import SparkMD5 from 'spark-md5'


interface SliceArray {
    index: number
    sliceId: string
    buffer: ArrayBuffer
}

interface SplitFileRsp {
    /**
     * 整个文件的MD5
     */
    md5: string,
    /**
     * 文件大小
     */
    fileSize: number,
    /**
     * 切片结果
     */
    array: SliceArray[]
}

const fileSplit = (file: File, shardSize: number = 5 * 1024 * 1024): Promise<SplitFileRsp> => {
    return new Promise<SplitFileRsp>((resovle, reject) => {
        if (isNull(file)) {
            reject('获取文件失败, 文件不能为空');
            return;
        }
        const fileSize = file.size; //文件大小
        const sliceNum = Math.ceil(fileSize / shardSize); //分片数量
        var fileReader = new FileReader();
        fileReader.onload = (ev) => {
            const blob: any = ev.target.result;
            var md5Reader = new SparkMD5.ArrayBuffer();
            var blobArray: SliceArray[] = [];
            for (let index = 0; index < sliceNum; index++) {
                var start = index * shardSize;
                var end = Math.min(fileSize, start + shardSize);
                var sliceBlob = blob.slice(start, end);
                md5Reader.append(sliceBlob);
                blobArray.push({
                    index,
                    sliceId: newGuid(),
                    buffer: sliceBlob
                });
            }
            var rsp: SplitFileRsp = {
                md5: md5Reader.end(),
                fileSize,
                array: blobArray
            }
            md5Reader.destroy(); //销毁
            resovle(rsp);
        }
        fileReader.readAsArrayBuffer(file); //以二进制的形式加载
    });
}

let fileCaches = [];

const addCache = (fileId: string, name: string) => {
    deleteCache(fileId);
    fileCaches.push({ fileId, name });
}

const deleteCache = (fileId: string) => {
    fileCaches = fileCaches.filter(m => m.fileId !== fileId);
}

const getFileNameByCache = (fileId: string) => {
    return fileCaches.find(m => m.fileId === fileId)?.name;
}

/**
 * 上传文件接口
 */
export const fileOpen = async (req: OpenFileReq, options?: ConnectConfig): Promise<string> => {
    return new Promise(async (resolve, reject) => {

        var opt = options ?? connectConfigGet();
        const TIMEOUT = opt.timeout;
        //添加限时器
        if (TIMEOUT && TIMEOUT > 0) {
            setTimeout(() => {
                reject(requestError.timeout);
            }, TIMEOUT);
        }

        const { name, rawHtmlEle, path } = req;
        if (!isNull(rawHtmlEle)) {
            if (isNull(rawHtmlEle.files) || rawHtmlEle.files.length <= 0) {
                return reject('未在rawHtmlEle中检测到文件');
            }
        } else if (isNull(path)) {
            return reject('rawHtmlEle参数和path参数不能同时为空');
        }
        const fileGuid = newGuid();

        if (isNull(rawHtmlEle) && !isNull(path)) {
            try {
                await addressUpload(fileGuid, path, { ...opt, timeout: -1 });
            } catch (error) {
                return reject(error);
            }
            addCache(fileGuid, req.name);
            return resolve(fileGuid);
        }

        let sliceRsp: SplitFileRsp;
        const shardSize = 5 * 1024 * 1024;
        try {
            sliceRsp = await fileSplit(rawHtmlEle.files[0], shardSize);
        } catch (error) {
            return reject(error);
        }
        if (isNull(sliceRsp) || isNull(sliceRsp.md5) || arrayIsNull(sliceRsp.array)) {
            return reject('分片异常');
        }

        const { md5, array, fileSize } = sliceRsp;

        try {
            //第一步，调用接口，标志着分片上传开始
            await beginUpload({
                name,
                id: fileGuid,
                md5,
                sliceNumber: array.length.toString(),
                size: fileSize.toString(),
            }, { ...opt, timeout: -1 });
        } catch (error) {
            return reject(error);
        }

        //第二部，开始分片上传
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            try {
                await sliceUpload({
                    url: req.slicingPath,
                    fileId: fileGuid,
                    index: element.index.toString(),
                    sliceId: element.sliceId.toString(),
                    buffer: element.buffer
                }, { ...opt, timeout: -1 });
            } catch (error) {
                return reject(error);
            }
        }

        //第三步，分片上传结束
        try {
            await endUpload(fileGuid, { ...opt, timeout: -1 });
        } catch (error) {
            return reject(error);
        }

        addCache(fileGuid, req.name);
        return resolve(fileGuid);
    });
}

/**
 * 获取文件下载地址
 * @param fileId 
 * @returns 
 */
export const fileDownloadUrlGet = (fileId: string) => `${baseUrl()}/download/sealFile?fileId=${fileId}`;

/**
 * 文件删除接口
 */
export const fileClose = async (fileId: string, options?: ConnectConfig): Promise<boolean> => {
    try {
        var rsp = await deleteFile(fileId, options);
        return Promise.resolve(true);
    } catch (error) {
        return Promise.reject(error);
    }
}

/**
 * 将文件保存为base64
 * @param fileId 文件id
 * @param options 连接选项
 * @returns base64字符串
 */
export const saveToBase64 = async (fileId: string, options?: ConnectConfig) => {
    var rsp = await fileSave('base64', { fileId }, options);
    return rsp;
}

/**
 * 将文件保存至本地指定路径
 * @param fileId 文件id
 * @param path 本地路径，全路径，如： D://filePaht/a.pdf
 * @param options 连接选项
 * @returns 保存是否成功
 */
export const saveToLocal = async (fileId: string, path: string, options?: ConnectConfig) => {
    await fileSave('local', { fileId, addr: path }, options);
    return true;
}

/**
 * 将文件保存至远端
 * @param fileId 文件id
 * @param url 远端地址 如: http(s)://wwww.fileaddress.com/upload
 * @param httpOptions 上传选项 可空
 * @param options 连接选项
 * @returns 保存是否成功
 */
export const saveToHttp = async (fileId: string, url: string, httpOptions?: SaveToHttpOptions, options?: ConnectConfig) => {
    if (isNull(httpOptions)) {
        httpOptions = {};
    }
    if (isNull(httpOptions.filename)) {
        var cacheName = getFileNameByCache(fileId);
        if (!isNull(cacheName)) {
            httpOptions.filename = cacheName;
        }
    }
    await fileSave('http', { fileId, addr: url, targetHttpOption: JSON.stringify(httpOptions) }, options);
    return true;
}
