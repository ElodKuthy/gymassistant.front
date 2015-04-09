(function () {

    'use strict';

    angular
        .module('gymassistant.front.stats')
        .controller('OverviewController', OverviewController);

    /* @ngInject */
    function OverviewController($rootScope, $scope, $location, $routeParams, $filter, userInfo, coaches, stats, periods, multipliers) {

        var vm = this;

        vm.dates = {
          opened: true,
          minDate: moment({years: 2014, month: 1, day: 1}),
          maxDate: moment({years: 2020, month: 1, day: 1}),
          from: moment($routeParams.from),
          to: moment($routeParams.to),
          invalid: false
        };

        if (!vm.dates.from.isValid() || !vm.dates.to.isValid() || vm.dates.to.isBefore(vm.dates.from) || vm.dates.to.isSame(vm.dates.from, 'day')) {
          vm.dates.from = moment().subtract({month: 1}).startOf('month');
          vm.dates.to = moment().subtract({month: 1}).endOf('month');
        }

        $rootScope.title = 'Statisztikák - Áttekintés - ' + vm.dates.from.format('YYYY. MM. DD.') + ' - ' + vm.dates.to.format('YYYY. MM. DD.');

        vm.dates.from = vm.dates.from.toDate();
        vm.dates.to = vm.dates.to.toDate();

        vm.adminMode = userInfo.roles.indexOf('admin') > -1;

        vm.coach = {
          name: vm.adminMode && $routeParams.coach ? $routeParams.coach : userInfo.name
        };

        vm.coaches = coaches;

        vm.coachNames = [];
        if (vm.coaches && vm.coaches.length) {
          vm.coaches.forEach(function (coach) { vm.coachNames.push(coach.name); });
        }

        vm.statsIsOpen = true;
        vm.attendeesStatsIsOpen = true;
        vm.subscriptionsStatsIsOpen = true;
        vm.passiveClientsStatsIsOpen = true;
        vm.newClientsStatsIsOpen = true;

        vm.stats = stats;

        vm.stats.series.forEach(function (instance) {
          instance.date = moment().isoWeekday(instance.day).hour(instance.hour).minute(0);
        });

        vm.stats.sumIncome = vm.stats.allSubscriptions;

        for (var instance in vm.stats.guestCredits) {
            vm.stats.sumIncome += vm.stats.guestCredits[instance].sum;
        }

        vm.updateDatesValidity = function () {
            vm.dates.invalid = (vm.dates.from > vm.dates.to);
        };

        $scope.$watch('vm.dates.from', vm.updateDatesValidity);
        $scope.$watch('vm.dates.to', vm.updateDatesValidity);

        vm.setLastMonth = function() {

          vm.dates.from = moment().subtract({month: 1}).startOf('month').toDate();
          vm.dates.to = moment().subtract({month: 1}).endOf('month').toDate();
        };

        vm.setCurrentMonth = function() {

          vm.dates.from = moment().startOf('month').toDate();
          vm.dates.to = moment().endOf('month').toDate();
        };

        vm.show = function(form) {

          if (!form || !form.$valid || vm.dates.invalid) {
            return;
          }

          $location.path('/statisztikak/attekintes/' + (vm.adminMode ? (vm.coach.name + '/') : '') + moment(vm.dates.from).format('YYYY-MM-DD') + '/' + moment(vm.dates.to).format('YYYY-MM-DD'));
        };

        vm.exportSubscriptions = function() {
          var results = [];

          vm.stats.subscriptions.forEach(function (subscription) {
            results.push({
              'Név': subscription.name,
              'Vásárlás időpontja': $filter('date')(subscription.date * 1000),
              'Érvényesség': subscription.period,
              'Eladási ár': subscription.firstTime ? 0 : multipliers.getSum(periods.parseUnixInterval(subscription.expiry - subscription.date), subscription.amount),
              'Első alkalom?': subscription.firstTime ? 'igen': 'nem'
            });
          });

          return results;
        };
    }

})();