(function () {

    "use strict";

    angular
        .module("gymassistant.front.attendees")
        .controller("Attendees", Attendees);

    Attendees.$inject = ["$rootScope", "$window", "$routeParams", "$location", "authenticationService", "scheduleService", "attendeesService", "errorService"];

    function Attendees($rootScope, $window, $routeParams, $location, authenticationService, scheduleService, attendeesService, errorService) {

        var attendees = this;

        checkAuthentication();

        attendees.training = {};
        attendees.allUsers = [];
        attendees.usersCanBeAdded = [];
        attendees.newAttendee = "";
        attendees.addAttendeeError = null;

        attendees.checkedIn = checkedIn;
        attendees.notCheckedIn = notCheckedIn;
        attendees.canCheckIn = canCheckIn;
        attendees.checkIn = checkIn;
        attendees.canUndoCheckedIn = canUndoCheckedIn;
        attendees.undoCheckIn = undoCheckIn;
        attendees.missedCheckIn = missedCheckIn;
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

            attendees.training = result.instance;
        });

        scheduleService.getUsers().then(function(result) {

            attendees.allUsers = result.users;

            attendees.allUsers.forEach(function (user) {
               if (attendees.training.attendees.indexOf(user.userName) === -1) {
                   attendees.usersCanBeAdded.push(user);
               }
            });
        });

        function checkedIn(attendee) {

            return $.inArray(attendee, attendees.training.participants) > -1;
        }

        function notCheckedIn(attendee) {

            return $.inArray(attendee, attendees.training.participants) === -1;
        }
        
        function canUndoCheckedIn(attendee) {
            
            return moment().isSame(attendees.training.date, "day") && checkedIn(attendee);
        }

        function canCheckIn(attendee) {

            return moment().isSame(attendees.training.date, "day") && notCheckedIn(attendee);
        }

        function missedCheckIn(attendee) {

            return moment().isAfter(attendees.training.date, "day") && notCheckedIn(attendee);
        }

        function checkIn(attendee) {

            attendeesService.checkIn(attendees.training.id, attendee).then(
                function() {
                    attendees.training.participants.push(attendee);
                },
                function(error) {
                    errorService.modal(error, "sm");
                });
        }

        function undoCheckIn(participant) {

            attendeesService.undoCheckIn(attendees.training.id, participant).then(
                function() {
                    attendees.training.participants = $.grep(attendees.training.participants,
                        function(current) {
                            return current != participant;
                        });
                },
                function(error) {
                    errorService.modal(error, "sm");
                });
        }

        function remove(attendee) {

            attendeesService.removeFromTraining(attendees.training.id, attendee).then(

                function () {

                    attendees.training.attendees = $.grep(attendees.training.attendees,
                        function (current) {
                            return current != attendee;
                        });
                },
                function (error) {

                    errorService.modal(error, "sm");
                });
        }

        function canAdd() {

            return attendees.training.attendees.length < 12
                && moment().subtract({day: 1}).isBefore(attendees.training.date, "day");
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

            attendees.addAttendeeError = "";

            attendeesService.addToTraining(attendees.training.id, attendees.newAttendee.userName).then(

                function() {

                    attendees.training.attendees.push(attendees.newAttendee.userName);
                    attendees.newAttendee = null;
                },
                function (error) {

                    errorService.modal(error, "sm");
                });
        }
    }
})();