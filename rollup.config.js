// Rollup plugins
import babel from 'rollup-plugin-babel'

export default {
  input: 'examples/render/index.js',
  output: {
    file: 'build/bundle.js',
    format: 'umd',
    name: 'yreact'
  },
  sourcemap: 'inline',
  plugins: [
    babel({
      exclude: 'node_modules/**',
    })
  ],
}