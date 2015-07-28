(function () {

    'use strict';

    angular
        .module('gymassistant.front.schedule')
        .config(ScheduleConfig);

    /* @ngInject */
    function ScheduleConfig($routeProvider) {
        $routeProvider
            .when('/orarend/heti', {
                templateUrl: 'schedule/schedule.html',
                controllerAs: 'vm',
                controller: 'ScheduleController',
                resolve: {
                    /* @ngInject */
                    userInfo: function (authenticationService) {
                        return authenticationService.getUserInfo();
                    },
                    /* @ngInject */
                    locations: function (seriesService) {
                        return seriesService.getAllLocations();
                    }
                }
            })
            .when('/orarend/:day', {
                templateUrl: 'schedule/schedule.html',
                controllerAs: 'vm',
                controller: 'ScheduleController',
                resolve: {
                    /* @ngInject */
                    userInfo: function ($route, locationHelper, authenticationService) {
                        return moment($route.current.params.day, 'YYYY-MM-DD').isSame(moment(), 'day') ? authenticationService.getUserInfo() : locationHelper.onlyAuthenticated();
                    },
                    /* @ngInject */
                    locations: function (seriesService) {
                        return seriesService.getAllLocations();
                    }
                }
            })
            .when('/orarend/:begin/:end', {
                templateUrl: 'schedule/schedule.html',
                controllerAs: 'vm',
                controller: 'ScheduleController',
                resolve: {
                    /* @ngInject */
                    userInfo: function (locationHelper) {
                        return locationHelper.onlyAuthenticated();
                    },
                    /* @ngInject */
                    locations: function (seriesService) {
                        return seriesService.getAllLocations();
                    }
                }
            });
    }

})();