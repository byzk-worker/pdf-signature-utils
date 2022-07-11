import { ConnectConfig } from "../types";
import { getSealList, verifySeal, signature, signQF, signMany, signKeyword } from "../service";
import { SealVerifyInfo, SealListRsp, SignatureByGapReq, SignatureByKeywordsReq, SignatureByPositionInfo } from "../types/SealType";
import { arrayIsNull, isNull, mmConversionPx } from "../utils";

interface IverifyRsp {
    fileId: string,
    rsp: SealVerifyInfo[]
}

var verifyRspList: IverifyRsp[] = [];


/**
 * 验证pdf中指定签名域
 * @param fileId 文件id
 * @param name 签章域名称
 * @returns 
 */
export const sealVerifyOne = async (fileId: string, name: string, options?: ConnectConfig): Promise<SealVerifyInfo> => {
    var obj = verifyRspList.find(m => m.fileId === fileId);
    if (!isNull(obj) && obj.rsp.length > 0) {
        return Promise.resolve(obj.rsp.find(m => m.signatureInfo.signatureName === name));
    } else {
        try {
            var rsp = await sealVerifyAll(fileId, options);
            if (!isNull(rsp) && rsp.length > 0) {
                return rsp.find(m => m.signatureInfo.signatureName === name);
            } else {
                return Promise.reject('未查询到对应的签名域');
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

/**
 * 验证pdf中所有印章
 * @param fileId 
 * @param options 
 * @returns 
 */
export const sealVerifyAll = async (fileId: string, options?: ConnectConfig): Promise<SealVerifyInfo[]> => {
    let rst: SealVerifyInfo[] = await verifySeal(fileId, options);
    if (!arrayIsNull(rst)) {
        rst.forEach(element => {
            if (isNull(element.verifyResult)) {
                element.verifyResult = false;
            }
        });
    }
    if (!isNull(rst) && rst.length > 0) {
        verifyRspList = verifyRspList.filter(m => m.fileId !== fileId);
        verifyRspList.push({ fileId, rsp: rst });
    }
    return rst;
}

/**
 * 获取当前usbkey中的印章
 * @param password 
 * @param options 
 * @returns 
 */
export const sealList = async (password: string, options?: ConnectConfig): Promise<SealListRsp> => {
    const rst = await getSealList(password, options);
    return rst;
}

interface SealInReq {
    /**
     * 印章id
     */
    sealId: string,
    /**
     * 文件id
     */
    fileId: string,
    /**
     * 页码
     */
    page: number,
    /**
     * x坐标
     */
    positionX: number,
    /**
     * y坐标
     */
    positionY: number,
    /**
     * 设备密码
     */
    pwd: string
}

/**
 * 文件签章接口
 * @param params 
 * @param options
 * @returns 签章后的新的文件id 
 */
const sealIn = async (params: SealInReq, options?: ConnectConfig): Promise<string> => {
    if (!isNull(params)) {
        if (!isNull(params.positionX)) {
            params.positionX = mmConversionPx(params.positionX);
        }
        if (!isNull(params.positionY)) {
            params.positionY = mmConversionPx(params.positionY);
        }
    }
    const rst = await signature(params, options);
    return rst;
}

// /**
//  * 多页盖章请求参数
//  */
interface SealInManyReq {
    /**
     * 印章id
     */
    sealId: string,
    /**
     * 文件id
     */
    fileId: string,
    /**
     * 要盖章的页码，不传盖整个文档
     */
    pages: SealInManyInfo[]
    /**
     * 设备密码
     */
    pwd: string
}

// /**
//  * 多页盖章微调对象
//  */
interface SealInManyInfo {
    /**
     * 页码
     */
    page: number,
    /**
     * x坐标
     */
    positionX: number,
    /**
     * y坐标
     */
    positionY: number,
}

/**
 * 多页签章接口
 * @param params 
 * @param options 
 * @returns 
 */
const sealInMany = async (params: SealInManyReq, options?: ConnectConfig): Promise<string> => {
    if (!isNull(params) && !isNull(params.pages) && params.pages.length > 0) {
        params.pages.forEach((m) => {
            if (!isNull(m.positionX)) {
                m.positionX = mmConversionPx(m.positionX);
            }
            if (!isNull(m.positionY)) {
                m.positionY = mmConversionPx(m.positionY);
            }
        })
    }
    const rst = await signMany(params, options);
    return rst;
}

/**
 * 坐标签章
 * @param params 
 * @param password 
 * @param options 
 * @returns 签章后的文件ID
 */
export const signatureByPosition = async (fileId: string, sealId: string, positions: SignatureByPositionInfo[], password: string, options?: ConnectConfig): Promise<string> => {
    if (isNull(positions) || positions.length <= 0) {
        return Promise.reject('请传入坐标相关信息');
    }
    if (positions.length > 1) {
        return sealInMany({ sealId, fileId, pwd: password, pages: positions.map((m) => { return { page: m.pageNo, positionX: m.x, positionY: m.y } }) }, options);
    } else {
        return sealIn({ sealId: sealId, fileId: fileId, page: positions[0].pageNo, positionX: positions[0].x, positionY: positions[0].y, pwd: password }, options);
    }
}

/**
 * 骑缝章接口
 * @param params 
 * @param options 
 * @returns 签章后的文件id
 */
export const signatureByGap = async (params: SignatureByGapReq, options?: ConnectConfig): Promise<string> => {
    if (!params?.splitPageNum) {
        params.splitPageNum = 10;
    }
    if (!isNull(params?.x)) {
        params.x = mmConversionPx(params.x);
    }
    if (!isNull(params?.y)) {
        params.y = mmConversionPx(params.y);
    }
    const rst = await signQF(params, options);
    return rst;
}

/**
 * 关键字签章
 * @param params 
 * @param options 
 * @returns 签章后的文件ID
 */
export const signatureByKeywords = async (params: SignatureByKeywordsReq, options?: ConnectConfig): Promise<string> => {
    const rst = await signKeyword(params, options);
    return rst;
}