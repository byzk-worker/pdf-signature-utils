/**
 * 要解析的文件信息
 */
export interface OpenFileReq {
    /**
     * 名称
     */
    name: string;
    /**
     * 路径
     * http(s)://
     * file:///
     * data:application/pdf;base64,
     */
    path?: string;
    /**
     * 原始HTML文件节点
     */
    rawHtmlEle?: HTMLInputElement;
    /**
     * 分片地址， http文件上传接口地址，http全拼
     */
    slicingPath?: string;
}

export interface HttpFormData {
    [key: string]: string
}

export interface HttpHeaders {
    [key: string]: string
}

export interface SaveToHttpOptions {
    /**
     * 上传方式
     */
    method?: 'POST' | 'PUT',
    /***
     * form字段中，文件字段的字段名
     */
    fieldName?: string,
    /**
     * 要保存成的文件名
     */
    filename?: string,
    /**
     * http请求头，格式示例：
     * {
     *  '_t':'1145141919810'
     * }
     */
    headers?: HttpHeaders,
    /**
     * formdata http表单数据，格式示例：
     * {
     *   'token':'123848292'
     * }
     */
    form?: HttpFormData,
}