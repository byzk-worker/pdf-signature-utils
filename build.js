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
const buildRsp = crossSpwan.sync("rollup --config rollup.config.es.ts --configPlugin typescript2");
if (buildRsp.error) {
    console.error(buildRsp.error);
    exit(buildRsp.status);
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


console.info("移除不必要文件...");
try {
    fs.unlinkSync('./build/index.config.d.ts')
} catch { }
console.info("打包完毕");
