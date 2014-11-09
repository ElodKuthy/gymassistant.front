'use strict';

(function () {

    angular
        .module('gymassistant.front.schedule', [])
        .config(ScheduleConfig)
        .factory('scheduleService', ScheduleService)
        .controller('ScheduleCtrl', ScheduleController)
        .controller('AttendeesModalCtrl', AttendeesModalController);

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
            getCredits: getCredits,
            joinClass: joinClass,
            leaveClass: leaveClass
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

        function joinClass(classId) {
            var deferred = $q.defer();
            var authorization = $window.sessionStorage['authorization'];

            $http.get('/api/join/' + classId, {
                headers: { 'Authorization': authorization }
            }).then(function(result) {
                if (result.data.error) {
                    deferred.reject(result.data.error);
                } else {
                    deferred.resolve(result.data);
                }
            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function leaveClass(classId) {
            var deferred = $q.defer();
            var authorization = $window.sessionStorage['authorization'];

            $http.get('/api/leave/' + classId, {
                headers: { 'Authorization': authorization }
            }).then(function(result) {
                if (result.data.error) {
                    deferred.reject(result.data.error);
                } else {
                    deferred.resolve(result.data);
                }
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
        vm.showAttendeeList = false;

        function fetchSchedule() {
            scheduleService.getSchedule().then(function(result) {

                vm.dates = result.dates;

                var schedule = result.schedule;
                var currentDate = moment(0);
                var currentDay = [];

                vm.schedule = {};
                vm.schedule.days = [];

                schedule.forEach(function (instance) {
                    if (currentDate.isBefore(moment(instance.date))) {
                        currentDate = moment(instance.date).endOf("day");
                        currentDay = [];
                        vm.schedule.days.push(currentDay);
                    }

                    calculateInstanceProperties(instance, instance.signedUp);

                    currentDay.push(instance);
                });

            });

            scheduleService.getCredits().then(function(result) {
                vm.credits = result.credits;
            });

            authenticationService.getUserInfo().then(function(userInfo) {
                vm.userInfo = userInfo;
                vm.showAttendeeList = (userInfo && userInfo.roles) ? (userInfo.roles.indexOf('coach') > -1) : false;
            });

        }

        $rootScope.$on('authenticationChanged', fetchSchedule);

        fetchSchedule();

        vm.add = add;

        function add (instance) {
            if (vm.userInfo && vm.credits > 0) {
                scheduleService.joinClass(instance.id).then(function() {
                    instance.current++;
                    vm.credits--;
                    if (instance.attendees) {
                        instance.attendees.push(vm.userInfo.userName);
                    }
                    calculateInstanceProperties(instance, true);
                }, function(error) {
                    alert(error);
                });

            } else {
                $location.path('/login');
            }
        }

        vm.remove = remove;

        function remove (instance) {
            scheduleService.leaveClass(instance.id).then(function() {
                instance.current--;
                if (instance.attendees) {
                    var index = instance.attendees.indexOf(vm.userInfo.userName);
                    if (index > -1) {
                        instance.attendees.splice(index, 1);
                    }
                }
                vm.credits++;
                calculateInstanceProperties(instance, false);
            }, function (error) {
                alert(error);
            });
        }

        function calculateInstanceProperties(instance, signedUp) {
            instance.barText = instance.current + ' / ' + instance.max;
            instance.isFull = (instance.current >= instance.max);
            instance.signedUp = signedUp;
        }

        vm.showAttendees = showAttendees;

        function showAttendees(instance) {

            var attendees = instance.attendees;

            var modalInstance = $modal.open({
                templateUrl: 'schedule/attendees.html',
                controller: 'AttendeesModalCtrl',
                controllerAs: 'vm',
                size: 'sm',
                resolve: {
                    attendees: function () {
                        return attendees;
                    }
                }
            });

            modalInstance.result.then(function (result) {
                instance.attendees = result;
                instance.current = attendees.length - 1;
                calculateInstanceProperties(instance, instance.attendees.indexOf(vm.userInfo.userName) > -1);
            });
        }
    }

    AttendeesModalController.$inject = ['$modalInstance', 'attendees'];

    function AttendeesModalController($modalInstance, attendees) {

        var vm = this;
        vm.newAttendee = '';

        vm.attendees = attendees.slice(0);

        vm.ok = function () {
            $modalInstance.close(vm.attendees);
        };

        vm.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        vm.remove = function (index) {
            vm.attendees.splice(index, 1);
        };

        vm.add = function() {
            if (vm.newAttendee != '' && vm.attendees.indexOf(vm.newAttendee) == -1) {
                vm.attendees.push(vm.newAttendee);
                vm.newAttendee = '';
            }
        }
    }
})();
