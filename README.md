# ECharts leaflet extension

[![Build Status](https://travis-ci.org/gnijuohz/echarts-leaflet.svg?branch=master)](https://travis-ci.org/gnijuohz/echarts-leaflet)

## Install

`npm i echarts-leaflet`

## Usage

There are two ways to use this extension, the two examples in the `example` folder demonstrate each approach.

### Use it directly through the script tag

```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.1.0/dist/leaflet.css" integrity="sha512-wcw6ts8Anuw10Mzh9Ytw4pylW8+NAD4ch3lqm9lzAsTxg0GFeJgoAtxuCLREZSC5lUXdVyo/7yfsqFjQ4S+aKw==" crossorigin="" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/echarts/4.0.4/echarts-en.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/leaflet.js"></script>
<script src="../dist/echarts-leaflet.js"></script>
```

See [this example](./example/leaflet-multiple-layers.html).

### Use it as ES Module

```
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/scatter';
import 'echarts/lib/chart/effectScatter';

import 'echarts-leaflet';
```

See [this example](./example/leaflet-single-layer.html). To run it, use `parcel leaflet-single-layer.html`. The usage of parcel can be found [here](https://parceljs.org/).

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

- `yarn install`
- `rollup --config`

## Contributors

- [Jing Zhou](https://github.com/gnijuohz)
- [UltramanWeiLai](https://github.com/UltramanWeiLai)
- [Poyoman39](https://github.com/Poyoman39)

## License

MIT
