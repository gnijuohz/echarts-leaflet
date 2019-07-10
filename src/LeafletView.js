import echarts from 'echarts/lib/echarts';

export default echarts.extendComponentView({
  type: 'leaflet',

  render: function(leafletModel, ecModel, api) {
    let rendering = true;

    const leaflet = leafletModel.getLeaflet();
    const moveContainer = api.getZr().painter.getViewportRoot().parentNode;
    const coordSys = leafletModel.coordinateSystem;

    const moveHandler = function(type, target) {
      if (rendering) {
        return;
      }
      const offsetEl = leaflet._mapPane;
      // calculate new mapOffset
      let transformStyle = offsetEl.style.transform;
      let dx = 0;
      let dy = 0;
      if (transformStyle) {
        transformStyle = transformStyle.replace('translate3d(', '');
        let parts = transformStyle.split(',');
        dx = -parseInt(parts[0], 10);
        dy = -parseInt(parts[1], 10);
      } else {
        // browsers that don't support transform: matrix
        dx = -parseInt(offsetEl.style.left, 10);
        dy = -parseInt(offsetEl.style.top, 10);
      }
      let mapOffset = [dx, dy];
      moveContainer.style.left = `${mapOffset[0]}px`;
      moveContainer.style.top = `${mapOffset[1]}px`;

      coordSys.setMapOffset(mapOffset);
      leafletModel.__mapOffset = mapOffset;

      api.dispatchAction({
        type: 'leafletRoam',
      });
    };

    /**
     * handler for map zoomEnd event
     */
    function zoomEndHandler() {
      if (rendering) return;
      api.dispatchAction({
        type: 'leafletRoam',
      });
    }

    /**
     * handler for map zoom event
     */
    function zoomHandler() {
      moveHandler();
    }

    if (this._oldMoveHandler) {
      leaflet.off('move', this._oldMoveHandler);
    }
    if (this._oldZoomHandler) {
      leaflet.off('zoom', this._oldZoomHandler);
    }
    if (this._oldZoomEndHandler) {
      leaflet.off('zoomend', this._oldZoomEndHandler);
    }

    leaflet.on('move', moveHandler);
    leaflet.on('zoom', zoomHandler);
    leaflet.on('zoomend', zoomEndHandler);

    this._oldMoveHandler = moveHandler;
    this._oldZoomHandler = zoomHandler;
    this._oldZoomEndHandler = zoomEndHandler;

    const roam = leafletModel.get('roam');
    // can move
    if (roam && roam !== 'scale') {
      leaflet.dragging.enable();
    } else {
      leaflet.dragging.disable();
    }
    // can zoom (may need to be more fine-grained)
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
  },
});
