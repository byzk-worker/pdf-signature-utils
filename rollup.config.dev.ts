import { RollupOptions } from "rollup";
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import babel from 'rollup-plugin-babel';
import { terser } from "rollup-plugin-terser";

const Global = `var process = {
    env: {
      NODE_ENV: 'development'
    }
  };\n`;

const configs: RollupOptions = {
    input: "src/index.ts",
    output: {
        file: "build/index.js",
        format: "iife",
        name: "pdfSignatureUtils",
        banner: Global,
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
        // terser({
        //     ie8: true,
        //     compress: {
        //         drop_console: true,
        //         drop_debugger: true,
        //         ie8: true,
        //     },
        //     output: {
        //         ie8: true,
        //         comments: () => false,
        //     },
        // }),
    ],
}

export default configs;