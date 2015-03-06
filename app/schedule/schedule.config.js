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
                controller: 'ScheduleController'
            })
            .when('/orarend/:day', {
                templateUrl: 'schedule/schedule.html',
                controllerAs: 'vm',
                controller: 'ScheduleController',
                resolve: {
                    /* @ngInject */
                    userInfo: function ($route, locationHelper) {
                        return moment($route.current.params.day, 'YYYY-MM-DD').isSame(moment(), 'day') ? null : locationHelper.onlyAuthenticated();
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
                    }
                }
            });
    }

})();