import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import resolve from 'rollup-plugin-node-resolve'
import url from 'rollup-plugin-url'
import typescriptPlugin from 'rollup-plugin-typescript2'
import typescript from 'typescript';
import svgr from '@svgr/rollup'

import pkg from './package.json'

const externals = [
  ...Object.keys(pkg.peerDependencies),
  ...Object.keys(pkg.dependencies)
];
console.log('externals', externals);

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    }
  ],
  plugins: [
    //{ load(id) {console.log(id)} }, // For debugging build process
    external(externals),
    typescriptPlugin({
      typescript
    }),
    postcss({
      modules: true
    }),
    url(),
    svgr(),
    babel({
      exclude: 'node_modules/**',
      plugins: [ '@babel/plugin-proposal-export-default-from' ]
    }),
    resolve(),
    commonjs()
  ]
}
