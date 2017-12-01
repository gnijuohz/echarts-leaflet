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

## ECharts Option

You can use one or more tile layers via the `tiles` option. It's an array of
layers. You can specify the options of layer control when you have more than 1
layer.

The default tile layer is `http://{s}.tile.osm.org/{z}/{x}/{y}.png`

```javascript
option = {
  leaflet: {
      center: [120.13066322374, 30.240018034923],
      zoom: 3,
      roam: true,
      tiles: [{
        text: 'OpenStreetMap',
        url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
      }]
  },
  series: [{
    coordinateSystem: 'leaflet',
  }]
}
```

Specify multiple layers:
```javascript
options = {
	leaflet: {
    ...
		layerControl: {
      position: 'topleft'
    },
    tiles: [{
      text: '天地图',
      url: 'http://t2.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}',
      attribution: 'tianditu.com'
    }, {
      text: 'Open Street Map',
      url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
    }]
    ...
	},
	...
}
```

## Demo

- [全国空气质量(Air quality in China)](http://gnijuohz.github.io/echarts-leaflet/example/leaflet.html)

## Build

`rollup --config`