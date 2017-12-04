import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default [
  {
    input: './src/leaflet.js',
    external: ['echarts'],
    output: {
      name: 'leaflet',
      format: 'umd',
      globals: {
        echarts: 'echarts',
      },
      file: './dist/echarts-leaflet.js',
    },
    plugins: [
      resolve(),
      babel({
        exclude: 'node_modules/**',
      }),
    ],
  }, {
    input: './src/leaflet.js',
    external: ['echarts'],
    output: {
      name: 'leaflet',
      format: 'umd',
      globals: {
        echarts: 'echarts',
      },
      file: './dist/echarts-leaflet.es6.js',
    },
  },
];