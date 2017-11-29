export default {
  input: './src/leaflet.js',
  external: ['echarts'],
  output: {
    name: 'leaflet',
    format: 'umd',
    globals: {
      echarts: 'echarts'
    },
    file: './dist/echarts-leaflet.js'
  }
};