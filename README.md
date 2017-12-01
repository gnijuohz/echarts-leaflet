# ECharts leaflet extension

## Usage

```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.1.0/dist/leaflet.css" integrity="sha512-wcw6ts8Anuw10Mzh9Ytw4pylW8+NAD4ch3lqm9lzAsTxg0GFeJgoAtxuCLREZSC5lUXdVyo/7yfsqFjQ4S+aKw=="
        crossorigin="" />
<script type="text/javascript" src="./lib/echarts.min.js"></script>
<script src="./lib/leaflet.js" integrity="sha512-mNqn2Wg7tSToJhvHcqfzLMU6J4mkOImSPTxVZAdo+lcPlk+GhZmYgACEe0x35K7YzW1zJ7XyJV/TT1MrdXvMcA=="
    crossorigin=""></script>
<script type="text/javascript" src="../dist/echarts-leaflet.js"></script>
```

### ECharts Option

The configuration is just like `geo`,

```javascript
option = {
  leaflet: {
      center: [120.13066322374, 30.240018034923],
      zoom: 3,
      roam: true,
      // the default is http://{s}.tile.osm.org/{z}/{x}/{y}.png
      tile: {
        url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
      }
  },
  series: [{
    coordinateSystem: 'leaflet',
  }]
}

option = {
  leaflet: {
      ...
      tile: {
        // url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        // url: { 
          // "天地图": L.tileLayer('http://t2.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}').addTo(map), (地图瓦片) 
          // "天地图": L.tileLayer('http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}').addTo(map) (地区文字标识) 
        //},
        // url: [
          // ['天地图','高德地图'], (key 名字)
          // ['http://t2.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}', 'http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}']
        // ]
      }
  }
  ...
}
```

## Demo

- [全国空气质量(Air quality in China)](http://gnijuohz.github.io/echarts-leaflet/example/leaflet.html)

## Build

`rollup --config`