(function () {

    'use strict';

    angular
        .module('gymassistant.front.schedule')
        .config(ScheduleConfig);

    ScheduleConfig.$inject = ['$routeProvider'];

    function ScheduleConfig($routeProvider) {
        $routeProvider.when('/orarend', {
            templateUrl: 'schedule/schedule.html',
            controllerAs: 'schedule',
            controller: 'Schedule'
        });
    }

})();