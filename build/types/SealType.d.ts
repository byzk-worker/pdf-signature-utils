/**
 * 验证结果详情
 */
export interface SealVerifyInfo {
    /**
     * 验证是否成功
     */
    verifyResult: boolean;
    /**
     * 错误信息 仅在失败时返回
     */
    verifyMsg?: string;
    /**
     * 签章者证书
     */
    sealSingerCert: string;
    /**
     * 制章者证书
     */
    sealMakerCert: string;
    /**
     * 电子印章信息
     */
    eSealInfo: ESealInfo;
    /**
     * 签章信息
     */
    signatureInfo: SignatureInfo;
    /**
     * 制章者信息
     */
    makerCertInfo: MakerCertInfo;
    /**
     * 签章者信息
     */
    singerCertInfo: SingerCertInfo;
}
export interface ESealInfo {
    /**
     * 电子印章标识
     */
    id: string;
    /**
     *  电子印章版本
     */
    version: string;
    /**
     * 厂商ID
     */
    vId: string;
    /**
     * 电子印章唯一编码
     */
    esId: string;
    /**
     * 印章名称
     */
    sealName: string;
    /**
     * 印章制作时间
     */
    sealMakeTime: string;
    /**
     * 印章有效期开始时间
     */
    sealBeginTime: string;
    /**
     *  印章有效期结束时间
     */
    sealEndTime: string;
}
export interface SignatureInfo {
    /**
     * 签名域名称
     */
    signatureName: string;
    /**
     * 签章者名称
     */
    userName: string[];
    /**
     * 签章时间
     */
    time: string;
    /**
     * 页码
     */
    page: Number;
    sealMakerName: string;
}
export interface MakerCertInfo {
    /**
     * 制章者证书序列号
     */
    serialNumber: string;
    /**
     * 签名算法
     */
    signAlg: string;
    /**
     * 证书所有者名称
     */
    ownerName: string;
    /**
     * 颁发者名称
     */
    issueName: string;
    /**
     * 有效期开始时间
     */
    beginTime: string;
    /**
     * 有效期结束时间
     */
    endTime: string;
}
export interface SingerCertInfo {
    /**
     * 签章者证书序列号
     */
    serialNumber: string;
    /**
     * 签名算法
     */
    signAlg: string;
    /**
     * 所有人名称
     */
    ownerName: string;
    /**
     * 颁发者名称
     */
    issueName: string;
    /**
     * 有效期开始时间
     */
    beginTime: string;
    /**
     * 有效期结束时间
     */
    endTime: string;
}
/**
 * 印章响应对象
 */
export interface SealListInfo {
    /**
     * 印章id
     */
    id: string;
    /**
     * 印章类型
     */
    sealType: string;
    /**
     * 印章编码
     */
    sealCode: string;
    /**
     * 印章名
     */
    sealMsg: string;
    /**
     * 算法类型
     */
    algType: string;
    /**
     * 印章结构体
     */
    seal: string;
    /**
     * 有效期开始时间 时间戳
     */
    startTime: string;
    /**
     * 有效期结束时间 时间戳
     */
    endTime: string;
    /**
     * 印章宽
     */
    width: string;
    /**
     * 印章高
     */
    height: string;
    /**
     * 印章图片base64 不带前缀
     */
    sealImg: string;
}
/**
 * 印章查询接口返回结果
 */
export interface SealListRsp {
    sealInfoVo: SealListInfo[];
    total: number;
}
/**
 * 骑缝章请求参数
 */
export interface SignatureByGapReq {
    sealId: string;
    fileId: string;
    x: number;
    y: number;
    splitPageNum?: number;
    type: "all" | "odd" | "pair";
    password: string;
}
/**
 * 关键字盖章请求参数
 */
export interface SignatureByKeywordsReq {
    /**
     * 印章id
     */
    sealId: string;
    /**
     * 文件id
     */
    fileId: string;
    /**
     * 设备密码
     */
    password: string;
    /**
     * 关键字
     */
    keywords: string;
    /**
     * 偏移量
     */
    offset?: number;
    /**
     * 命中序号
     */
    hitNo?: number;
}
/**
 * 坐标签章请求对象
 */
export interface SignatureByPositionInfo {
    pageNo: number;
    x: number;
    y: number;
}
