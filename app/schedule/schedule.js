'use strict';

(function () {

    angular
        .module('gymassistant.front.schedule', [])
        .config(ScheduleConfig)
        .factory('scheduleService', ScheduleService)
        .controller('ScheduleCtrl', ScheduleController)
        .controller('ParticipantsModalCtrl', ParticipantsModalController);

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
            getSchedule: getSchedule,
            getCredits: getCredits
        };

        function getSchedule() {

            var deferred = $q.defer();
            var authorization = $window.sessionStorage['authorization'];

            $http.get('/api/schedule', {
                headers: { 'Authorization': authorization }
            }).then(function(success) {
                deferred.resolve(success.data);
            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function getCredits() {
            var deferred = $q.defer();
            var authorization = $window.sessionStorage['authorization'];

            $http.get('/api/credits', {
                headers: { 'Authorization': authorization }
            }).then(function(success) {
                deferred.resolve(success.data);
            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;

        }
    }

    ScheduleController.$inject = ['$rootScope', '$location', '$modal', 'authenticationService', 'scheduleService'];

    function ScheduleController ($rootScope, $location, $modal, authenticationService, scheduleService) {

        var vm = this;

        vm.schedule = {};
        vm.userInfo = null;
        vm.credits = {};
        vm.showParticipantList = false;

        function fetchSchedule() {
            scheduleService.getSchedule().then(function(result) {
                var schedule = result;

                schedule.rows.forEach(function (row) {
                    row.classes.forEach(function (cell) {
                        calculateCellProperties(cell, cell.signedUp);
                    });
                });

                vm.schedule = schedule;

            });

            scheduleService.getCredits().then(function(credits) {
                vm.credits = credits;
            });

            authenticationService.getUserInfo().then(function(userInfo) {
                vm.userInfo = userInfo;
                vm.showParticipantList = (userInfo && userInfo.roles) ? (userInfo.roles.indexOf('coach') > -1) : false;
            });

        }

        $rootScope.$on('authenticationChanged', fetchSchedule);

        fetchSchedule();

        vm.add = add;

        function add (cell) {
            if (vm.userInfo && vm.credits.free > 0) {
                cell.current++;
                vm.credits.free--;
                if (cell.participants) {
                    cell.participants.push(vm.userInfo.userName);
                }
                calculateCellProperties(cell, true);
            } else {
                $location.path('/login');
            }
        }

        vm.remove = remove;

        function remove (cell) {
            cell.current--;
            if (cell.participants) {
                var index = cell.participants.indexOf(vm.userInfo.userName);
                if (index > -1) {
                    cell.participants.splice(index, 1);
                }
            }
            vm.credits.free++;
            calculateCellProperties(cell, false);

        }

        function calculateCellProperties(cell, signedUp) {
            cell.barText = cell.current + ' / ' + cell.max;
            cell.barStyle = { "width" : (cell.current / cell.max * 100) + "%" };
            cell.isFull = (cell.current >= cell.max);
            cell.signedUp = signedUp;
        }

        vm.showParticipants = showParticipants;

        function showParticipants(cell) {

            var participants = cell.participants;

            var modalInstance = $modal.open({
                templateUrl: 'schedule/participants.html',
                controller: 'ParticipantsModalCtrl',
                controllerAs: 'vm',
                size: 'sm',
                resolve: {
                    participants: function () {
                        return participants;
                    }
                }
            });

            modalInstance.result.then(function (result) {
                cell.participants = result;
                cell.current = participants.length - 1;
                calculateCellProperties(cell, cell.participants.indexOf(vm.userInfo.userName) > -1);
            });
        }
    }

    ParticipantsModalController.$inject = ['$modalInstance', 'participants'];

    function ParticipantsModalController($modalInstance, participants) {

        var vm = this;
        vm.newParticipant = '';

        vm.participants = participants.slice(0);

        vm.ok = function () {
            $modalInstance.close(vm.participants);
        };

        vm.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        vm.remove = function (index) {
            vm.participants.splice(index, 1);
        };

        vm.add = function() {
            if (vm.newParticipant != '' && vm.participants.indexOf(vm.newParticipant) == -1) {
                vm.participants.push(vm.newParticipant);
                vm.newParticipant = '';
            }
        }
    }
})();
