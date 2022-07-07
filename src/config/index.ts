import { ConnectConfig } from '../types';

var connConfig: ConnectConfig = {
    retry: false,
    retryCount: 1,
    retryInterval: 1000,
    timeout: -1
};


export const connectConfigGet = () => connConfig;


export const connectConfigSet = (opt: ConnectConfig) => { connConfig = opt };


// export const baseUrl = 'http://192.168.100.151:28006';
export const baseUrl = 'http://127.0.0.1:28006';


export const requestError = {
    timeout: "请求超时",
    networkError: "网络错误"
}