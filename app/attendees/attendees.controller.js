(function () {

    "use strict";

    angular
        .module("gymassistant.front.attendees")
        .controller("AttendeesController", AttendeesController);

    /* @ngInject */
    function AttendeesController($routeParams, $filter, $rootScope, $q, scheduleService, attendeesService, errorService, eventHelper, locationHelper, loadingService, userInfo, training, allUsers, decisionService, authenticationService, infoService) {

        var vm = this;

        vm.userInfo = userInfo;
        vm.adminMode = userInfo.roles.indexOf('admin') > -1;
        vm.training = training;
        vm.allUsers = allUsers;
        vm.usersCanBeAdded = [];
        vm.coachesCanBeSelected = [];
        vm.newAttendee = "";
        vm.addAttendeeError = null;

        vm.canCheckIn = canCheckIn;
        vm.checkIn = checkIn;
        vm.canUndoCheckedIn = canUndoCheckedIn;
        vm.canRemove = canRemove;
        vm.undoCheckIn = undoCheckIn;
        vm.missedCheckIn = missedCheckIn;
        vm.remove = remove;
        vm.canAdd = canAdd;
        vm.add = add;

        vm.formattedTrainingDate = $filter('date')(moment(vm.training.date).toDate(), 'yyyy. MMMM d. HH:mm');
        $rootScope.title = "Résztvevők - " + vm.formattedTrainingDate;

        refreshUsersCanBeAdded();
        refreshCoachesCanBeSelected();

        function refreshUsersCanBeAdded() {
            vm.usersCanBeAdded = [];
            vm.allUsers.forEach(function (user) {
                if ($.grep(vm.training.attendees, function (current) { return current.name === user.name; }).length === 0) {
                    vm.usersCanBeAdded.push(user.name);
                }
            });
        }

        function refreshCoachesCanBeSelected() {
            vm.coachesCanBeSelected = [];
            vm.allUsers.forEach(function (user) {
                if (user.roles.indexOf('coach') > -1 && training.coach != user.name) {
                    vm.coachesCanBeSelected.push(user.name);
                }
            });
        }

        function canUndoCheckedIn(attendee) {
            return (vm.adminMode || moment().isSame(vm.training.date, 'day')) && attendee.checkedIn;
        }

        function canCheckIn(attendee) {
            return (vm.adminMode || moment().isSame(vm.training.date, 'day')) && !attendee.checkedIn;
        }

        function canRemove(attendee) {
            return (vm.adminMode || moment().isBefore(moment(vm.training.date).subtract({ hour: 3 }))) && !attendee.checkedIn;
        }

        function missedCheckIn(attendee) {
            return moment().subtract({ hours: 1 }).isAfter(vm.training.date) && !attendee.checkedIn;
       }

        function checkIn(attendee) {
            attendeesService.checkIn(vm.training._id, attendee.name).then(
                function() {
                    $.grep(vm.training.attendees, function (current) { return current.name === attendee.name; })[0].checkedIn = true;
                },
                function(error) {
                    errorService.modal(error, "sm");
                });
        }

        function undoCheckIn(attendee) {
            attendeesService.undoCheckIn(vm.training._id, attendee.name).then(
                function() {
                    $.grep(vm.training.attendees,
                        function(current) {
                            return current.name === attendee.name;
                        })[0].checkedIn = false;
                },
                function(error) {
                    errorService.modal(error, "sm");
                });
        }

        function remove(attendee) {

            $q.when(loadingService.startLoading())
                .then(function () {
                    return attendeesService.removeFromTraining(vm.training._id, attendee.name);
                })
                .then(function () {
                    vm.training.attendees = $.grep(vm.training.attendees,
                        function (current) {
                            return current.name != attendee.name;
                        });
                    refreshUsersCanBeAdded();
                })
                .catch(function (error) {
                    errorService.modal(error);
                })
                .finally(function () {
                    loadingService.endLoading();
                });
        }

        function canAdd() {

            return vm.training.attendees.length < 16 &&
                (vm.adminMode || moment().startOf('day').isBefore(vm.training.date));
        }

        function add(form) {

            if (!form || form.$invalid || vm.isAmountDiff) {
                return;
            }

            if (vm.userInfo.preferences.askIrreversibleJoining &&
                vm.userInfo.roles.indexOf('admin') == -1 &&
                moment().add({ hours: 3}).isAfter(vm.training.date)) {

                decisionService.modal(
                    'Hozzáadás',
                    'Biztos, hogy fel szertnél írni ' + vm.newAttendee + '-t erre az órára? Mivel ez az óra 3 órán belül kezdődik, nem lehet visszavonni a részvételt, ha már egyszer felírtad!',
                    'Biztos',
                    'Mégsem',
                    { title: 'Ne jelenjen meg többé ez a kérdés, mindíg add hozzá a tanítványt!', value: false })
                    .then(function (result) {
                        if (result.checkbox) {
                            vm.userInfo.preferences.askIrreversibleJoining = false;
                            authenticationService.updatePreferences(vm.userInfo.preferences).then(function (userInfo) { vm.userInfo = userInfo; });
                        }
                        doAdd();
                    });
            } else {
                doAdd();
            }
        }

        function doAdd() {
            $q.when(loadingService.startLoading())
                .then(function () {
                    return attendeesService.addToTraining(vm.training._id, vm.newAttendee);
                })
                .then(function() {
                    return scheduleService.getInstance(vm.training._id);
                })
                .then(function (training) {
                    vm.training = training;
                    vm.newAttendee = null;
                    refreshUsersCanBeAdded();
                })
                .catch(function (error) {
                    errorService.modal(error);
                })
                .finally(function () {
                    loadingService.endLoading();
                });
        }

        vm.canChangeCoach = function () {
            return vm.adminMode  || vm.userInfo.name == vm.training.coach;
        }

        vm.change = function(form) {

            if (!form || form.$invalid || vm.isAmountDiff) {
                return;
            }

            loadingService.startLoading();

            attendeesService.changeCoach(vm.training._id, vm.newCoach)
                .then(function () {
                    loadingService.endLoading();
                    infoService.modal('Edző váltás', 'Sikeresen megváltoztattad az óratartó edző személyét.')
                        .then(function () {
                            if (!vm.adminMode) {
                                locationHelper.back();
                            } else {
                                vm.training.coach = vm.newCoach;
                                vm.newCoach = '';
                                refreshCoachesCanBeSelected();
                            }
                        });
                }, function (error) {
                    loadingService.endLoading();
                    errorService.modal(error);
                });
        }
    }
})();