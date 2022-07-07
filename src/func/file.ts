import { ConnectConfig, OpenFileReq } from "../types";
import { newGuid, isNull, arrayIsNull } from '../utils'
import { beginUpload, deleteFile, endUpload, sliceUpload } from "../service";
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

        const { name, rawHtmlEle } = req;
        if (isNull(rawHtmlEle) || isNull(rawHtmlEle.files) || rawHtmlEle.files.length <= 0) {
            return reject('检测到文件为空, 文件不能为空');
        }
        const fileGuid = newGuid();
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

