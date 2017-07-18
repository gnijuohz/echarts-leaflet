define(function (require) {

    function v2Equal(a, b) {
        return a && b && a[0] === b[0] && a[1] === b[1];
    }

    return require('echarts').extendComponentModel({
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
});