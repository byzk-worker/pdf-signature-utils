import { baseUrl } from "../config";
import { ConnectConfig, SignatureByKeywordsReq, SignatureByGapReq } from "../types";
import { httpReq, socketReq } from "./utils";

interface BeginUploadParam {
    name: string,
    id: string,
    md5: string,
    sliceNumber: string,
    size: string
}

export const beginUpload = async (payload: BeginUploadParam, options?: ConnectConfig) => socketReq({ cmd: '/startBigFileUpload', data: payload }, options);


interface SliceUploadParam {
    url?: string,
    fileId: string,
    index: string,
    sliceId: string,
    buffer: ArrayBuffer
}
export const sliceUpload = async (payload: SliceUploadParam, options?: ConnectConfig) => {
    var url = baseUrl() + '/bigFileUpload';
    if (payload.url) {
        url = payload.url;
    }
    var data = new FormData();
    data.append("fileId", payload.fileId);
    data.append("index", payload.index);
    data.append("sliceId", payload.sliceId);
    data.append("buffer", new Blob([payload.buffer]));
    return httpReq({ url, data }, options);
}


export const endUpload = async (id: string, options?: ConnectConfig) => socketReq({ cmd: '/getBigFileUploadResult', data: id }, options);


export const deleteFile = async (id: string, options?: ConnectConfig) => socketReq({ cmd: '/seal/removeFile', data: id }, options);


export const verifySeal = async (id: string, options?: ConnectConfig) => socketReq({ cmd: '/seal/verify', data: id }, options);


export const getSealList = async (password: string, options?: ConnectConfig) => socketReq({ cmd: '/sealMgr/getSealListByKeyNo', data: password }, options);


export const signature = async (req: any, options?: ConnectConfig) => socketReq({ cmd: '/seal/sign', data: { id: req.sealId, fileId: req.fileId, pageNum: req.page, x: req.positionX, y: req.positionY, keyPwd: req.pwd } }, options);


export const signQF = async (req: SignatureByGapReq, options?: ConnectConfig) => socketReq({ cmd: '/seal/signQF', data: { id: req.sealId, fileId: req.fileId, pageNum: 1, x: req.x, y: req.y, size: req.splitPageNum, keyPwd: req.password } }, options);


export const signMany = async (req: any, options?: ConnectConfig) =>
    // socketReq({
    //     cmd: '/seal/signSiteBatch',
    //     data: {
    //         id: req.sealId,
    //         fileId: req.fileId,
    //         keyPwd: req.pwd,
    //         pageList: req.pages.map((m) => { return { pageNum: m.page, x: m.positionX, y: m.positionY } }),
    //     },
    // }, options);
    socketReq({
        cmd: '/seal/signSiteBatch',
        data: {
            id: req.sealId,
            fileId: req.fileId,
            keyPwd: req.pwd,
            pageList: req.pages.map((m) => { return { pageNum: m.page, xPosition: m.positionX, yPosition: m.positionY } }),
        },
    }, options);


export const signKeyword = async (req: SignatureByKeywordsReq, options?: ConnectConfig) =>
    socketReq({
        cmd: '/seal/signKeyword',
        data: {
            id: req.sealId,
            fileId: req.fileId,
            keyPwd: req.password,
            keyword: req.keywords,
            offset: req.offset,
            keywordNo: req.hitNo
        }
    }, options);



export const addressUpload = async (fileId: string, address: string, options?: ConnectConfig) => socketReq({ cmd: '/parserAddrUpload', data: { fileId, addr: address } }, options);


export const fileSave = async (type: 'base64' | 'local' | 'http', data: any, options?: ConnectConfig) => {
    let cmd = '';
    switch (type) {
        case 'base64':
            cmd = '/file/save2Base64';
            break;
        case 'local':
            cmd = '/file/save2Local';
            break;
        case 'http':
            cmd = '/file/save2Http';
            break;
    }
    var rsp = await socketReq({ cmd, data, }, options);
    return rsp;
}