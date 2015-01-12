(function () {

    'use strict';

    angular
        .module('gymassistant.front.coach')
        .controller('AddCredit', AddCredit);

    /* @ngInject */
    function AddCredit($modal, $filter, coachService, errorService, clientName, allUsers, series) {

        var addCredit = this;

        addCredit.userName = clientName ? clientName : '';
        addCredit.amountPerWeek = amountPerWeek;
        addCredit.amount = amount;
        addCredit.period = period;
        addCredit.type = type;
        addCredit.choicesDisabled = false;
        addCredit.addSubscription = addSubscription;
        addCredit.series = [];
        addCredit.usersCanBeAdded = [];
        addCredit.hasError = false;
        addCredit.error = '';
        addCredit.selectedAmountPerWeek = selectedAmountPerWeek;
        addCredit.selectedAmount = selectedAmount;
        addCredit.calendar = {};
        addCredit.calendar.today = calendarToday;
        addCredit.calendar.clear = calendarClear;
        addCredit.calendar.minDate = moment().add().toDate();
        addCredit.calendar.maxDate = moment().add({ months: 3, weeks: 1}).toDate();
        addCredit.calendar.open = calendarOpen;
        addCredit.calendar.opened = false;
        addCredit.periodType = 'normal';
        addCredit.amountChoicesDisabled = amountChoicesDisabled;
        addCredit.periodChoicesDisabled = periodChoicesDisabled;
        addCredit.datePickedDisabled = datePickedDisabled;

        function calendarToday() {
            addCredit.calendar.date = $filter('date')(addCredit.calendar.minDate, 'longDate');
        }

        addCredit.calendar.today();

        function calendarClear() {
            addCredit.calendar.date = null;
        }

        /* @ngInject */
        function calendarOpen($event) {
            $event.preventDefault();
            $event.stopPropagation();

            addCredit.calendar.opened = true;
        }

        addCredit.calendar.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        var _type = 'normal';
        var _amount = 2;
        var _period = 4;

        allUsers.forEach(function (user) {
            if (user.roles.indexOf('coach') === -1 && user.roles.indexOf('admin') === -1) {
                addCredit.usersCanBeAdded.push(user.name);
            }
        });

        series.forEach(function (current) {
                var dates = [];
                current.dates.forEach(function (currentDate) {
                    dates.push($filter('date')(moment({ hours: currentDate.hour }).day(currentDate.day).toDate(), 'EEEE H:mm'));
                });

                addCredit.series.push({
                    _id: current._id,
                    name: current.name,
                    firstDate: moment({ days: current.dates[0].day, hours: current.dates[0].hour }).toDate(),
                    dates: dates,
                    selected: false
                });
        });

        function amountChoicesDisabled() {
            return _type === 'first' || _type === 'seminar';
        }

        function periodChoicesDisabled() {
            return _type === 'first' || _type === 'seminar' || addCredit.periodType === 'custom';
        }

        function datePickedDisabled() {
            return _type === 'first' || _type === 'seminar' || addCredit.periodType === 'normal';
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
            if(addCredit.periodType === 'normal') {

                if (value) {
                    _period = value;
                }

                return _period;
            } else {
                return moment(addCredit.calendar.date).diff(moment(), 'weeks') + 1;
            }
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
                addCredit.hasError = true;
                addCredit.error = err;
            } else {
                addCredit.hasError = false;
                addCredit.error = '';
            }
        }

        function addSubscription() {

            if (!addCredit.userName) {
                setError('A tanítvány nevének megadása kötelező');
                return;
            }

            if (addCredit.amount() != addCredit.selectedAmount()) {
                setError('A bérlet alkalmak száma nem egyezik a kiválasztott órák számával');
                return;
            }

            setError();

            var series = [];

            addCredit.series.forEach(function (current) {
                if (current.selected) {
                    series.push(current._id);
                }
            });

            if (addCredit.periodType === 'normal') {
                coachService.addNewSubscription(addCredit.amount(), addCredit.userName, periodString(), series).then(subscriptionAdded, error);
            } else {
                coachService.addNewSubscriptionTillDate(addCredit.amountPerWeek(), addCredit.userName, moment(addCredit.calendar.date).unix(), series).then(subscriptionAdded, error);
            }

            function error(err) {
                errorService.modal(err, 'sm');
            }

            function subscriptionAdded(result) {
                $modal.open({
                    templateUrl: "modal/info.html",
                    controller: "Info",
                    controllerAs: "info",
                    size: "sm",
                    resolve: {
                        title: function () {
                            return "Bérletvásárlás";
                        },
                        message: function () {
                            return "Sikeres bérletvásárlás";
                        }
                    }
                });
            }
        }

        function selectedAmountPerWeek() {
            var result = 0;
            addCredit.series.forEach(function (current) {
                if (current.selected) {
                    result += current.dates.length;
                }
            });

            return result;
        }

        function selectedAmount() {
            return selectedAmountPerWeek() * period();
        }
    }

})();