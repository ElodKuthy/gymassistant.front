(function () {

    'use strict';

    angular
        .module('gymassistant.front.schedule')
        .controller('ScheduleController', ScheduleController);

    /* @ngInject */
    function ScheduleController($rootScope, $routeParams, $location, $q, $filter, authenticationService, scheduleService, errorService, eventHelper, loadingService, infoService, decisionService, userInfo, locations) {

        var vm = this;

        vm.userInfo = userInfo;
        vm.credit = {};
        vm.showAttendeeList = false;

        vm.perviousWeek = perviousWeek;
        vm.nextWeek = nextWeek;
        vm.currentWeek = currentWeek;
        vm.perviousDay = perviousDay;
        vm.today = today;
        vm.nextDay = nextDay;
        vm.canJoin = canJoin;
        vm.join = join;
        vm.canLeave = canLeave;
        vm.leave = leave;
        vm.showAttendees = showAttendees;
        vm.canCancelTraining = canCancelTraining;
        vm.cancelTraining = cancelTraining;
        vm.showLegend = false;
        vm.toggled = false;
        vm.toggleLegend = function () {
            vm.toggled = true;
            vm.showLegend = !vm.showLegend;
        };
        vm.showLocation = {};

        var begin = $routeParams.day ? $routeParams.day : $routeParams.begin;
        var end = $routeParams.day ? moment($routeParams.day).add({
            day: 1
        }).format('YYYY-MM-DD') : $routeParams.end;

        $rootScope.title = $routeParams.day ? 'Órarend - ' + $filter('date')(moment($routeParams.day).toDate(), 'longDate') : (begin && end) ? 'Órarend - ' + $filter('date')(moment(begin).toDate(), 'longDate') + ' - ' + $filter('date')(moment(end).toDate(), 'longDate') : 'Eheti órarend';

        fetchSchedule(begin, end);

        function fetchSchedule(begin, end) {

            loadingService.startLoading();

            var promises = [];
            promises.push(scheduleService.getSchedule(begin, end));
            if (vm.userInfo) {
                promises.push(scheduleService.getCurrentCredit());
            }

            $q.all(promises).then(
                function (results) {

                    vm.dates = {
                        begin: begin ? moment(begin).format('YYYY-MM-DD') : moment().startOf('isoWeek').format('YYYY-MM-DD'),
                        end: end ? moment(end).format('YYYY-MM-DD') : moment().endOf('isoWeek').format('YYYY-MM-DD')
                    };
                    vm.credit = results.length > 1 ? results[1] : null;

                    var currentDate = moment(0);
                    var currentWeek = [];
                    var currentTimes = {};
                    var currentTime = {};
                    vm.days = [{
                        name: 'Hétfő',
                        display: false
                    }, {
                        name: 'Kedd',
                        display: false
                    }, {
                        name: 'Szerda',
                        display: false
                    }, {
                        name: 'Csütörtök',
                        display: false
                    }, {
                        name: 'Péntek',
                        display: false
                    }, {
                        name: 'Szombat',
                        display: false
                    }];

                    vm.weeks = [];

                    results[0].forEach(function (data) {

                        var date = moment(data.date);
                        vm.days[date.isoWeekday() - 1].display = true;

                        if (!currentDate.isSame(date, 'week')) {
                            currentWeek = [];
                            currentTimes = {};
                            locations.forEach(function (location) {
                                currentWeek.push({
                                    location: location,
                                    rows: []
                                });
                                currentTimes[location.id] = {};
                            })
                            vm.weeks.push(currentWeek);
                        }

                        if (!data.location) {
                            return;
                        }

                        currentTime = currentTimes[data.location][date.format('HH:mm')];

                        if (!currentTime) {
                            currentTime = {
                                trainings: [{}, {}, {}, {}, {}, {}],
                                time: date.format('HH:mm')
                            }
                            currentTimes[data.location][currentTime.time] = currentTime;
                            currentWeek.some(function (current) {
                                if (current.location.id === data.location) {
                                    current.rows.push(currentTime);
                                    vm.showLocation[data.location] = {
                                        name: current.location.name,
                                        show: true
                                    }
                                    return true;
                                }
                            });
                        }

                        currentDate = moment(date).endOf('day');

                        var instance = createInstanceFromData(data);

                        currentTime.trainings[date.isoWeekday() - 1] = instance;
                    });

                    loadingService.endLoading();
                },
                function (error) {
                    loadingService.endLoading();
                    errorService.modal(error);
                });
        }

        function perviousWeek() {
            var begin = moment(vm.dates.begin).subtract({
                weeks: 1
            }).format('YYYY-MM-DD');
            var end = moment(vm.dates.end).subtract({
                weeks: 1
            }).format('YYYY-MM-DD');

            $location.path('/orarend/' + begin + '/' + end);
        }

        function perviousDay() {
            var day = moment(vm.dates.begin).subtract({
                days: 1
            }).format('YYYY-MM-DD');

            $location.path('/orarend/' + day);
        }

        function nextWeek() {
            var begin = moment(vm.dates.begin).add({
                weeks: 1
            }).format('YYYY-MM-DD');
            var end = moment(vm.dates.end).add({
                weeks: 1
            }).format('YYYY-MM-DD');

            $location.path('/orarend/' + begin + '/' + end);
        }

        function nextDay() {
            var day = moment(vm.dates.begin).add({
                days: 1
            }).format('YYYY-MM-DD');

            $location.path('/orarend/' + day);
        }

        function currentWeek() {

            $location.path('/orarend/heti');
        }

        function today() {
            $location.path('/orarend/' + moment().format('YYYY-MM-DD'));
        }

        function canJoin(instance) {

            return vm.userInfo &&
                !instance.isFull &&
                !instance.signedUp &&
                vm.userInfo.name != instance.coach &&
                vm.userInfo.roles.indexOf('admin') == -1 &&
                (vm.userInfo.roles.indexOf('coach') > -1 || (vm.credit && vm.credit.free > 0)) &&
                moment().isBefore(instance.date);
        }

        function join(instance) {
            if (canJoin(instance)) {
                if (vm.userInfo.preferences.askIrreversibleJoining &&
                    vm.userInfo.roles.indexOf('admin') == -1 &&
                    moment().add({
                        hours: 3
                    }).isAfter(instance.date)) {
                    decisionService.modal(
                            'Feliratkozás',
                            'Biztos, hogy jelenkezni szertnél erre az órára? Mivel ez az óra 3 órán belül kezdődik, nem lehet lemondani a részvételt, ha egyszer jelentkeztél!',
                            'Biztos',
                            'Mégsem', {
                                title: 'Ne jelenjen meg többé ez a kérdés, mindíg add hozzá a tanítványt!',
                                value: false
                            })
                        .then(function (result) {
                            if (result.checkbox) {
                                vm.userInfo.preferences.askIrreversibleJoining = false;
                                authenticationService.updatePreferences(vm.userInfo.preferences).then(function (userInfo) {
                                    vm.userInfo = userInfo;
                                });
                            }
                            doJoin(instance);
                        });
                } else {
                    doJoin(instance);
                }

            } else if (!vm.userInfo) {
                $location.path('/belepes');
            }
        }

        function doJoin(instance) {
            scheduleService.joinClass(instance.id).then(function () {
                instance.current++;
                if (vm.credit) {
                    vm.credit.free--;
                    vm.credit.attended++;
                }
                if (instance.attendees) {
                    instance.attendees.push(vm.userInfo.name);
                }
                calculateInstanceProperties(instance, true);
            }, function (error) {
                errorService.modal(error);
            });
        }

        function canLeave(instance) {
            return instance.signedUp &&
                vm.userInfo.roles.indexOf('admin') == -1 &&
                moment().add({
                    hours: 3
                }).isBefore(instance.date);
        }

        function leave(instance) {
            if (canLeave(instance)) {
                scheduleService.leaveClass(instance.id).then(function () {
                    instance.current--;
                    if (instance.attendees) {
                        var index = instance.attendees.indexOf(vm.userInfo.name);
                        if (index > -1) {
                            instance.attendees.splice(index, 1);
                        }
                    }
                    if (vm.credit) {
                        vm.credit.free++;
                        vm.credit.attended--;
                    }
                    calculateInstanceProperties(instance, false);
                }, function (error) {
                    errorService.modal(error, 'sm');
                });
            }
        }

        function showAttendees(instance) {

            $location.path('/resztvevok/' + instance.id);
        }

        function createInstanceFromData(data) {

            var instance = {
                id: data._id,
                name: data.name,
                logo: data.name.toLowerCase().replace(/ /g, '-'),
                coach: data.coach,
                current: data.current,
                max: data.max,
                date: data.date,
                attendees: data.attendees ? data.attendees.slice(0) : undefined,
                signedUp: moment().endOf('hour').isBefore(data.date) && data.isAttendee,
                participated: moment().endOf('hour').isAfter(data.date) && data.isAttendee && data.isParticipant,
                missed: moment().endOf('hour').isAfter(data.date) && data.isAttendee && !data.isParticipant,
                showAttendeeList: vm.userInfo ? ((vm.userInfo.roles.indexOf('admin') > -1) || (data.coach === vm.userInfo.name)) : false
            };

            calculateInstanceProperties(instance, instance.signedUp);

            return instance;
        }

        function calculateInstanceProperties(instance, signedUp) {
            instance.barText = instance.current + ' / ' + instance.max;
            instance.isFull = (instance.current >= instance.max);
            instance.signedUp = signedUp;
        }

        function canCancelTraining(instance) {

            return vm.userInfo && (vm.userInfo.roles.indexOf('admin') > -1 || (vm.userInfo.name == instance.coach && moment().startOf('day').isBefore(instance.date)));
        }

        function cancelTraining(instance) {

            decisionService.modal('Óra lemondása', 'Biztos vagy benne, hogy le szeretnéd mondani ezt az órát?', 'Biztos', 'Mégsem')
                .then(function () {
                    loadingService.startLoading();
                    scheduleService.cancelTraining(instance.id)
                        .then(function () {
                            loadingService.endLoading();
                            infoService.modal('Sikeres lemondás', 'Sikeresen lemondtad az edzést. Az érintett tanítványok bérletén jóváírásra került egy kredit.')
                                .then(function () {
                                    fetchSchedule(vm.dates.begin, vm.dates.end);
                                });
                        }, function (err) {
                            loadingService.endLoading();
                            errorService.modal(err);
                        });
                });
        }
    }
})();