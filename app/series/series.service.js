(function () {

    'use strict';

    angular
        .module('gymassistant.front.series')
        .factory('seriesService', SeriesService);

    /* @ngInject */
    function SeriesService(httpService) {

        return {
            getSeries : function () {
                return httpService.get('/api/all/series');
            },

            getInstance : function (id) {
                return httpService.get('/api/series/'+ id);
            },

            updateInstance : function (instance) {
                return httpService.post('/api/series/'+ instance._id, instance);
            },

            getAllCoaches : function () {
                return httpService.get('');
            }
        };

    }
})();