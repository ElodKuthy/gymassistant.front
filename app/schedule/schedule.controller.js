(function () {

    "use strict";

    angular
        .module("gymassistant.front.schedule")
        .controller("ScheduleController", ScheduleController);

    /* @ngInject */
    function ScheduleController($routeParams, $location, $q, authenticationService, scheduleService, errorService, eventHelper, loadingService, infoService, decisionService) {

        var vm = this;

        vm.userInfo = null;
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

        eventHelper.subscribe.authenticationChanged(fetchSchedule);

        var begin = $routeParams.day ? $routeParams.day : $routeParams.begin;
        var end = $routeParams.day ? moment($routeParams.day).add({ day: 1}).format('YYYY-MM-DD') : $routeParams.end;

        fetchSchedule(begin, end);

        function fetchSchedule(begin, end) {

            loadingService.startLoading();

            var promises = [];
            promises.push(scheduleService.getSchedule(begin, end));
            vm.userInfo = authenticationService.getUserInfo();
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
                    var currentDay = [];

                    vm.weeks = [];

                    results[0].forEach(function (data) {

                        if (!currentDate.isSame(data.date, "day")) {
                            if (!currentDate.isSame(data.date, "week")) {
                                currentWeek = [];
                                vm.weeks.push(currentWeek);
                            }
                            currentDate = moment(data.date).endOf("day");
                            currentDay = [];
                            currentWeek.push(currentDay);
                        }

                        var instance = createInstanceFromData(data);

                        currentDay.push(instance);
                    });

                    loadingService.endLoading();
                },
                function (error) {
                    loadingService.endLoading();
                    errorService.modal(error);
                });
        }

        function perviousWeek() {
            var begin = moment(vm.dates.begin).subtract( {weeks: 1}).format("YYYY-MM-DD");
            var end = moment(vm.dates.end).subtract( {weeks: 1}).format("YYYY-MM-DD");

            $location.path("/orarend/" + begin + "/" + end);
        }

        function perviousDay() {
            var day = moment(vm.dates.begin).subtract( {days: 1}).format("YYYY-MM-DD");


            $location.path("/orarend/" + day);
        }

        function nextWeek() {
            var begin = moment(vm.dates.begin).add( {weeks: 1}).format("YYYY-MM-DD");
            var end = moment(vm.dates.end).add( {weeks: 1}).format("YYYY-MM-DD");

            $location.path("/orarend/" + begin + "/" + end);
        }

        function nextDay() {
            var day = moment(vm.dates.begin).add( {days: 1}).format("YYYY-MM-DD");

            $location.path("/orarend/" + day);
        }

        function currentWeek() {

            $location.path("/orarend/heti");
        }


        function today () {
            $location.path("/orarend/" + moment().format('YYYY-MM-DD'));
        }

        function canJoin(instance) {

            return vm.userInfo &&
                    !instance.isFull &&
                    !instance.signedUp &&
                    (vm.userInfo.roles.indexOf('coach') > -1 || (vm.credit && vm.credit.free > 0)) &&
                    moment().isBefore(instance.date);
        }

        function join(instance) {
            if (canJoin(instance)) {
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
                    errorService.modal(error, "sm");
                });

            } else if (!vm.userInfo) {
                $location.path("/belepes");
            }
        }

        function canLeave(instance) {
            return instance.signedUp &&
                moment().add({ days: 1}).isBefore(instance.date);
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
                    errorService.modal(error, "sm");
                });
            }
        }

        function showAttendees(instance) {

            $location.path("/resztvevok/" + instance.id);
        }

        function createInstanceFromData(data) {

            var instance = {
                id: data._id,
                name: data.name,
                coach: data.coach,
                current: data.current,
                max: data.max,
                date: data.date,
                attendees: data.attendees ? data.attendees.slice(0) : undefined,
                signedUp: data.isAttendee,
                showAttendeeList: vm.userInfo ? (( vm.userInfo.roles.indexOf('admin') > -1) || (data.coach === vm.userInfo.name)) : false
            };

            calculateInstanceProperties(instance, instance.signedUp);

            return instance;
        }

        function calculateInstanceProperties(instance, signedUp) {
            instance.currentBar = (instance.current === 0 || instance.current > 3) ? instance.current : 4;
            instance.barText = instance.current + " / " + instance.max;
            instance.isFull = (instance.current >= instance.max);
            instance.signedUp = signedUp;
        }

        function canCancelTraining (instance) {

            return vm.userInfo && (vm.userInfo.roles.indexOf('admin') > -1 || (vm.userInfo.name == instance.coach && moment().isBefore(instance.date)));
        }

        function cancelTraining (instance) {

            decisionService.modal('Óra lemondása', 'Biztos vagy benne, hogy le szeretnéd mondani ezt az órát?', 'Biztos', 'Mégsem')
                .then(function () {
                    scheduleService.cancelTraining(instance.id)
                        .then(function () {
                            infoService.modal('Sikeres lemondás', 'Sikeresen lemondtad az edzést. Az érintett tanítványok email értesítést kaptak, és a bérletükön jóváírásra került egy kredit.')
                                .then(function () { fetchSchedule(vm.dates.begin, vm.dates.end); });
                        }, function (err) {
                            errorService.modal(error);
                        });
                });
        }
    }
})();
