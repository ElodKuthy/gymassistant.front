'use strict';

(function () {

    angular
        .module('gymassistant.front.schedule', [])
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

    ScheduleController.$inject = ['$rootScope', '$location', 'authenticationService', 'scheduleService'];

    function ScheduleController ($rootScope, $location, authenticationService, scheduleService) {

        var vm = this;

        function fetchSchedule() {
            scheduleService.getSchedule().then(success);

            function success(result) {
                var schedule = result;

                schedule.rows.forEach(function (row) {
                    row.classes.forEach(function (cell) {
                        calculateCellProperties(cell, cell.signedUp);
                    });
                });

                vm.schedule = schedule;
            }

            authenticationService.getUserInfo().then(function(userInfo) {
                vm.userName = userInfo ? userInfo.userName : null;
                vm.showParticipantList = (userInfo && userInfo.roles) ? (userInfo.roles.indexOf('coach') > -1) : false;
            });

        }

        $rootScope.$on('authenticationChanged', fetchSchedule);

        fetchSchedule();

        vm.add = add;

        function add (cell) {
            authenticationService.getUserInfo().then(success);

            function success (userInfo) {
                if (userInfo) {
                    cell.current++;
                    if (cell.participants) {
                        cell.participants.push(vm.userName);
                    }
                    calculateCellProperties(cell, true);
                } else {
                    $location.path('/login');
                }
            }
        }

        vm.remove = remove;

        function remove (cell) {
            cell.current--;
            if (cell.participants) {
                var index = cell.participants.indexOf(vm.userName);
                if (index > -1) {
                    cell.participants.splice(index, 1);
                }
            }
            calculateCellProperties(cell, false);

        }

        function calculateCellProperties(cell, signedUp) {
            cell.barText = cell.current + ' / ' + cell.max;
            cell.barStyle = { "width" : (cell.current / cell.max * 100) + "%" };
            cell.isFull = (cell.current >= cell.max);
            cell.signedUp = signedUp;
            if (cell.participants) {
                cell.participantList = ['<ul class="list-group">'];
                cell.participants.forEach(function(participant) {
                    cell.participantList.push('<li class="list-group-item">');
                    cell.participantList.push(participant);
                    cell.participantList.push("</li>");
                });
                cell.participantList.push("</ul>");
                cell.participantList = cell.participantList.join("");
            }
        }
    }
})();
