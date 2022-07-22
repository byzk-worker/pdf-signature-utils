# pdf-signature-utils
pdf签章工具库，主要为签章解决方案， 此库为签章相关接口调用库.

# 目录

<a href="#d1">安装</a>

<a href="#d2">示例</a>

<a href="#d3">API简介</a>

<a href="#d4">使用技巧</a>

# <div id="d1">安装</div>

### 浏览器中使用

```html
<script src="https://raw.githubusercontent.com/byzk-worker/pdf-signature-utils/main/build/dist/pdf-signature-utils-iife.min.js"></script>
```

###  npm中使用

```js
npm install --save @byzk/pdf-signature-utils
```

### yarn中使用

```js
yarn add @byzk/pdf-signature-utils
```



# <div id="d2">示例</div>

## 浏览器中使用示例

```html
<script src="https://raw.githubusercontent.com/byzk-worker/pdf-signature-utils/main/build/dist/pdf-signature-utils-iife.min.js"></script>
<script>
    pdfSignatureUtils.fileOpen({
        name:'测试文件.pdf',
        rawHtmlEle:document.getElementById("uploadinput")
    }).then(function (fileId) {
        console.info(fileId);
    }).catch(function (err) {
        console.log(err);
    });
</script>
```



## CommonJS规范中使用

```javascript
const pdfSignatureUtils = require('@byzk/pdf-signature-utils').default;
pdfSignatureUtils.fileOpen({
    name:'测试文件.pdf',
    rawHtmlEle:document.getElementById("uploadinput")
}).then(function (fileId) {
    console.info(fileId);
}).catch(function (err) {
    console.log(err);
});
```



## ES6规范中使用

```javascript
import {fileOpen} from "@byzk/pdf-signature-utils"; 
fileOpen({
    name:'测试文件.pdf',
    rawHtmlEle:document.getElementById("uploadinput")
}).then(function (fileId) {
    console.info(fileId);
}).catch(function (err) {
    console.log(err);
});
```


# <div id="d3">API简介</div>

## fileOpen 打开文件接口

#### 调用接口，传入PDF文件，返回文件id

### 请求参数
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| req | <a href="#OpenFileReq" >OpenFileReq</a> | 是 | 请求参数对象 |
| options | <a href="#ConnectConfig" >ConnectConfig</a> | 否 | 请求配置对象 |

### <div id="OpenFileReq" >OpenFileReq 对象</div> 
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| name | string | 是 | 名称 |
| path | string | 否 | 路径，当前支持格式：<p>1: `http协议(http(s)://)`</p> <p>2: `file协议(file:///)`</p> <p>3: `MIME BASE64协议(data:application/pdf;base64,)`</p> |
| rawHtmlEle | HTMLInputElement | 否 | 原始HTML文件节点 |
| slicingPath | string | 否 | 分片地址， http文件上传接口地址，http全拼 |
<font color='red' >OpenFileReq 对象中 path 和 rawHtmlEle 不可同时为空，同时传入，优先取rawHtmlEle</font>

### <div id="ConnectConfig" >ConnectConfig 对象</div>
##### ConnectConfig 对象为接口请求配置对象，后续接口参数中的ConnectConfig对象同此对象
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| retry | boolean | 否 | 是否重试，不传默认不重试 |
| retryCount | number | 否 | 重试次数，需要开启重试起效 |
| retryInterval | number | 否 | 重试间隔，需要开启重试起效。单位 毫秒 |
| timeout | number | 否 | 发起的请求总的超时时间。重试时间包含在总时间内。不传和传0和0以下的数字，都视为不超时。单位 毫秒 |

### 响应参数
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| - | string | 是 | 文件Id |



## fileDownloadUrlGet 获取文件下载地址

#### 调用接口，传入文件ID，获得文件下载地址

### 请求参数
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| fileId | string | 是 | 文件Id |

### 响应参数
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| - | string | 是 | 文件下载地址 |


## fileClose 文件关闭接口

#### 调用接口，传入文件ID，讲文件关闭。当不再需要某个文件时，调用此接口，释放内存。

### 请求参数
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| fileId | string | 是 | 文件Id |
| options | <a href="#ConnectConfig" >ConnectConfig</a> | 否 | 请求配置对象 |

### 响应参数
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| - | boolean | 是 | 删除是否成功 |


## sealVerifyOne 验证PDF中指定签名域的印章

#### 此接口为单个验章接口


