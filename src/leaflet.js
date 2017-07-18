/**
 * Leftlet component extension
 */
define(function (require) {

    require('echarts').registerCoordinateSystem(
        'leaflet', require('./LeafletCoordSys')
    );
    require('./LeafletModel');
    require('./LeafletView');

    // Action
    require('echarts').registerAction({
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
});