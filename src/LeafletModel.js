import * as echarts from 'echarts';

/**
 * compare if two arrays of length 2 are equal
 * @param {Array} a array of length 2
 * @param {Array} b array of length 2
 * @return {Boolean}
 */
function v2Equal(a, b) {
  return a && b && a[0] === b[0] && a[1] === b[1];
}

export default echarts.extendComponentModel({
  type: 'leaflet',

  getLeaflet: function() {
    // __map is injected when creating BMapCoordSys
    return this.__map;
  },

  setCenterAndZoom: function(center, zoom) {
    this.option.center = center;
    this.option.zoom = zoom;
  },

  centerOrZoomChanged: function(center, zoom) {
    let option = this.option;
    return !(v2Equal(center, option.center) && zoom === option.zoom);
  },

  defaultOption: {
    center: [104.114129, 37.550339],
    zoom: 2,
    mapStyle: {},
    roam: false,
    tile: {
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    },
  },
});
