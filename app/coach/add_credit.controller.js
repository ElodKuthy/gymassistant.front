(function () {

    'use strict';

    angular
        .module('gymassistant.front.coach')
        .controller('AddCreditController', AddCreditController);

    /* @ngInject */
    function AddCreditController($scope, $location, $filter, $rootScope, coachService, errorService, clientName, allUsers, series, userInfo, adminService, infoService, loadingService) {

        var vm = this;

        vm.userName = clientName ? clientName : '';
        vm.amountPerWeek = 2;
        vm.period = 4;
        vm.amount = amount;
        vm.type = type;
        vm.choicesDisabled = false;
        vm.addSubscription = addSubscription;
        vm.series = [];
        vm.usersCanBeAdded = [];
        vm.coachesCanBeAdded = [];
        vm.selectedAmountPerWeek = selectedAmountPerWeek;
        vm.selectedAmount = selectedAmount;
        vm.calendar = {
            minDate: new Date(2014),
            maxDate: moment().add({ months: 3, weeks: 1}).toDate(),
            date: new Date()
        }
        vm.amountChoicesDisabled = amountChoicesDisabled;
        vm.periodChoicesDisabled = periodChoicesDisabled;
        vm.userInfo = userInfo;
        vm.adminMode = vm.userInfo.roles.indexOf('admin') > -1;
        vm.displayAllTrainings = false;
        vm.cleanUpSelectedSeries = cleanUpSelectedSeries;
        vm.isAmountDiff = true;
        vm.checkAmountDiff = checkAmountDiff;

        $rootScope.title = 'Bérletvásárlás';

        if (!vm.adminMode) {
            vm.coachName = vm.userInfo.name;
        }

        var _type = 'normal';

        allUsers.forEach(function (user) {
            if (user.roles.indexOf('admin') === -1) {
                if (user.roles.indexOf('coach') === -1) {
                    vm.usersCanBeAdded.push(user.name);
                } else {
                    vm.coachesCanBeAdded.push(user.name);
                }
            }
        });

        series.forEach(function (current) {

                vm.series.push({
                    _id: current._id,
                    name: current.name,
                    coach: current.coach,
                    date: moment({ days: current.date.day, hours: current.date.hour }).toDate(),
                    dateText: $filter('date')(moment({ hours: current.date.hour }).day(current.date.day).toDate(), 'EEEE H:mm'),
                    selected: false
                });
        });

        function checkAmountDiff() {
            vm.isAmountDiff = (amount() != selectedAmount());
        }

        function amount () {
            return vm.amountPerWeek * vm.period;
        }

        function amountChoicesDisabled() {
            return _type === 'first' || _type === 'seminar';
        }

        function periodChoicesDisabled() {
            return _type === 'first' || _type === 'seminar';
        }

        function type(value) {
            if (value) {
                _type = value;
                if (_type === 'normal' || _type === 'private') {

                } else {

                    vm.amountPerWeek = 1;
                    vm.period = 1;
                }
            }

            return _type;
        }


        function periodString() {

            return vm.period === 1 ? 'today' : vm.period === 4 ? 'four_weeks' : vm.period === 12 ? 'twelve_weeks' : '';
        }

        function addSubscription (form) {

            if (!form || form.$invalid) {
                return;
            }

            loadingService.startLoading();

            var series = [];

            vm.series.forEach(function (current) {
                if (current.selected) {
                    series.push(current._id);
                }
            });

            if (vm.adminMode) {
                adminService.addNewSubscription(vm.amount(), vm.userName, vm.coachName, moment(vm.calendar.date).startOf('day').unix(), periodString(), series).then(subscriptionAdded, error);
            } else {
                coachService.addNewSubscription(vm.amount(), vm.userName, periodString(), series).then(subscriptionAdded, error);
            }

            function error(err) {
                loadingService.endLoading();
                errorService.modal(err, 'sm');
            }

            function subscriptionAdded () {
                loadingService.endLoading();
                infoService.modal('Bérletvásárlás', 'Sikeres bérletvásárlás')
                  .then(function () { $location.path('/profil/' + vm.userName); });
            }
        }

        function selectedAmountPerWeek() {
            var result = 0;
            vm.series.forEach(function (current) {
                if (current.selected) {
                    result ++;
                }
            });

            return result;
        }

        function selectedAmount() {
            return selectedAmountPerWeek() * vm.period;
        }

        function cleanUpSelectedSeries () {
            if (!vm.displayAllTrainings) {
                vm.series.forEach(function (current) {
                    if (current.coach != vm.userInfo.name) {
                        current.selected = false;
                    }
                });
            }
        }

        $scope.$watch('vm.amountPerWeek', vm.checkAmountDiff);
    }

})();