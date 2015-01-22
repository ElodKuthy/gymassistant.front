(function () {

    "use strict";

    angular
        .module("gymassistant.front.attendees")
        .controller("Attendees", Attendees);

    /* @ngInject */
    function Attendees(scheduleService, attendeesService, errorService, eventHelper, locationHelper, userInfo, training, allUsers) {

        var attendees = this;

        attendees.userInfo = userInfo;
        attendees.adminMode = userInfo.roles.indexOf('admin') > -1;
        attendees.training = training;
        attendees.allUsers = allUsers;
        attendees.usersCanBeAdded = [];
        attendees.newAttendee = "";
        attendees.addAttendeeError = null;

        attendees.canCheckIn = canCheckIn;
        attendees.checkIn = checkIn;
        attendees.canUndoCheckedIn = canUndoCheckedIn;
        attendees.undoCheckIn = undoCheckIn;
        attendees.missedCheckIn = missedCheckIn;
        attendees.remove = remove;
        attendees.canAdd = canAdd;
        attendees.add = add;

        eventHelper.subscribe.authenticationChanged(function() {
            locationHelper.onlyCoach().result(function(userInfo) {
                attendees.userInfo = userInfo;
            });
        });

        attendees.allUsers.forEach(function (user) {
            if ($.grep(attendees.training.attendees, function (current) { return current.name === user.name; }).length === 0) {
                attendees.usersCanBeAdded.push(user);
            }
        });

        function canUndoCheckedIn(attendee) {
            return moment().subtract({ hours: 1 }).isBefore(attendees.training.date) && attendee.checkedIn;
        }

        function canCheckIn(attendee) {
            return moment().subtract({ hours: 1 }).isBefore(attendees.training.date) && !attendee.checkedIn;
        }

        function missedCheckIn(attendee) {
            return moment().subtract({ hours: 1 }).isAfter(attendees.training.date) && !attendee.checkedIn;
       }

        function checkIn(attendee) {
            attendeesService.checkIn(attendees.training._id, attendee.name).then(
                function() {
                    $.grep(attendees.training.attendees, function (current) { return current.name === attendee.name; })[0].checkedIn = true;
                },
                function(error) {
                    errorService.modal(error, "sm");
                });
        }

        function undoCheckIn(attendee) {
            attendeesService.undoCheckIn(attendees.training._id, attendee.name).then(
                function() {
                    $.grep(attendees.training.attendees,
                        function(current) {
                            return current.name === attendee.name;
                        })[0].isParticipant = false;
                },
                function(error) {
                    errorService.modal(error, "sm");
                });
        }

        function remove(attendee) {

            attendeesService.removeFromTraining(attendees.training._id, attendee.name).then(

                function () {

                    attendees.training.attendees = $.grep(attendees.training.attendees,
                        function (current) {
                            return current.name != attendee.name;
                        });
                },
                function (error) {

                    errorService.modal(error, "sm");
                });
        }

        function canAdd() {

            return attendees.training.attendees.length < 16 &&
                (attendees.adminMode || moment().subtract({hours: 3}).isBefore(attendees.training.date));
        }

        function add() {

            var userToBeAdded = $.grep(attendees.usersCanBeAdded, function(user) {
                return user.name === attendees.newAttendee.name;
            });

            if (userToBeAdded.length === 0) {
                attendees.addAttendeeError = "Nincs ilyen nevű tanítvány";
                return;
            }

            attendees.addAttendeeError = "";

            attendeesService.addToTraining(attendees.training._id, attendees.newAttendee.name).then(

                function() {

                    scheduleService.getInstance(attendees.training._id).then(function (result) {
                        attendees.training = result;
                        attendees.newAttendee = null;
                    }, function (error) {
                        errorService.modal(error, "sm");
                    });

                },
                function (error) {

                    errorService.modal(error, "sm");
                });
        }
    }
})();