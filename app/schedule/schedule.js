'use strict';

(function () {

    angular
        .module('gymassistant.front.schedule', ['ngRoute'])
        .config(ScheduleConfig)
        .factory('scheduleService', ScheduleService)
        .controller('ScheduleCtrl', ScheduleController);

    ScheduleConfig.$inject = ['$routeProvider'];

    function ScheduleConfig ($routeProvider) {
        $routeProvider.when('/orarend', {
            templateUrl: 'schedule/schedule.html',
            controllerAs: 'vm',
            controller: 'ScheduleCtrl'
        });
    }

    ScheduleService.$inject = ['$http', '$q'];

    function ScheduleService($http, $q) {

        return {
            getSchedule: getSchedule
        };

        function getSchedule() {


            var deferred = $q.defer();

            $http.get('/api/schedule').then(success, error);

            function success(result) {
                deferred.resolve(result.data);
            }

            function error(result) {
                deferred.reject(result);
            }

            return deferred.promise;
        }
    }

    ScheduleController.$inject = ['scheduleService'];

    function ScheduleController (scheduleService) {

        var vm = this;

        scheduleService.getSchedule().then(success);

        function success (result) {
            vm.schedule = result;
        }
    }

})();
