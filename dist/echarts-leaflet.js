(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('echarts')) :
	typeof define === 'function' && define.amd ? define(['exports', 'echarts'], factory) :
	(factory((global.leaflet = {}),global.echarts));
}(this, (function (exports,echarts) { 'use strict';

function LeafletCoordSys(map, api) {
    this._map = map;
    this.dimensions = ['lng', 'lat'];
    this._mapOffset = [0, 0];

    this._api = api;

    this._projection = L.Projection.Mercator;
}

LeafletCoordSys.prototype.dimensions = ['lng', 'lat'];



LeafletCoordSys.prototype.dimensions = ['lng', 'lat'];

LeafletCoordSys.prototype.setZoom = function (zoom) {
    this._zoom = zoom;
};

LeafletCoordSys.prototype.setCenter = function (center) {
    this._center = this._projection.project(new L.LatLng(center[1], center[0]));
};

LeafletCoordSys.prototype.setMapOffset = function (mapOffset) {
    this._mapOffset = mapOffset;
};

LeafletCoordSys.prototype.getLeaflet = function () {
    return this.map;
};

LeafletCoordSys.prototype.dataToPoint = function (data) {
    var point = new L.LatLng(data[1], data[0]);
    var px = this._map.latLngToLayerPoint(point);
    var mapOffset = this._mapOffset;
    return [px.x - mapOffset[0], px.y - mapOffset[1]];
};

LeafletCoordSys.prototype.pointToData = function (pt) {
    var mapOffset = this._mapOffset;
    var pt = this._map.layerPointToLatLng({
        x: pt[0] + mapOffset[0],
        y: pt[1] + mapOffset[1]
    });
    return [pt.lng, pt.lat];
};

LeafletCoordSys.prototype.getViewRect = function () {
    var api = this._api;
    return new echarts.graphic.BoundingRect(0, 0, api.getWidth(), api.getHeight());
};

LeafletCoordSys.prototype.getRoamTransform = function () {
    return echarts.matrix.create();
};

LeafletCoordSys.prototype.prepareCustoms = function (data) {
    var rect = this.getViewRect();
    return {
        coordSys: {
            // The name exposed to user is always 'cartesian2d' but not 'grid'.
            type: 'leaflet',
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height
        },
        api: {
            coord: echarts.util.bind(this.dataToPoint, this),
            size: echarts.util.bind(dataToCoordSize, this)
        }
    };
};

function dataToCoordSize(dataSize, dataItem) {
    dataItem = dataItem || [0, 0];
    return echarts.util.map([0, 1], function (dimIdx) {
        var val = dataItem[dimIdx];
        var halfSize = dataSize[dimIdx] / 2;
        var p1 = [];
        var p2 = [];
        p1[dimIdx] = val - halfSize;
        p2[dimIdx] = val + halfSize;
        p1[1 - dimIdx] = p2[1 - dimIdx] = dataItem[1 - dimIdx];
        return Math.abs(this.dataToPoint(p1)[dimIdx] - this.dataToPoint(p2)[dimIdx]);
    }, this);
}

LeafletCoordSys.dimensions = LeafletCoordSys.prototype.dimensions;

L.CustomOverlay = L.Layer.extend({

    initialize: function (container) {
        this._container = container;
    },

    onAdd: function (map) {
        var pane = map.getPane(this.options.pane);

        pane.appendChild(this._container);

        // Calculate initial position of container with `L.Map.latLngToLayerPoint()`, `getPixelOrigin()` and/or `getPixelBounds()`

        // L.DomUtil.setPosition(this._container, point);

        // Add and position children elements if needed

        // map.on('zoomend viewreset', this._update, this);
    },

    onRemove: function (map) {
        L.DomUtil.remove(this._container);
        // map.off('zoomend viewreset', this._update, this);
    },

    _update: function () {
        // Recalculate position of container

        // L.DomUtil.setPosition(this._container, point);

        // Add/remove/reposition children elements if needed
    }
});

LeafletCoordSys.create = function (ecModel, api) {
    var leafletCoordSys;
    var root = api.getDom();

    // TODO Dispose
    ecModel.eachComponent('leaflet', function (leafletModel) {
        var viewportRoot = api.getZr().painter.getViewportRoot();
        if (typeof L === 'undefined') {
            throw new Error('Leaflet api is not loaded');
        }
        if (leafletCoordSys) {
            throw new Error('Only one leaflet component can exist');
        }
        if (!leafletModel.__map) {
            // Not support IE8
            var mapRoot = root.querySelector('.ec-extension-leaflet');
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
            var map = leafletModel.__map = new L.map(mapRoot);
            var tile = leafletModel.get('tile');
            if(tile.url instanceof Object) {
                L.control.layers(tile.url,{}, {
			        position: "topleft"
			    }).addTo(map);
            } else if(tile.url instanceof Array){
                if(tile.url.length >= 2){
                    for(var i = 0; i < tile.url[0].length; i++) {
                        baseLayers[tile.url[0][i]] = L.tileLayer(tile.url[1][i], { attribution: tile.attribution }).addTo(map);
                        L.control.layers(baseLayers,{}, {
                            position: "topleft"
                        }).addTo(map);
                    }
                } else {
                    for(var i = 0; i < tile.url.length; i++) {
                        baseLayers[i] = L.tileLayer(tile.url[i], { attribution: tile.attribution }).addTo(map);
                        L.control.layers(baseLayers,{}, {
                            position: "topleft"
                        }).addTo(map);
                    }
                }            
            } else {
                L.tileLayer(tile.url, {
                    attribution: tile.attribution
                }).addTo(map);
            }
            var overlay = new L.CustomOverlay(viewportRoot).addTo(map);
        }
        var map = leafletModel.__map;

        // Set leaflet options
        // centerAndZoom before layout and render
        var center = leafletModel.get('center');
        var zoom = leafletModel.get('zoom');
        if (center && zoom) {
            map.setView([center[1], center[0]], zoom);
        }

        leafletCoordSys = new LeafletCoordSys(map, api);
        leafletCoordSys.setMapOffset(leafletModel.__mapOffset || [0, 0]);
        leafletCoordSys.setZoom(zoom);
        leafletCoordSys.setCenter(center);

        leafletModel.coordinateSystem = leafletCoordSys;
    });

    ecModel.eachSeries(function (seriesModel) {
        if (seriesModel.get('coordinateSystem') === 'leaflet') {
            seriesModel.coordinateSystem = leafletCoordSys;
        }
    });
};

function v2Equal(a, b) {
    return a && b && a[0] === b[0] && a[1] === b[1];
}

echarts.extendComponentModel({
    type: 'leaflet',

    getLeaflet: function () {
        // __map is injected when creating BMapCoordSys
        return this.__map;
    },

    setCenterAndZoom: function (center, zoom) {
        this.option.center = center;
        this.option.zoom = zoom;
    },

    centerOrZoomChanged: function (center, zoom) {
        var option = this.option;
        return !(v2Equal(center, option.center) && zoom === option.zoom);
    },

    defaultOption: {
        center: [104.114129, 37.550339],
        zoom: 2,
        mapStyle: {},
        roam: false,
        tile: {
            url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }
    }
});

echarts.extendComponentView({
    type: 'leaflet',

    render: function (leafletModel, ecModel, api) {
        var rendering = true;

        var leaflet = leafletModel.getLeaflet();
        var viewportRoot = api.getZr().painter.getViewportRoot();
        var coordSys = leafletModel.coordinateSystem;
        var moveHandler = function (type, target) {
            if (rendering) {
                return;
            }
            var offsetEl = viewportRoot.parentNode.parentNode;
            // calculate new mapOffset
            var transformStyle = offsetEl.style.transform;
            var dx = 0;
            var dy = 0;
            if (transformStyle) {
                transformStyle = transformStyle.replace('translate3d(', '');
                var parts = transformStyle.split(',');
                dx = -parseInt(parts[0], 10);
                dy = -parseInt(parts[1], 10);
            } else { // browsers that don't support transform: matrix
                dx = -parseInt(offsetEl.style.left, 10);
                dy = -parseInt(offsetEl.style.top, 10);
            }
            var mapOffset = [dx, dy];
            viewportRoot.style.left = mapOffset[0] + 'px';
            viewportRoot.style.top = mapOffset[1] + 'px';

            coordSys.setMapOffset(mapOffset);
            leafletModel.__mapOffset = mapOffset;

            api.dispatchAction({
                type: 'leafletRoam'
            });
        };

        function zoomEndHandler() {
            if (rendering) {
                return;
            }
            api.dispatchAction({
                type: 'leafletRoam'
            });
        }

        function zoomHandler() {
            moveHandler();
        }

        leaflet.off('move', this._oldMoveHandler);
        leaflet.off('zoom', this._oldZoomHandler);
        leaflet.off('zoomend', this._oldZoomEndHandler);

        leaflet.on('move', moveHandler);
        leaflet.on('zoom', zoomHandler);
        leaflet.on('zoomend', zoomEndHandler);

        this._oldMoveHandler = moveHandler;
        this._oldZoomEndHandler = zoomHandler;
        this._oldZoomEndHandler = zoomEndHandler;

        var roam = leafletModel.get('roam');
        if (roam && roam !== 'scale') {
            leaflet.dragging.enable();
        } else {
            leaflet.dragging.disable();
        }
        if (roam && roam !== 'move') {
            leaflet.scrollWheelZoom.enable();
            leaflet.doubleClickZoom.enable();
            leaflet.touchZoom.enable();
        } else {
            leaflet.scrollWheelZoom.disable();
            leaflet.doubleClickZoom.disable();
            leaflet.touchZoom.disable();
        }

        rendering = false;
    }
});

/**
 * Leftlet component extension
 */

echarts.registerCoordinateSystem('leaflet', LeafletCoordSys);


echarts.registerAction({
    type: 'leafletRoam',
    event: 'leafletRoam',
    update: 'updateLayout'
}, function (payload, ecModel) {
    ecModel.eachComponent('leaflet', function (leafletModel) {
        var leaflet = leafletModel.getLeaflet();
        var center = leaflet.getCenter();
        leafletModel.setCenterAndZoom([center.lng, center.lat], leaflet.getZoom());
    });
});

var version='1.0.0';

exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));
