import path from "path";
import typescript from 'rollup-plugin-typescript2';
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";

export default {
  input: ["./src/index.ts"],
  output: {
    file: "./dist/bundle.js",
    format: "umd",
    name: "PowerMonitor" // 生成包的名字
  },
  plugins: [
    commonjs(),
    babel({
      babelHelpers: 'runtime',
      exclude: '**/node_modules/**',
    }),
    typescript({
      tsconfig: path.resolve(__dirname, "./tsconfig.json")
    }),
  ],
}