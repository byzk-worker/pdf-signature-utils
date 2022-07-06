# pdf-signature-utils
pdf签章工具库，主要为签章解决方案， 此库为签章相关接口调用库.

# 目录

<a href="#d1">安装</a>

<a href="#d2">示例</a>

<a href="#d3">API简介</a>

<a href="#d4">使用技巧</a>

<a href="#d5">其他</a>

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
const pdfSignatureUtils = require('@byzk/usbkey-request-base').default;
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
import {fileOpen} from "@byzk/usbkey-request-base"; 
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

## fileOpen

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