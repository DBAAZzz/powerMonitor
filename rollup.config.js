import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";

export default {
    input: ["./index.js"],
    output: {
        // file: "./dist/bundle.js",
        file: "../simple-router/src/utils/bundle.js",
        format: "umd",
        name: "PowerMonitor" // 生成包的名字
    },
    plugins: [resolve(), commonjs(), babel({
        babelHelpers: 'runtime',
        exclude: '**/node_modules/**',
    })],
}