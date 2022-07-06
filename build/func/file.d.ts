import { ConnectConfig, OpenFileReq } from "../types";
/**
 * 上传文件接口
 */
export declare const fileOpen: (req: OpenFileReq, options?: ConnectConfig) => Promise<string>;
/**
 * 获取文件下载地址
 * @param fileId
 * @returns
 */
export declare const fileDownloadUrlGet: (fileId: string) => string;
/**
 * 文件删除接口
 */
export declare const fileClose: (fileId: string, options?: ConnectConfig) => Promise<boolean>;
