import { connectInit } from './service/utils'
import { connectConfigGet, connectConfigSet, requestError } from './config'
import { sealVerifyOne, sealVerifyAll, sealList, signatureByPosition, signatureByKeywords, signatureByGap } from './func/seal'
import { fileOpen, fileClose, fileDownloadUrlGet } from './func/file'

//连接本地服务
connectInit();

//配置相关操作
const configMgr = {
    connectGet: connectConfigGet,
    connectSet: connectConfigSet
}

//枚举相关
const enums = {
    requestError
}

//导出类型
export * from './types'

//导出所需功能
export {
    fileOpen,
    fileDownloadUrlGet,
    fileClose,
    sealVerifyOne,
    sealVerifyAll,
    sealList,
    signatureByPosition,
    signatureByKeywords,
    signatureByGap,
    configMgr,
    enums
}