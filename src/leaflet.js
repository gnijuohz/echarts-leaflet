import createLeafletCoordSystem from './LeafletCoordSys';
import extendLeafletModel from './LeafletModel';
import extendLeafletView from './LeafletView';

/**
 * echarts register leaflet coord system
 * @param {object} echarts
 * @param {object} L
 */
function registerLeafletSystem(echarts, L) {
  extendLeafletModel(echarts);
  extendLeafletView(echarts);

  echarts.registerCoordinateSystem(
    'leaflet',
    createLeafletCoordSystem(echarts, L)
  );

  echarts.registerAction(
    {
      type: 'leafletRoam',
      event: 'leafletRoam',
      update: 'updateLayout',
    },
    function(payload, ecModel) {
      ecModel.eachComponent('leaflet', function(leafletModel) {
        const leaflet = leafletModel.getLeaflet();
        const center = leaflet.getCenter();
        leafletModel.setCenterAndZoom(
          [center.lng, center.lat],
          leaflet.getZoom()
        );
      });
    }
  );
}

registerLeafletSystem.version = '1.0.0';

export default registerLeafletSystem;
