(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("echarts"), require("L"));
	else if(typeof define === 'function' && define.amd)
		define(["echarts", "L"], factory);
	else if(typeof exports === 'object')
		exports["echarts-leaflet"] = factory(require("echarts"), require("L"));
	else
		root["echarts-leaflet"] = factory(root["echarts"], root["L"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_4__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Leftlet component extension
 */
!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

    __webpack_require__(0).registerCoordinateSystem(
        'leaflet', __webpack_require__(3)
    );
    __webpack_require__(5);
    __webpack_require__(6);

    // Action
    __webpack_require__(0).registerAction({
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

    return {
        version: '1.0.0'
    };
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

    var echarts = __webpack_require__(0);
    var zrUtil = echarts.util;
    var L = __webpack_require__(4);

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
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

    function v2Equal(a, b) {
        return a && b && a[0] === b[0] && a[1] === b[1];
    }

    return __webpack_require__(0).extendComponentModel({
        type: 'leaflet',

        getLeaflet: function () {
            // __leaflet is injected when creating BMapCoordSys
            return this.__leaflet;
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

            roam: false
        }
    });
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

    return __webpack_require__(0).extendComponentView({
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
                if (transformStyle) {
                    transformStyle = transformStyle.replace('translate3d(', '')
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
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ })
/******/ ]);
});