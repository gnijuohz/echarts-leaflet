/**
 * Leftlet component extension
 */

import * as echarts from 'echarts';
import LeafletCoordSys from './LeafletCoordSys';

import './LeafletModel';
import './LeafletView';

echarts.registerCoordinateSystem('leaflet', LeafletCoordSys);


echarts.registerAction({
  type: 'leafletRoam',
  event: 'leafletRoam',
  update: 'updateLayout',
}, function(payload, ecModel) {
  ecModel.eachComponent('leaflet', function(leafletModel) {
    const leaflet = leafletModel.getLeaflet();
    const center = leaflet.getCenter();
    leafletModel.setCenterAndZoom([center.lng, center.lat], leaflet.getZoom());
  });
});

export const version='1.0.0';
