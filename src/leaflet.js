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
    update: 'updateLayout'
}, function (payload, ecModel) {
    ecModel.eachComponent('leaflet', function (leafletModel) {
        var leaflet = leafletModel.getLeaflet();
        var center = leaflet.getCenter();
        leafletModel.setCenterAndZoom([center.lng, center.lat], leaflet.getZoom());
    });
});

export var version='1.0.0';