const { exit } = require("process");
const fs = require("fs");
const fsExtend = require("fs-extra");

console.info("清理中...");
try {
    fsExtend.removeSync('./build')
} catch (error) {
}
console.info("清理完毕");


console.info("开始编译...")
const crossSpwan = require("cross-spawn");
const buildRsp = crossSpwan.sync("rollup --config rollup.config.build.ts --configPlugin typescript2");
if (buildRsp.error) {
    console.error(buildRsp.error);
    exit(buildRsp.status);
}
const buildRsp2 = crossSpwan.sync("rollup --config rollup.config.dev.ts --configPlugin typescript2");
if (buildRsp2.error) {
    console.error(buildRsp2.error);
    exit(buildRsp2.status);
}
console.info("编译完成!");


console.info("生成 package.json");
const packageInfo = require("./package.json");
delete packageInfo.devDependencies;
delete packageInfo.scripts;
delete packageInfo.jest;
delete packageInfo.dependencies["@bk/usbkey-lib"];
try {
    fs.writeFileSync('./build/package.json', JSON.stringify(packageInfo, null, 3), { encoding: 'utf-8', mode: 438 });
} catch (error) {
    console.error(error);
    exit(1);
}
console.info("生成完成");


console.info("复制README.md");
try {
    fsExtend.copySync('./README.md', './build/README.md');
} catch (error) {
    console.error(error);
    exit(1);
}
console.info("复制完成");

console.info("复制demos文件夹");
try {
    fsExtend.copySync('./demos', './build/demos');
} catch (error) {
    exit(1);
}
console.info("复制完成");


console.info("移动打包文件");
try {
    fs.mkdirSync('./build/dist');
    fsExtend.moveSync('./build/pdf-signature-utils-es.min.js', './build/dist/pdf-signature-utils-es.min.js');
    fsExtend.moveSync('./build/pdf-signature-utils-cjs.min.js', './build/dist/pdf-signature-utils-cjs.min.js');
    fsExtend.moveSync('./build/pdf-signature-utils-iife.min.js', './build/dist/pdf-signature-utils-iife.min.js');
} catch (error) {
    console.error(error);
    exit(1);
}
console.info("移动完成");


console.info("移除不必要文件...");
try {
    // fs.unlinkSync('./build/index.config.d.ts');
    fsExtend.removeSync('./build/utils');
    fsExtend.removeSync('./build/service');
} catch { }
console.info("打包完毕");