### 请求参数
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| fileId | string | 是 | 文件Id |
| name | string | 是 | 签名域名称 |
| options | <a href="#ConnectConfig" >ConnectConfig</a> | 否 | 请求配置对象 |

### 响应参数
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| - | <a href="#SealVerifyInfo" >SealVerifyInfo</a> | 是 | 验章结果对象，下文中验证PDF中所有印章接口中的SealVerifyInfo对象同此对象 |

### <div id="SealVerifyInfo" >SealVerifyInfo 对象</div>
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| verifyResult | boolean | 是 | 验证是否成功 |
| verifyMsg | string | 否 | 错误信息 仅在失败时返回 |
| sealSingerCert | string | 是 | 签章者证书 |
| sealMakerCert | string | 是 | 制章者证书 |
| eSealInfo | <a href="#ESealInfo" >ESealInfo</a> | 是 | 电子印章信息 |
| signatureInfo | <a href="#SignatureInfo" >SignatureInfo</a> | 是 | 签章信息 |
| makerCertInfo | <a href="#MakerCertInfo" >MakerCertInfo</a> | 是 | 制章者信息 |
| singerCertInfo | <a href="#SingerCertInfo" >SingerCertInfo</a> | 是 | 签章者信息 |


### <div id="ESealInfo" >ESealInfo 对象</div>
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| id | string | 是 | 电子印章标识 |
| version | string | 是 | 电子印章版本 |
| vId | string | 是 | 厂商ID |
| esId | string | 是 | 电子印章唯一编码 |
| sealName | string | 是 | 印章名称 |
| sealMakeTime | string | 是 | 印章制作时间 |
| sealBeginTime | string | 是 | 印章有效期开始时间 |
| sealEndTime | string | 是 | 印章有效期结束时间 |


### <div id="SignatureInfo" >SignatureInfo 对象</div>
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| signatureName | string | 是 | 签名域名称 |
| userName | string[] | 是 | 签章者名称 |
| time | string | 是 | 签章时间 |
| page | Number | 是 | 页码 |
| sealMakerName | string | 是 | 制章者姓名 |

### <div id="MakerCertInfo" >MakerCertInfo 对象</div>
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| serialNumber | string | 是 | 制章者证书序列号 |
| signAlg | string | 是 | 签名算法 |
| ownerName | string | 是 | 证书所有者名称 |
| issueName | string | 是 | 颁发者名称 |
| beginTime | string | 是 | 有效期开始时间 |
| endTime | string | 是 | 有效期结束时间 |


### <div id="SingerCertInfo" >SingerCertInfo 对象</div>
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| serialNumber | string | 是 | 制章者证书序列号 |
| signAlg | string | 是 | 签名算法 |
| ownerName | string | 是 | 证书所有者名称 |
| issueName | string | 是 | 颁发者名称 |
| beginTime | string | 是 | 有效期开始时间 |
| endTime | string | 是 | 有效期结束时间 |



## sealVerifyAll 验证PDF中所有印章

#### 调用此接口，验证PDF中所有印章

### 请求参数
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| fileId | string | 是 | 文件Id |
| options | <a href="#ConnectConfig" >ConnectConfig</a> | 否 | 请求配置对象 |

### 响应参数
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| - | <a href="#SealVerifyInfo" >SealVerifyInfo</a>[] | 是 | 验章结果对象集合 |


## sealList 获取印章列表

#### 此接口为获取usbkey中印章列表的接口

### 请求参数
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| password | string | 是 | usbkey设备密码 |
| options | <a href="#ConnectConfig" >ConnectConfig</a> | 否 | 请求配置对象 |

### 响应参数
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| - | <a href="#SealListRsp" >SealListRsp</a> | 是 | 印章查询接口结果对象 |

### <div id="SealListRsp" >SealListRsp 对象</div>
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| sealInfoVo | <a href="#SealListInfo" >SealListInfo</a>[] | 是 | 印章对象集合 |
| total | number | 是 | 印章总数 |

### <div id="SealListInfo" >SealListInfo 对象</div>
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| id | string | 是 | 印章Id |
| sealType | string | 是 | 印章类型："01":"法定名称章"; "02":"财务专用章"; "03":"发票专用章"; "04":"合同专用章"; "05":"电子名章"; "11":"业务专用章" |
| sealCode | string | 是 | 印章编码 |
| sealMsg | string | 是 | 印章名 |
| algType | string | 是 | 算法类型 |
| seal | string | 是 | 印章结构体 |
| startTime | string | 是 | 有效期开始时间 时间戳 |
| endTime | string | 是 | 有效期结束时间 时间戳 |
| width | string | 是 | 印章宽,单位：毫米 |
| height | string | 是 | 印章高,单位 毫米 |
| sealImg | string | 是 | 印章图片base64 不带前缀 |

