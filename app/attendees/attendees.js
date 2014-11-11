(function () {

    "use strict";

    angular
        .module("gymassistant.front.attendees")
        .controller("Attendees", Attendees);

    Attendees.$inject = ["$rootScope", "$window", "$routeParams", "$location", "authenticationService", "scheduleService"];

    function Attendees($rootScope, $window, $routeParams, $location, authenticationService, scheduleService) {

        var attendees = this;

        checkAuthentication();

        attendees.trainingInstance = {};
        attendees.allUsers = [];
        attendees.usersCanBeAdded = [];
        attendees.newAttendee = "";
        attendees.addAttendeeError = null;

        attendees.checkedIn = checkedIn;
        attendees.notCheckedIn = notCheckedIn;
        attendees.canCheckIn = canCheckIn;
        attendees.checkIn = checkIn;
        attendees.undoCheckIn = undoCheckIn;
        attendees.remove = remove;
        attendees.canAdd = canAdd;
        attendees.add = add;

        function checkAuthentication() {
            authenticationService.getUserInfo().then(function (userInfo) {
                if (!userInfo) {
                    $window.history.length > 1 ? $window.history.back() : $location.path('/');
                }
            });
        }

        $rootScope.$on("authenticationChanged", checkAuthentication);

        scheduleService.getInstance($routeParams.id).then(function(result) {

            attendees.trainingInstance = result.instance;
            attendees.trainingInstance.participants = [];
        });

        scheduleService.getUsers().then(function(result) {

            attendees.allUsers = result.users;

            attendees.allUsers.forEach(function (user) {
               if (attendees.trainingInstance.attendees.indexOf(user.userName) === -1) {
                   attendees.usersCanBeAdded.push(user);
               }
            });
        });

        function checkedIn(attendee) {

            return $.inArray(attendee, attendees.trainingInstance.participants) > -1;
        }

        function notCheckedIn(attendee) {

            return $.inArray(attendee, attendees.trainingInstance.participants) === -1;
        }

        function canCheckIn(attendee) {

            return moment().isSame(attendees.trainingInstance.date, "day") && notCheckedIn(attendee);
        }

        function checkIn(attendee) {

            attendees.trainingInstance.participants.push(attendee);
        }

        function undoCheckIn(participant) {

            attendees.trainingInstance.participants = $.grep(attendees.trainingInstance.participants,
                function(current) {
                    return current != participant;
                });
        }

        function remove(attendee) {

            attendees.trainingInstance.attendees = $.grep(attendees.trainingInstance.attendees,
                function(current) {
                    return current != attendee;
                });
        }

        function canAdd() {

            return attendees.trainingInstance.attendees.length < 12
                && moment().subtract({hours: 2}).isBefore(attendees.trainingInstance.date);
        }

        function add() {

            var userToBeAdded = $.grep(attendees.usersCanBeAdded, function(user) {
                return user.userName === attendees.newAttendee.userName;
            });

            if (userToBeAdded.length === 0) {
                attendees.addAttendeeError = "Nincs ilyen nevű tanítvány";
                return;
            }


            if (attendees.newAttendee.credits === 0) {
                attendees.addAttendeeError = "A tanítványnak nincs szabad kredite";
                return;
            }

            attendees.trainingInstance.attendees.push(attendees.newAttendee.userName);

            attendees.addAttendeeError = "";
            attendees.newAttendee = null;
        }
    }
})();