(function () {

    'use strict';

    angular
        .module('gymassistant.front.series')
        .factory('seriesService', SeriesService);

    /* @ngInject */
    function SeriesService(httpService) {

        return {
            getAll : function () {
                return httpService.get('/api/all/series');
            },

            get : function (id) {
                return httpService.get('/api/series/'+ id);
            },

            update : function (instance) {
                return httpService.post('/api/series/'+ instance._id, instance);
            },

            add : function (instance) {
                return httpService.post('/api/add/new/series', instance);
            },

            getAllCoaches : function () {
                return httpService.get('/api/all/coaches');
            }
        };

    }
})();