import { ConnectConfig } from '../types';
export declare const connectConfigGet: () => ConnectConfig;
export declare const connectConfigSet: (opt: ConnectConfig) => void;
export declare const baseUrl: () => string;
export declare const requestError: {
    timeout: string;
    networkError: string;
};
