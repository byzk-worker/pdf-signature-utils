import { Begin } from '@bk/usbkey-lib';
import { SocketContext, WebsocketClient } from '@byzk/sockjs-util-lib';
import { connectConfigGet, baseUrl, requestError } from '../config';
import { ConnectConfig } from '../types';
import { isNull, isObject } from '../utils'

var connectReady = false;
export const connectInit = () => {
    Begin({
        url: `${baseUrl()}/dev`,
        connectionListener: (t) => {
            connectReady = t === "open";
            console.info(`客户端服务连接状态：${connectReady ? '已连接' : '已断开'}`)
        },
        disableAutoRequireFn: true
    });
}


interface httpReqParams {
    url: string,
    data?: FormData,
}
const httpBaseReq = async (req: httpReqParams): Promise<any> => {
    return new Promise((resovle, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', req.url);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    if (isNull(xhr.responseText)) {
                        reject("后台返回空响应");
                        return;
                    }
                    let rsp;
                    try {
                        rsp = JSON.parse(xhr.responseText);
                    } catch (error) {
                        reject("解析响应结果失败");
                        return;
                    }
                    const { code, msg } = rsp;
                    if (code !== "0") {
                        reject(msg);
                        return;
                    }
                    resovle(true);
                } else {
                    reject(requestError.networkError);
                }
            }
        }
        xhr.send(req.data);
    });
}
export const httpReq = async (params: httpReqParams, options?: ConnectConfig): Promise<any> => {
    const opt = options ?? connectConfigGet();
    return new Promise(async (resolve, reject) => {
        if (opt.timeout && opt.timeout > 0) {
            setTimeout(() => {
                reject(requestError.timeout);
            }, opt.timeout);
        }
        try {
            var rsp = await httpReqInRetry(params, opt, 1);
            resolve(rsp);
        } catch (error) {
            reject(error);
        }
    })
}
const httpReqInRetry = async (params: httpReqParams, options: ConnectConfig, nowRetryCount: number) => {
    try {
        var rsp = await httpBaseReq(params);
        return Promise.resolve(rsp);
    } catch (error) {
        var errorStr = !isNull(error) ? error.toString() : '';
        if (errorStr != requestError.networkError) {
            return Promise.reject(error);
        }
    }
    if (!options.retry || nowRetryCount >= options.retryCount) {
        return Promise.reject(requestError.networkError);
    }
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                var rst = await httpReqInRetry(params, options, nowRetryCount++);
                resolve(rst);
            } catch (error) {
                reject(error);
            }
        }, options.retryInterval);
    })
}


interface socketReqParams {
    cmd: string,
    data?: any,
    onError?: (error: any) => void,
    finally?: () => void,
}
const socketBaseReq = async (params: socketReqParams): Promise<any> => {
    try {
        var payload: any = {
            mod: "1",
            needReturn: true,
            data: !isNull(params.data) ? isObject(params.data) ? JSON.stringify(params.data) : params.data : undefined,
        }
        const reqCxt = SocketContext.createSendMsgContext(params.cmd, payload);
        if (reqCxt.err) {
            params.onError?.(reqCxt.err);
            return Promise.reject(reqCxt.err);
        }

        const res = await WebsocketClient.getConn().sendMsg(reqCxt);
        if (res.err) {
            params.onError?.(res.err);
            return Promise.reject(res.err);
        }

        if (res.isVoid) {
            return Promise.resolve();
        }

        let resData = res.unmarshal();
        if (typeof resData === "string") {
            try {
                resData = JSON.parse(resData);
            } catch (e) { }
            finally {
                return Promise.resolve(resData);
            }
        }
    } catch (error: any) {
        params.onError?.(error);
        return Promise.reject(error);
    } finally {
        params.finally?.();
    }
}
export const socketReq = async (params: socketReqParams, options?: ConnectConfig): Promise<any> => {
    const opt = options ?? connectConfigGet();
    return new Promise(async (resolve, reject) => {
        if (opt.timeout && opt.timeout > 0) {
            setTimeout(() => {
                reject(requestError.timeout);
            }, opt.timeout);
        }
        try {
            var rsp = await socketReqInRetry(params, opt, 1);
            resolve(rsp);
        } catch (error) {
            var errorMsg = (!isNull(error) ? error.toString() : '').replace('socketContextError: ', '');
            reject(errorMsg);
        }
    });
}
const socketReqInRetry = async (params: socketReqParams, options: ConnectConfig, nowRetryCount: number) => {
    //连接准备就绪再请求，否则直接进入重试逻辑
    if (connectReady) {
        try {
            var rsp = await socketBaseReq(params);
            return Promise.resolve(rsp);
        } catch (error) {
            var errorStr = !isNull(error) ? error.toString() : '';
            if (!(!connectReady || errorStr.indexOf('网络错误') >= 0 || errorStr.indexOf('未与服务器建立连接') >= 0)) {
                return Promise.reject(error);
            }
        }
    }

    /**
     * 如果上面没有return 则证明我们需要重试了
     */

    //检测是否开启了重试 和 重试次数
    if (!options.retry || nowRetryCount >= options.retryCount) {
        return Promise.reject(requestError.networkError);
    }
    //递归调用
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                var rst = await socketReqInRetry(params, options, nowRetryCount++);
                resolve(rst);
            } catch (error) {
                reject(error);
            }
        }, options.retryInterval);
    });
}