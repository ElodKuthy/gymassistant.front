(function () {

    'use strict';

    angular
        .module('gymassistant.front.coach')
        .controller('AddCreditController', AddCreditController);

    /* @ngInject */
    function AddCreditController($routeParams, $scope, $location, $filter, $rootScope, coachService, errorService, allUsers, series, userInfo, adminService, infoService, loadingService) {

        var vm = this;

        vm.userName = $routeParams.tanitvany ? $routeParams.tanitvany : '';
        vm.amountPerWeek = 2;
        vm.period = 4;
        vm.amount = amount;
        vm.type = type;
        vm.choicesDisabled = false;
        vm.addSubscription = addSubscription;
        vm.series = series;
        vm.usersCanBeAdded = allUsers.usersCanBeAdded;
        vm.coachesCanBeAdded = allUsers.coachesCanBeAdded;
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

            if (vm.type() === 'first') {
                if (vm.adminMode) {
                   adminService.addFirstTime(vm.userName, moment(vm.calendar.date).startOf('day').unix(), vm.coachName, series).then(subscriptionAdded, error);
                } else {
                    coachService.addFirstTime(vm.userName, series).then(subscriptionAdded, error);
                }
            } else {
                if (vm.adminMode) {
                    adminService.addNewSubscription(vm.amount(), vm.userName, vm.coachName, moment(vm.calendar.date).startOf('day').unix(), periodString(), series).then(subscriptionAdded, error);
                } else {
                    coachService.addNewSubscription(vm.amount(), vm.userName, periodString(), series).then(subscriptionAdded, error);
                }
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
            if (vm.amount() == 1) {
                vm.series.forEach(function (current) {
                    current.selected = false;
                });
            } else if (!vm.displayAllTrainings) {
                vm.series.forEach(function (current) {
                    if (current.coach != vm.userInfo.name) {
                        current.selected = false;
                    }
                });
            }
        }

        $scope.$watch('vm.amountPerWeek', vm.checkAmountDiff);

        vm.showCurrentSeries = function (currentSeries) {
            if (vm.adminMode) {
                return true;
            }

            if (vm.displayAllTrainings || currentSeries.coach == vm.userInfo.name) {
                if (vm.period > 1) {
                    return true;
                } else if (moment(currentSeries.date).weekday() == moment().weekday()) {
                    return true;
                }
            }

            return false;
        }

        var _chosenIndex = -1;
        vm.chosen = function (index) {
            if (index) {
                if (_chosenIndex > -1) {
                    vm.series[_chosenIndex].selected = false;
                }
                if (index < vm.series.length) {
                    vm.series[index].selected = true;
                    _chosenIndex = index;
                }
            }

            return _chosenIndex;
        }
    }

})();