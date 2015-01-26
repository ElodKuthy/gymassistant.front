(function () {

    'use strict';

    angular
        .module('gymassistant.front.schedule')
        .config(ScheduleConfig);

    /* @ngInject */
    function ScheduleConfig($routeProvider) {
        $routeProvider
            .when('/orarend/aktualis', {
                templateUrl: 'schedule/schedule.html',
                controllerAs: 'vm',
                controller: 'ScheduleController'
            })
            .when('/orarend/:begin/:end', {
                templateUrl: 'schedule/schedule.html',
                controllerAs: 'vm',
                controller: 'ScheduleController'
            });
    }

})();