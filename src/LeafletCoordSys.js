define(function (require) {

    var echarts = require('echarts');
    var zrUtil = echarts.util;
    var L = require('leaflet');

    function LeafletCoordSys(leaflet, api) {
        this._leaflet = leaflet;
        this.dimensions = ['lng', 'lat'];
        this._mapOffset = [0, 0];

        this._api = api;

        this._projection = L.Projection.Mercator;
    }

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
        return this._leaflet;
    };

    LeafletCoordSys.prototype.dataToPoint = function (data) {
        var point = new L.LatLng(data[1], data[0]);
        var px = this._leaflet.latLngToLayerPoint(point);
        var mapOffset = this._mapOffset;
        return [px.x - mapOffset[0], px.y - mapOffset[1]];
    };

    LeafletCoordSys.prototype.pointToData = function (pt) {
        var mapOffset = this._mapOffset;
        var pt = this._leaflet.layerPointToLatLng({
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
                coord: zrUtil.bind(this.dataToPoint, this),
                size: zrUtil.bind(dataToCoordSize, this)
            }
        };
    };

    function dataToCoordSize(dataSize, dataItem) {
        dataItem = dataItem || [0, 0];
        return zrUtil.map([0, 1], function (dimIdx) {
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
            if (!leafletModel.__leaflet) {
                // Not support IE8
                var leafletRoot = root.querySelector('.ec-extension-leaflet');
                if (leafletRoot) {
                    // Reset viewport left and top, which will be changed
                    // in moving handler in LeafletView
                    viewportRoot.style.left = '0px';
                    viewportRoot.style.top = '0px';
                    root.removeChild(leafletRoot);
                }
                leafletRoot = document.createElement('div');
                leafletRoot.style.cssText = 'width:100%;height:100%';
                // Not support IE8
                leafletRoot.classList.add('ec-extension-leaflet');
                root.appendChild(leafletRoot);
                var leaflet = leafletModel.__leaflet = new L.map(leafletRoot);
                L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(leaflet);

                var overlay = new L.CustomOverlay(viewportRoot).addTo(leaflet);
            }
            var leaflet = leafletModel.__leaflet;

            // Set leaflet options
            // centerAndZoom before layout and render
            var center = leafletModel.get('center');
            var zoom = leafletModel.get('zoom');
            if (center && zoom) {
                leaflet.setView([center[1], center[0]], zoom);
            }

            leafletCoordSys = new LeafletCoordSys(leaflet, api);
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

    return LeafletCoordSys;
});
