import path from 'path'
import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'

const rollupPlugins = [
  commonjs(),
  babel({
    babelHelpers: 'runtime',
    exclude: '**/node_modules/**'
  }),
  typescript({
    tsconfig: path.resolve(__dirname, './tsconfig.json')
  })
]

module.exports = [
  {
    input: ['./src/index.ts'],
    output: {
      file: './dist/powerMonitor.min.js',
      format: 'umd',
      name: 'PowerMonitor' // 生成包的名字
    },
    plugins: [...rollupPlugins, terser()]
  },
  {
    input: ['./src/index.ts'],
    output: {
      file: './dist/powerMonitor.common.js',
      format: 'cjs',
      name: 'PowerMonitor' // 生成包的名字
    },
    plugins: rollupPlugins
  }
]
