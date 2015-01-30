(function (){

    'use strict';

    angular
        .module('gymassistant.front.series')
        .config(SeriesConfig);

    /* @ngInject */
    function SeriesConfig($routeProvider) {
        $routeProvider.when('/edzesek', {
            templateUrl: 'series/series.html',
            controllerAs: 'vm',
            controller: 'SeriesController',
            resolve: {
                /* @ngInject */
                userInfo: function (locationHelper) {
                    return locationHelper.onlyAdmin();
                }
            }
        })
        .when('/edzes/:id', {
            templateUrl: 'series/details.html',
            controllerAs: 'vm',
            controller: 'DetailsController',
            resolve: {
                /* @ngInject */
                userInfo: function (locationHelper) {
                    return locationHelper.onlyAdmin();
                },
                /* @ngInject */
                training: function ($route, seriesService, locationHelper) {
                    return seriesService.getInstance($route.current.params.id).catch(locationHelper.back);
                }
            }
        });
    }
})();
