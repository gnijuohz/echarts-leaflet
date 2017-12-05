# ECharts leaflet extension

[![Build Status](https://travis-ci.org/gnijuohz/echarts-leaflet.svg?branch=master)](https://travis-ci.org/gnijuohz/echarts-leaflet)

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
layers.

The default tile layer uses `http://{s}.tile.osm.org/{z}/{x}/{y}.png`

```javascript
option = {
  leaflet: {
      center: [120.13066322374, 30.240018034923],
      zoom: 3,
      roam: true,
      tiles: [{
        label: 'OpenStreetMap',
        urlTemplate: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        options: {
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
        }
      }]
  },
  series: [{
    coordinateSystem: 'leaflet',
  }]
}
```

Specify multiple layers. You can choose a base layer to use via the layer control.

```javascript
{
  layerControl: {
    position: 'topleft'
  },
  tiles: [{
    label: '天地图',
    urlTemplate: 'http://t2.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}',
    options: {
      attribution: 'tianditu.com'
    }
  }, {
    label: 'Open Street Map',
    urlTemplate: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    options: {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
    }
  }]
}
```

If you don't specify a label for a tile, it won't show up in the layer control. Therefore the following option will add two base layers to the map and there is no way to switch between them.

```javascript
{
  layerControl: {
    position: 'topleft'
  },
  tiles: [{
    urlTemplate: 'http://t2.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}',
    options: {
      attribution: 'tianditu.com'
    }
  }, {
    urlTemplate: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    options: {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
    }
  }]
}
```



## Demo

- [全国空气质量(Air quality in China)](http://gnijuohz.github.io/echarts-leaflet/example/leaflet-multiple-layers.html)

## Build

- `npm install`
- `rollup --config`

## License

MIT