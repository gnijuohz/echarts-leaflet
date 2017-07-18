define(function (require) {

    return require('echarts').extendComponentView({
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
});