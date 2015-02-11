(function () {

    'use strict';

    angular
        .module('gymassistant.front.coach')
        .controller('AddCreditController', AddCreditController);

    /* @ngInject */
    function AddCreditController($location, $filter, $rootScope, coachService, errorService, clientName, allUsers, series, userInfo, adminService, infoService, loadingService) {

        var vm = this;

        vm.userName = clientName ? clientName : '';
        vm.amountPerWeek = amountPerWeek;
        vm.amount = amount;
        vm.period = period;
        vm.type = type;
        vm.choicesDisabled = false;
        vm.addSubscription = addSubscription;
        vm.series = [];
        vm.usersCanBeAdded = [];
        vm.coachesCanBeAdded = [];
        vm.hasError = false;
        vm.error = '';
        vm.selectedAmountPerWeek = selectedAmountPerWeek;
        vm.selectedAmount = selectedAmount;
        vm.calendar = {};
        vm.calendar.today = calendarToday;
        vm.calendar.clear = calendarClear;
        vm.calendar.minDate = moment({ years: 2014 }).toDate();
        vm.calendar.maxDate = moment().add({ months: 3, weeks: 1}).toDate();
        vm.calendar.open = calendarOpen;
        vm.calendar.opened = false;
        vm.amountChoicesDisabled = amountChoicesDisabled;
        vm.periodChoicesDisabled = periodChoicesDisabled;
        vm.userInfo = userInfo
        vm.adminMode = vm.userInfo.roles.indexOf('admin') > -1;
        vm.displayAllTrainings = false;
        vm.cleanUpSelectedSeries = cleanUpSelectedSeries;


        $rootScope.title = 'Bérletvásárlás';

        function calendarToday() {
            vm.calendar.date = $filter('date')(moment().toDate(), 'longDate');
        }

        vm.calendar.today();

        function calendarClear() {
            vm.calendar.date = null;
        }

        /* @ngInject */
        function calendarOpen($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.calendar.opened = true;
        }

        vm.calendar.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        var _type = 'normal';
        var _amount = 2;
        var _period = 4;

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

                    amountPerWeek(1);
                    period(1);
                }
            }

            return _type;
        }

        function amountPerWeek(value) {
            if (value) {
                _amount = value;
            }

            return _amount;
        }

        function period(value) {

            if (value) {
                _period = value;
            }

            return _period;
        }


        function periodString() {

            return _period === 1 ? 'today' : _period === 4 ? 'four_weeks' : _period === 12 ? 'twelve_weeks' : '';
        }

        function amount(value) {
            if (value) {
                amountPerWeek(value / period());
            }

            return amountPerWeek() * period();
        }

        function setError(err) {
            if (err){
                vm.hasError = true;
                vm.error = err;
            } else {
                vm.hasError = false;
                vm.error = '';
            }
        }

        function addSubscription() {

            if (!vm.userName) {
                setError('A tanítvány nevének megadása kötelező');
                return;
            }

            if (vm.adminMode && !vm.coachName) {
                setError('Az edző nevének megadása kötelező');
                return;
            }

            if (vm.amount() != vm.selectedAmount()) {
                setError('A bérlet alkalmak száma nem egyezik a kiválasztott órák számával');
                return;
            }

            setError();

            loadingService.startLoading();

            var series = [];

            vm.series.forEach(function (current) {
                if (current.selected) {
                    series.push(current._id);
                }
            });

            if (vm.adminMode) {
                adminService.addNewSubscription(vm.amount(), vm.userName, vm.coachName, moment(vm.calendar.date).unix(), periodString(), series).then(subscriptionAdded, error);
            } else {
                coachService.addNewSubscription(vm.amount(), vm.userName, periodString(), series).then(subscriptionAdded, error);
            }

            function error(err) {
                loadingSerive.endLoading();
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
            return selectedAmountPerWeek() * period();
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
    }

})();