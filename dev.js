const { exit } = require("process");
const fs = require("fs");
const fsExtend = require("fs-extra");

console.info("清理中...");
try {
    fsExtend.removeSync('./build')
} catch (error) {
}
console.info("清理完毕");

console.info("挂载编译和rollup监控")
const crossSpwan = require("cross-spawn");
crossSpwan.spawn("rollup --config rollup.config.dev.ts --configPlugin typescript2 -w", { stdio: 'inherit' });