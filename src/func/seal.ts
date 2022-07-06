import { ConnectConfig } from "../types";
import { getSealList, verifySeal, signature, signQF, signMany, signKeyword } from "../service";
import { SealVerifyInfo, SealListRsp, SealInReq, SignatureByGapReq, SealInManyReq, SignatureByKeywordsReq, SignatureByPositionInfo } from "../types/SealType";
import { arrayIsNull, isNull } from "../utils";

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
        return Promise.resolve(obj.rsp.find(m => m.signatureName === name));
    } else {
        try {
            var rsp = await sealVerifyAll(fileId, options);
            if (!isNull(rsp) && rsp.length > 0) {
                return rsp.find(m => m.signatureName === name);
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

/**
 * 文件签章接口
 * @param params 
 * @param options
 * @returns 签章后的新的文件id 
 */
const sealIn = async (params: SealInReq, options?: ConnectConfig): Promise<string> => {
    const rst = await signature(params, options);
    return rst;
}

/**
 * 多页签章接口
 * @param params 
 * @param options 
 * @returns 
 */
const sealInMany = async (params: SealInManyReq, options?: ConnectConfig): Promise<string> => {
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
    if (!params.splitPageNum) {
        params.splitPageNum = 10;
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