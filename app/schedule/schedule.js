'use strict';

(function () {

    angular
        .module('gymassistant.front.schedule', ['ngRoute', 'ui.bootstrap'])
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

    ScheduleService.$inject = ['$http', '$q', '$window'];

    function ScheduleService($http, $q, $window) {

        return {
            getSchedule: getSchedule
        };

        function getSchedule() {


            var deferred = $q.defer();

            var authorization = $window.sessionStorage['authorization'];
            $http.get('/api/schedule', {
                headers: { 'Authorization': authorization }
            }).then(success, error);


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
            var schedule = result;

            schedule.rows.forEach(function (row) {
                row.classes.forEach(function (cell) {
                    calculateCellProperties(cell, cell.signedUp);
                });
            });

            vm.schedule = schedule;
        }

        vm.add = add;

        function add (cell) {
            cell.current++;
            calculateCellProperties(cell, true);
        }

        vm.remove = remove;

        function remove (cell) {
            cell.current--;
            calculateCellProperties(cell, false);

        }

        function calculateCellProperties(cell, signedUp) {
            cell.barText = cell.current + ' / ' + cell.max;
            cell.barStyle = { "width" : (cell.current / cell.max * 100) + "%" };
            cell.isFull = (cell.current >= cell.max);
            cell.signedUp = signedUp;
        }

    }

})();
