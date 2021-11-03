import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";

export default {
    input: ["./index.js"],
    output: {
        file: "../simple/src/utils/bundle.js",
        format: "umd",
        name: "experience"
    },
    plugins: [resolve(), commonjs(), babel({
        babelHelpers: 'runtime',
        exclude: '**/node_modules/**',
    })],
}