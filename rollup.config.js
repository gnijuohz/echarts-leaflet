import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';


export default [{
  input: './src/Leaflet.js',
  external: ['echarts/lib/echarts', 'leaflet/src/Leaflet'],
  output: {
    name: 'leaflet',
    format: 'umd',
    globals: {
      'echarts/lib/echarts': 'echarts',
      'leaflet/src/Leaflet': 'L',
    },
    file: './dist/echarts-leaflet.js',
  },
  plugins: [
    resolve(),
    commonjs({
      namedExports: {
        'node_modules/echarts/lib/echarts.js': 'echarts',
        'node_modules/leaflet/src/Leaflet.js': 'L',
      },
    }),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
},
{
  input: './src/Leaflet.js',
  external: ['echarts/lib/echarts', 'leaflet/src/Leaflet'],
  output: {
    name: 'leaflet',
    format: 'es',
    globals: {
      'echarts/lib/echarts': 'echarts',
      'leaflet/src/Leaflet': 'L',
    },
    file: './dist/echarts-leaflet.esm.js',
  },
  plugins: [
    resolve(),
    commonjs({
      namedExports: {
        'node_modules/echarts/lib/echarts.js': 'echarts',
        'node_modules/leaflet/src/Leaflet.js': 'L',
      },
    }),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
}];
