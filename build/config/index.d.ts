import { ConnectConfig } from '../types';
export declare const connectConfigGet: () => ConnectConfig;
export declare const connectConfigSet: (opt: ConnectConfig) => void;
export declare const baseUrl = "http://192.168.100.151:28006";
export declare const requestError: {
    timeout: string;
    networkError: string;
};
