import { RollupOptions } from "rollup";
import { terser } from 'rollup-plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import babel from 'rollup-plugin-babel';

const configs: RollupOptions = {
    input: "src/index.ts",
    output: {
        file: "build/index.js",
        format: "es",
        name: "byzkutiltest"
    },
    plugins: [
        typescript(),
        commonjs(),
        resolve({ browser: true, preferBuiltins: true }),
        babel({
            exclude: "node_modules/**", // 防止打包node_modules下的文件
            plugins: [
                //  多次导入的文件，只导入一次
                ["@babel/plugin-transform-runtime"],
            ]
        }),
        // terser(), //压缩代码
    ],
    external: [
        "spark-md5",
    ]
}

export default configs;