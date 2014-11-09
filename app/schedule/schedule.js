(function () {

    'use strict';

    angular
        .module('gymassistant.front.schedule')
        .controller('Schedule', Schedule);

    Schedule.$inject = ['$rootScope', '$location', '$modal', 'authenticationService', 'scheduleService', 'errorService'];

    function Schedule($rootScope, $location, $modal, authenticationService, scheduleService, errorService) {

        var schedule = this;

        schedule.instances = {};
        schedule.userInfo = null;
        schedule.credits = {};
        schedule.showAttendeeList = false;

        schedule.join = join;
        schedule.leave = leave;
        schedule.showAttendees = showAttendees;

        $rootScope.$on('authenticationChanged', fetchSchedule);

        fetchSchedule();

        function fetchSchedule() {
            scheduleService.getSchedule().then(function (result) {

                schedule.dates = result.dates;

                var currentDate = moment(0);
                var currentDay = [];

                schedule.instances = {};
                schedule.instances.days = [];

                result.schedule.forEach(function (instance) {
                    if (currentDate.isBefore(moment(instance.date))) {
                        currentDate = moment(instance.date).endOf("day");
                        currentDay = [];
                        schedule.instances.days.push(currentDay);
                    }

                    calculateInstanceProperties(instance, instance.signedUp);

                    currentDay.push(instance);
                });

            });

            scheduleService.getCredits().then(function (result) {
                schedule.credits = result.credits;
            });

            authenticationService.getUserInfo().then(function (userInfo) {
                schedule.userInfo = userInfo;
                schedule.showAttendeeList = (userInfo && userInfo.roles) ? (userInfo.roles.indexOf('coach') > -1) : false;
            });

        }

        function join(instance) {
            if (vm.userInfo && vm.credits > 0) {
                scheduleService.joinClass(instance.id).then(function () {
                    instance.current++;
                    vm.credits--;
                    if (instance.attendees) {
                        instance.attendees.push(vm.userInfo.userName);
                    }
                    calculateInstanceProperties(instance, true);
                }, function (error) {
                    errorService.modal(error, "sm");
                });

            } else {
                $location.path('/login');
            }
        }

        function leave(instance) {
            scheduleService.leaveClass(instance.id).then(function () {
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
                errorService.modal(error, "sm");
            });
        }

        function showAttendees(instance) {

            var attendees = instance.attendees;

            var modalInstance = $modal.open({
                templateUrl: 'schedule/attendees.html',
                controller: 'Attendees',
                controllerAs: 'attendees',
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

        function calculateInstanceProperties(instance, signedUp) {
            instance.barText = instance.current + ' / ' + instance.max;
            instance.isFull = (instance.current >= instance.max);
            instance.signedUp = signedUp;
        }

    }
})();
