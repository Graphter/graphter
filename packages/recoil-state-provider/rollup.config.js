import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import resolve from 'rollup-plugin-node-resolve'
import typescriptPlugin from 'rollup-plugin-typescript2'
import typescript from 'typescript';
import json from 'rollup-plugin-json';

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
    babel({
      exclude: 'node_modules/**',
      plugins: [ '@babel/plugin-proposal-export-default-from' ]
    }),
    resolve(),
    commonjs({
      namedExports: {
        'recoil': [
          'RecoilRoot',
          'useRecoilState',
          'useRecoilValue',
          'useResetRecoilState',
          'useRecoilValueLoadable',
          'useRecoilCallback',
          'atom',
          'selector' ]
      }
    }),
    json()
  ]
}
