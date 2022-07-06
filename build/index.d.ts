import { sealVerifyOne, sealVerifyAll, sealList, signatureByPosition, signatureByKeywords, signatureByGap } from './func/seal';
import { fileOpen, fileClose, fileDownloadUrlGet } from './func/file';
declare const configMgr: {
    connectGet: () => import("./types").ConnectConfig;
    connectSet: (opt: import("./types").ConnectConfig) => void;
};
declare const enums: {
    requestError: {
        timeout: string;
        networkError: string;
    };
};
export * from './types';
export { fileOpen, fileDownloadUrlGet, fileClose, sealVerifyOne, sealVerifyAll, sealList, signatureByPosition, signatureByKeywords, signatureByGap, configMgr, enums };
