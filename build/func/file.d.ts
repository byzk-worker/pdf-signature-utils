import { ConnectConfig, OpenFileReq, SaveToHttpOptions } from "../types";
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
/**
 * 将文件保存为base64
 * @param fileId 文件id
 * @param options 连接选项
 * @returns base64字符串
 */
export declare const saveToBase64: (fileId: string, options?: ConnectConfig) => Promise<any>;
/**
 * 将文件保存至本地指定路径
 * @param fileId 文件id
 * @param path 本地路径，全路径，如： D://filePaht/a.pdf
 * @param options 连接选项
 * @returns 保存是否成功
 */
export declare const saveToLocal: (fileId: string, path: string, options?: ConnectConfig) => Promise<boolean>;
/**
 * 将文件保存至远端
 * @param fileId 文件id
 * @param url 远端地址 如: http(s)://wwww.fileaddress.com/upload
 * @param httpOptions 上传选项 可空
 * @param options 连接选项
 * @returns 保存是否成功
 */
export declare const saveToHttp: (fileId: string, url: string, httpOptions?: SaveToHttpOptions, options?: ConnectConfig) => Promise<boolean>;
