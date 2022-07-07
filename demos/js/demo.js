const { fileOpen, fileDownloadUrlGet, fileClose, sealList, signatureByPosition, signatureByGap, signatureByKeywords } = pdfSignatureUtils;

function isNull(e) {
    return e === null || e === undefined || e === '';
}

async function openFile() {
    try {
        const input = document.getElementById("uploadInput");
        const file = input.files[0];
        const fileName = file.name;
        const fileId = await fileOpen({ name: fileName, rawHtmlEle: input });
        alert('打开文件成功，文件Id见控制台');
        console.info(fileId);
        sessionStorage.setItem('fileId', fileId);
        sessionStorage.setItem('fileName', fileName);
        document.getElementById('uploadInput').value = '';
    } catch (error) {
        alert(error);
    }
}

function downloadFile() {
    try {
        const fileId = sessionStorage.getItem('fileId');
        const fileName = sessionStorage.getItem('fileName');
        if (isNull(fileId)) {
            alert('请先打开文件');
            return;
        }
        const xhr = new XMLHttpRequest();
        xhr.onload = function (e) {
            const blob = new Blob([xhr.response]);
            let link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            link.remove();
            window.URL.revokeObjectURL(link.href);
        }
        xhr.open('GET', fileDownloadUrlGet(fileId));
        xhr.responseType = "blob";
        xhr.send();
    } catch (error) {
        alert(error);
    }
}

async function closeFile() {
    try {
        const fileId = sessionStorage.getItem('fileId');
        if (isNull(fileId)) {
            alert('请先打开文件');
            return;
        }
        await fileClose(fileId);
        sessionStorage.removeItem('fileId');
        sessionStorage.removeItem('fileName');
        alert('文件关闭成功');
    } catch (error) {
        alert(error)
    }
}

async function getSealId() {
    try {
        var password = prompt("请插入usbkey，并输入usbkey密码：");
        if (isNull(password)) {
            alert('请输入密码!');
            return;
        }
        var seals = await sealList(password);
        if (seals.total <= 0) {
            alert('当前usbkey中没有印章!');
            return;
        }
        return Promise.resolve({ sealId: seals.sealInfoVo[0].id, password });
    } catch (error) {
        return Promise.reject(error);
    }
}

async function postionSeal() {
    try {
        const fileId = sessionStorage.getItem('fileId');
        if (isNull(fileId)) {
            alert('请先打开文件');
            return;
        }
        const { sealId, password } = await getSealId();
        let postions = [];
        let postionCount = 1;
        while (true) {
            alert(`开始录入第${postionCount}组坐标信息`);
            let postion = { pageNo: 0, x: 0, y: 0 };
            while (true) {
                try {
                    postion.pageNo = parseInt(prompt('请输入页码:'));
                    if (postion.pageNo <= 0) {
                        alert('请输入正确的页码');
                        continue;
                    }
                } catch (error) {
                    alert('请输入正确的页码');
                    continue;
                }
                break;
            }
            while (true) {
                try {
                    postion.x = parseInt(prompt('请输入x坐标:'));
                } catch (error) {
                    alert('请输入正确的x坐标');
                    continue;
                }
                break;
            }
            while (true) {
                try {
                    postion.y = parseInt(prompt('请输入y坐标:'));
                } catch (error) {
                    alert('请输入正确的y坐标');
                    continue;
                }
                break;
            }
            postions.push(postion);
            var isContinue = confirm(`已完成第${postionCount}组坐标录入，是否继续录入下一组？`);
            if (isContinue) {
                postionCount++;
                continue;
            }
            break;
        }
        var isSeal = confirm(`当前共${postionCount}组坐标，是否盖章？`);
        if (!isSeal) {
            alert('盖章取消');
            return;
        }
        const newfileId = await signatureByPosition(fileId, sealId, postions, password);
        sessionStorage.setItem('fileId', newfileId);
        alert('盖章成功，新的文件Id见控制台');
        console.info(newfileId);
    } catch (error) {
        alert(error);
    }
}

async function keywordSeal() {
    try {
        const fileId = sessionStorage.getItem('fileId');
        if (isNull(fileId)) {
            alert('请先打开文件');
            return;
        }
        const { sealId, password } = await getSealId();
        let keyword = prompt('请输入要盖章的关键字:');
        if (isNull(keyword)) {
            alert('请输入关键字!');
            return;
        }
        let offset = prompt('请输入偏移量,如不需要，请点取消');
        if (!isNull(offset)) {
            try {
                offset = parseInt(offset);
            } catch (error) {
                alert('请输入正确的偏移量');
                return;
            }
        }
        const newfileId = await signatureByKeywords({ fileId, sealId, password, keywords: keyword, offset });
        sessionStorage.setItem('fileId', newfileId);
        alert('盖章成功，新的文件Id请见控制台');
        console.info(newfileId);

    } catch (error) {
        alert(error);
    }
}

async function gapSeal() {
    try {
        const fileId = sessionStorage.getItem('fileId');
        if (isNull(fileId)) {
            alert('请先打开文件');
            return;
        }
        const { sealId, password } = await getSealId();
        let x = prompt('请输入x坐标');
        try {
            x = parseInt(x);
        } catch (error) {
            alert('请输入正确的坐标');
            return;
        }
        let y = prompt('请输入y坐标');
        try {
            y = parseInt(y);
        } catch (error) {
            alert('请输入正确的坐标');
            return;
        }
        let splitPageNum = prompt('请输入多少页拆分一个章，不设置请点取消');
        if (isNull(splitPageNum)) {
            splitPageNum = undefined;
        } else {
            try {
                splitPageNum = parseInt(splitPageNum);
                if (splitPageNum <= 0) {
                    alert('请输入正确的数字');
                    return;
                }
            } catch (error) {
                alert('请输入正确的数字');
                return;
            }
        }
        let type = prompt('请输入盖章类型（填入 all 或 odd 或 pair）：')
        if (type !== 'all' && type !== 'odd' && type !== 'pair') {
            alert('请输入正确的盖章类型');
            return;
        }
        const newfileId = await signatureByGap({ fileId, sealId, x, y, splitPageNum, type, password });
        sessionStorage.setItem('fileId', newfileId);
        alert('盖章成功，新的文件Id请见控制台');
        console.info(newfileId);
    } catch (error) {
        alert(error);
    }
}