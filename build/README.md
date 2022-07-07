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
| req | OpenFileReq | 是 | 请求参数对象 |
| options | ConnectConfig | 否 | 请求配置对象 |

### OpenFileReq 对象
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| name | string | 是 | 名称 |
| path | string | 是 | 路径 |
| rawHtmlEle | HTMLInputElement | 否 | 原始HTML文件节点 |
| slicingPath | string | 否 | 分片地址， http文件上传接口地址，http全拼 |

### ConnectConfig 对象
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
| options | ConnectConfig | 否 | 请求配置对象 |

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
| options | ConnectConfig | 否 | 请求配置对象 |

### 响应参数
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| - | SealVerifyInfo | 是 | 验章结果对象，下文中验证PDF中所有印章接口中的SealVerifyInfo对象同此对象 |

### SealVerifyInfo 对象
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| signatureName | string | 是 | 签名域名称 |
| verifyResult | boolean | 是 | 验证结果 |
| verifyMsg | string | 否 | 错误信息 当 verifyResult 为 false 时 ，此值有内容 |
| time | string | 是 | 签名时间 时间戳 |
| page | number | 是 | 印章所在页码 |
| userName | string[] | 是 | 签章人姓名 |


## sealVerifyAll 验证PDF中所有印章

#### 调用此接口，验证PDF中所有印章

### 请求参数
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| fileId | string | 是 | 文件Id |
| options | ConnectConfig | 否 | 请求配置对象 |

### 响应参数
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| - | SealVerifyInfo[] | 是 | 验章结果对象集合 |


## sealList 获取印章列表

#### 此接口为获取usbkey中印章列表的接口

### 请求参数
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| password | string | 是 | usbkey设备密码 |
| options | ConnectConfig | 否 | 请求配置对象 |

### 响应参数
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| - | SealListRsp | 是 | 印章查询接口结果对象 |

### SealListRsp 对象
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| sealInfoVo | SealListInfo[] | 是 | 印章对象集合 |
| total | number | 是 | 印章总数 |

### SealListInfo 对象
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| id | string | 是 | 印章Id |
| sealType | string | 是 | 印章类型："1":"机构印章"，"2":"个人印章" |
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
| positions | SignatureByPositionInfo[] | 是 | 坐标信息对象数组 |
| password | string | 是 | 当前插入usbkey设备密码 |
| options | ConnectConfig | 否 | 请求配置对象 |

### SignatureByPositionInfo 对象
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| pageNo | number | 是 | 页码 |
| x | number | 是 | x位置坐标，单位： |
| y | number | 是 |  |

### 响应参数
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| - | string | 是 | 签章完成后新的文件Id |


## signatureByKeywords 关键字签章

#### 此接口为关键字签章接口，传入要签章的关键字，就可以在指定的关键字的位置盖章

### 请求参数
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| params | SignatureByKeywordsReq | 是 | 关键字签章请求对象 |
| options | ConnectConfig | 否 | 请求配置对象 |

### SignatureByKeywordsReq 对象
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
| params | SignatureByGapReq | 是 | 骑缝签章请求对象 |
| options | ConnectConfig | 否 | 请求配置对象 |

### SignatureByGapReq 对象
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

####上文的接口描述中，每个需要网络请求的接口，都会有options的参数，用来配置单次请求的配置，除此之外，我们还提供了专门的方法设置全局请求配置

configMgr 对象为全局接口请求配置对象，其中有两个方法

configMgr.connectGet 获取当前全局接口请求配置对象，返回ConnectConfig对象

configMgr.connectSet 传入ConnectConfig对象 配置全局接口请求配置（如果单次接口请求传入了options,以接口传入的为准）



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