## signatureByPosition 坐标签章

#### 此接口为坐标签章接口，传入要签章的位置信息，就可以在指定的位置盖章

### 请求参数
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| fileId | string | 是 | 文件Id |
| sealId | string | 是 | 印章Id |
| positions | <a href="#SignatureByPositionInfo" >SignatureByPositionInfo</a>[] | 是 | 坐标信息对象数组 |
| password | string | 是 | 当前插入usbkey设备密码 |
| options | <a href="#ConnectConfig" >ConnectConfig</a> | 否 | 请求配置对象 |

### <div id="SignatureByPositionInfo" >SignatureByPositionInfo 对象</div>
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| pageNo | number | 是 | 页码 |
| x | number | 是 | x位置坐标。单位：毫米。坐标原点 页面左下角。 |
| y | number | 是 | y位置坐标。单位：毫米。坐标原点 页面左下角。 |

### 响应参数
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| - | string | 是 | 签章完成后新的文件Id |


## signatureByKeywords 关键字签章

#### 此接口为关键字签章接口，传入要签章的关键字，就可以在指定的关键字的位置盖章

### 请求参数
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| params | <a href="#SignatureByKeywordsReq" >SignatureByKeywordsReq</a> | 是 | 关键字签章请求对象 |
| options | <a href="#ConnectConfig" >ConnectConfig</a> | 否 | 请求配置对象 |

### <div id="SignatureByKeywordsReq" >SignatureByKeywordsReq 对象</div>
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| sealId | string | 是 | 印章id |
| fileId | string | 是 | 文件id |
| password | string | 是 | 当前插入usbkey设备密码 |
| keywords | string | 是 | 关键字 |
| offset | number | 否 | 偏移量 |
| hitNo | number | 否 | 命中序号 |

### 响应参数
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| - | string | 是 | 签章完成后新的文件Id |


## signatureByGap 骑缝签章

#### 此接口为骑缝签章接口

### 请求参数
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| params | <a href="#SignatureByGapReq" >SignatureByGapReq</a> | 是 | 骑缝签章请求对象 |
| options | <a href="#ConnectConfig" >ConnectConfig</a> | 否 | 请求配置对象 |

### <div id="SignatureByGapReq" >SignatureByGapReq 对象</div>
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| sealId | string | 是 | 印章id |
| fileId | string | 是 | 文件id |
| x | number | 是 | x位置 |
| y | number | 是 | y 位置 |
| splitPageNum | number | 否 | 多少页拆分一个印章 |
| type | "all" , "odd" , "pair" | 是 | 盖章类型：all:  所有页、odd: 单数页、pair: 双数页 |
| password | string | 是 | 当前插入usbkey设备密码 |

### 响应参数
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| - | string | 是 | 签章完成后新的文件Id |


## 接口错误

#### 当接口发生异常时，回返回错误原因，其中，有两种错误回返回指定字符串
1.当请求超时时候，返回：请求超时
2.当网络错误时候，返回：网络错误

其他错误回返回具体错误原因


## 全局接口请求配置

#### 上文的接口描述中，每个需要网络请求的接口，都会有options的参数，用来配置单次请求的配置，除此之外，我们还提供了专门的方法设置全局请求配置

configMgr 对象为全局接口请求配置对象，其中有两个方法

configMgr.connectGet 获取当前全局接口请求配置对象，返回<a href="#ConnectConfig" >ConnectConfig</a>对象

configMgr.connectSet 传入<a href="#ConnectConfig" >ConnectConfig</a>对象 配置全局接口请求配置（如果单次接口请求传入了options,以接口传入的为准）



# <div id="d4">使用技巧</div>

## 使用async/await

```typescript
import { fileOpen } from "@byzk/pdf-signature-utils";
async function FileOpenTest(){
    try {
        const fileId = await fileOpen({name:'测试文件.pdf', rawHtmlEle:document.getElementById("uploadinput")});
        alert('文件打开成功，文件Id请见控制台');
        console.info(fileId);
    } catch (error) {
        console.info(error);
    }
}
```