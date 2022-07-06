/**
 * 验证结果详情
 */
export interface SealVerifyInfo {
    /**
     * 签名域名称
     */
    signatureName: string,
    /**
     * 验证结果
     */
    verifyResult: boolean,
    /**
     * 错误信息 当 verifyResult 为 false 时 ，此值有内容
     */
    verifyMsg?: string,
    /**
     * 签名时间 时间戳
     */
    time: string,
    /**
     * 印章所在页码
     */
    page: number,
    /**
     * 签章人姓名
     */
    userName: string[],
}

/**
 * 印章响应对象
 */
export interface SealListInfo {
    /**
     * 印章id
     */
    id: string,
    /**
     * 印章类型
     */
    sealType: string,
    /**
     * 印章编码 
     */
    sealCode: string,
    /**
     * 印章名
     */
    sealMsg: string,
    /**
     * 算法类型
     */
    algType: string,
    /**
     * 印章结构体
     */
    seal: string,
    /**
     * 有效期开始时间 时间戳
     */
    startTime: string,
    /**
     * 有效期结束时间 时间戳
     */
    endTime: string,
    /**
     * 印章宽
     */
    width: string,
    /**
     * 印章高
     */
    height: string,
    /**
     * 印章图片base64 不带前缀
     */
    sealImg: string,
}

/**
 * 印章查询接口返回结果
 */
export interface SealListRsp {
    sealInfoVo: SealListInfo[],
    total: number,
}

/**
 * 印章盖章请求参数
 */
export interface SealInReq {
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

// /**
//  * 骑缝章请求参数
//  */
// export interface SealInQFReq extends SealInReq {
//     /**
//      * 多少页拆分一个章
//      */
//     size: number,
// }

/**
 * 骑缝章请求参数
 */
export interface SignatureByGapReq {
    // 印章id
    sealId: string;
    // 文件id
    fileId: string;
    // x位置
    x: number;
    // y 位置
    y: number;
    // 多少页拆分一个印章
    splitPageNum?: number;
    // 盖章类型
    // all:  所有页
    // odd: 单数页
    // pair: 双数页
    type: "all" | "odd" | "pair";
    password: string;
}

/**
 * 多页盖章请求参数
 */
export interface SealInManyReq {
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

/**
 * 多页盖章微调对象
 */
export interface SealInManyInfo {
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
 * 关键字盖章请求参数
 */
export interface SignatureByKeywordsReq {
    /**
     * 印章id
     */
    sealId: string,
    /**
     * 文件id
     */
    fileId: string,
    /**
     * 设备密码
     */
    password: string,
    /**
     * 关键字
     */
    keywords: string,
    /**
     * 偏移量
     */
    offset?: number,
    /**
     * 命中序号
     */
    hitNo?: number,
}

/**
 * 坐标签章请求对象
 */
export interface SignatureByPositionInfo {
    pageNo: number;
    x: number;
    y: number;
}