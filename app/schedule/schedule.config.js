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
                controllerAs: 'schedule',
                controller: 'Schedule'
            })
            .when('/orarend/:begin/:end', {
                templateUrl: 'schedule/schedule.html',
                controllerAs: 'schedule',
                controller: 'Schedule'
            });
    }

})();