
import {
  // util as zrUtil,
  graphic,
  matrix,
} from 'echarts';

/**
 * constructor for Leaflet CoordSys
 * @param {L.map} map
 * @param {Object} api
 */
function LeafletCoordSys(map, api) {
  this._map = map;
  this.dimensions = ['lng', 'lat'];
  this._mapOffset = [0, 0];

  this._api = api;

  this._projection = L.Projection.Mercator;
}

LeafletCoordSys.prototype.dimensions = ['lng', 'lat'];


LeafletCoordSys.prototype.dimensions = ['lng', 'lat'];

LeafletCoordSys.prototype.setZoom = function(zoom) {
  this._zoom = zoom;
};

LeafletCoordSys.prototype.setCenter = function(center) {
  this._center = this._projection.project(new L.LatLng(center[1], center[0]));
};

LeafletCoordSys.prototype.setMapOffset = function(mapOffset) {
  this._mapOffset = mapOffset;
};

LeafletCoordSys.prototype.getLeaflet = function() {
  return this._map;
};

LeafletCoordSys.prototype.dataToPoint = function(data) {
  let point = new L.LatLng(data[1], data[0]);
  let px = this._map.latLngToLayerPoint(point);
  let mapOffset = this._mapOffset;
  return [px.x - mapOffset[0], px.y - mapOffset[1]];
};

LeafletCoordSys.prototype.pointToData = function(pt) {
  let mapOffset = this._mapOffset;
  const coord = this._map.layerPointToLatLng({
    x: pt[0] + mapOffset[0],
    y: pt[1] + mapOffset[1],
  });
  return [coord.lng, coord.lat];
};

LeafletCoordSys.prototype.getViewRect = function() {
  let api = this._api;
  return new graphic.BoundingRect(0, 0, api.getWidth(), api.getHeight());
};

LeafletCoordSys.prototype.getRoamTransform = function() {
  return matrix.create();
};

LeafletCoordSys.dimensions = LeafletCoordSys.prototype.dimensions;

L.CustomOverlay = L.Layer.extend({

  initialize: function(container) {
    this._container = container;
  },

  onAdd: function(map) {
    let pane = map.getPane(this.options.pane);

    pane.appendChild(this._container);

    // Calculate initial position of container with
    // `L.Map.latLngToLayerPoint()`, `getPixelOrigin()
    // and/or `getPixelBounds()`

    // L.DomUtil.setPosition(this._container, point);

    // Add and position children elements if needed

    // map.on('zoomend viewreset', this._update, this);
  },

  onRemove: function(map) {
    L.DomUtil.remove(this._container);
    // map.off('zoomend viewreset', this._update, this);
  },

  _update: function() {
    // Recalculate position of container

    // L.DomUtil.setPosition(this._container, point);

    // Add/remove/reposition children elements if needed
  },
});

LeafletCoordSys.create = function(ecModel, api) {
  let leafletCoordSys;
  let root = api.getDom();

  // TODO Dispose
  ecModel.eachComponent('leaflet', function(leafletModel) {
    let viewportRoot = api.getZr().painter.getViewportRoot();
    if (typeof L === 'undefined') {
      throw new Error('Leaflet api is not loaded');
    }
    if (leafletCoordSys) {
      throw new Error('Only one leaflet component can exist');
    }
    if (!leafletModel.__map) {
      // Not support IE8
      let mapRoot = root.querySelector('.ec-extension-leaflet');
      if (mapRoot) {
        // Reset viewport left and top, which will be changed
        // in moving handler in LeafletView
        viewportRoot.style.left = '0px';
        viewportRoot.style.top = '0px';
        root.removeChild(mapRoot);
      }
      mapRoot = document.createElement('div');
      mapRoot.style.cssText = 'width:100%;height:100%';
      // Not support IE8
      mapRoot.classList.add('ec-extension-leaflet');
      root.appendChild(mapRoot);
      let map = leafletModel.__map = L.map(mapRoot);
      let tile = leafletModel.get('tile');
      let baseLayers = {};
	    if(tile.url instanceof Array){
	        if(tile.url.length >= 2 &&  (tile.url[0] instanceof Array && tile.url[1] instanceof Array) ){
	            for(let i = 0; i < tile.url[0].length; i++) {
	                baseLayers[tile.url[0][i]] = L.tileLayer(tile.url[1][i], { attribution: tile.attribution }).addTo(map);
	            }
	        } else {
	            for(let i = 0; i < tile.url.length; i++) {
	                baseLayers[i] = L.tileLayer(tile.url[i], { attribution: tile.attribution }).addTo(map);
	            }
	        }
	        L.control.layers(baseLayers,{}, { position: "topleft" }).addTo(map);
	    } else {
	        L.tileLayer(tile.url, {
	            attribution: tile.attribution
	        }).addTo(map);
	    }

      new L.CustomOverlay(viewportRoot).addTo(map);
    }
    let map = leafletModel.__map;

    // Set leaflet options
    // centerAndZoom before layout and render
    let center = leafletModel.get('center');
    let zoom = leafletModel.get('zoom');
    if (center && zoom) {
      map.setView([center[1], center[0]], zoom);
    }

    leafletCoordSys = new LeafletCoordSys(map, api);
    leafletCoordSys.setMapOffset(leafletModel.__mapOffset || [0, 0]);
    leafletCoordSys.setZoom(zoom);
    leafletCoordSys.setCenter(center);

    leafletModel.coordinateSystem = leafletCoordSys;
  });

  ecModel.eachSeries(function(seriesModel) {
    if (seriesModel.get('coordinateSystem') === 'leaflet') {
      seriesModel.coordinateSystem = leafletCoordSys;
    }
  });
};

export default LeafletCoordSys;
