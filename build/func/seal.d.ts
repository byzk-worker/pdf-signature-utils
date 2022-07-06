import { ConnectConfig } from "../types";
import { SealVerifyInfo, SealListRsp, SignatureByGapReq, SignatureByKeywordsReq, SignatureByPositionInfo } from "../types/SealType";
/**
 * 验证pdf中指定签名域
 * @param fileId 文件id
 * @param name 签章域名称
 * @returns
 */
export declare const sealVerifyOne: (fileId: string, name: string, options?: ConnectConfig) => Promise<SealVerifyInfo>;
/**
 * 验证pdf中所有印章
 * @param fileId
 * @param options
 * @returns
 */
export declare const sealVerifyAll: (fileId: string, options?: ConnectConfig) => Promise<SealVerifyInfo[]>;
/**
 * 获取当前usbkey中的印章
 * @param password
 * @param options
 * @returns
 */
export declare const sealList: (password: string, options?: ConnectConfig) => Promise<SealListRsp>;
/**
 * 坐标签章
 * @param params
 * @param password
 * @param options
 * @returns 签章后的文件ID
 */
export declare const signatureByPosition: (fileId: string, sealId: string, positions: SignatureByPositionInfo[], password: string, options?: ConnectConfig) => Promise<string>;
/**
 * 骑缝章接口
 * @param params
 * @param options
 * @returns 签章后的文件id
 */
export declare const signatureByGap: (params: SignatureByGapReq, options?: ConnectConfig) => Promise<string>;
/**
 * 关键字签章
 * @param params
 * @param options
 * @returns 签章后的文件ID
 */
export declare const signatureByKeywords: (params: SignatureByKeywordsReq, options?: ConnectConfig) => Promise<string>;
