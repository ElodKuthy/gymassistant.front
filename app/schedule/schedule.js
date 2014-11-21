(function () {

    "use strict";

    angular
        .module("gymassistant.front.schedule")
        .controller("Schedule", Schedule);

    /* @ngInject */
    function Schedule($routeParams, $location, authenticationService, scheduleService, errorService, eventHelper) {

        var schedule = this;

        schedule.instances = {};
        schedule.userInfo = null;
        schedule.credits = {};
        schedule.showAttendeeList = false;

        schedule.perviousWeek = perviousWeek;
        schedule.nextWeek = nextWeek;
        schedule.currentWeek = currentWeek;
        schedule.canJoin = canJoin;
        schedule.join = join;
        schedule.canLeave = canLeave;
        schedule.leave = leave;
        schedule.showAttendees = showAttendees;

        eventHelper.subscribe.authenticationChanged(fetchSchedule);

        fetchSchedule($routeParams.begin, $routeParams.end);

        function fetchSchedule(begin, end) {

            scheduleService.getSchedule(begin, end).then(function (result) {

                schedule.dates = result.dates;

                var currentDate = moment(0);
                var currentWeek = [];
                var currentDay = [];

                schedule.weeks = [];

                result.schedule.forEach(function (data) {

                    if (!currentDate.isSame(data.date, "day")) {
                        if (!currentDate.isSame(data.date, "week")) {
                            currentWeek = [];
                            schedule.weeks.push(currentWeek);
                        }
                        currentDate = moment(data.date).endOf("day");
                        currentDay = [];
                        currentWeek.push(currentDay);
                    }

                    var instance = createInstanceFromData(data);

                    currentDay.push(instance);
                });

            });

            scheduleService.getCredits().then(function (result) {
                schedule.credits = result.credits;
            });

            authenticationService.getUserInfo().then(function (userInfo) {
                schedule.userInfo = userInfo;
                schedule.showAttendeeList = (userInfo && userInfo.roles) ? (userInfo.roles.indexOf("coach") > -1) : false;
            });

        }

        function perviousWeek() {
            var begin = moment(schedule.dates.begin).subtract( {weeks: 1}).format("YYYY-MM-DD");
            var end = moment(schedule.dates.end).subtract( {weeks: 1}).format("YYYY-MM-DD");

            $location.path("/orarend/" + begin + "/" + end);
        }

        function nextWeek() {
            var begin = moment(schedule.dates.begin).add( {weeks: 1}).format("YYYY-MM-DD");
            var end = moment(schedule.dates.end).add( {weeks: 1}).format("YYYY-MM-DD");

            $location.path("/orarend/" + begin + "/" + end);
        }

        function currentWeek() {

            $location.path("/orarend/aktualis");
        }

        function canJoin(instance) {

            return schedule.userInfo &&
                    schedule.credits.free > 0 &&
                    !instance.isFull &&
                    !instance.signedUp &&
                    moment().isBefore(instance.date);
        }

        function join(instance) {
            if (canJoin(instance)) {
                scheduleService.joinClass(instance.id).then(function () {
                    instance.current++;
                    schedule.credits.free--;
                    if (instance.attendees) {
                        instance.attendees.push(schedule.userInfo.userName);
                    }
                    calculateInstanceProperties(instance, true);
                }, function (error) {
                    errorService.modal(error, "sm");
                });

            } else if (!schedule.userInfo) {
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
                        var index = instance.attendees.indexOf(schedule.userInfo.userName);
                        if (index > -1) {
                            instance.attendees.splice(index, 1);
                        }
                    }
                    schedule.credits.free++;
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
                id: data.id,
                parent: data.parent,
                name: data.name,
                coach: data.coach,
                current: data.current,
                max: data.max,
                date: data.date,
                attendees: data.attendees ? data.attendees.slice(0) : undefined,
                signedUp: data.signedUp
            };

            calculateInstanceProperties(instance, instance.signedUp);

            return instance;
        }

        function calculateInstanceProperties(instance, signedUp) {
            instance.barText = instance.current + " / " + instance.max;
            instance.isFull = (instance.current >= instance.max);
            instance.signedUp = signedUp;
        }

    }
})();
