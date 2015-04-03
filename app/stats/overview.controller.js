(function () {

    'use strict';

    angular
        .module('gymassistant.front.stats')
        .controller('OverviewController', OverviewController);

    /* @ngInject */
    function OverviewController($rootScope, $scope, $location, $routeParams, userInfo, coaches) {

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
          vm.dates.from = moment().startOf('month').subtract({month: 1});
          vm.dates.to = moment().endOf('month').subtract({month: 1});
        }

        $rootScope.title = 'Statisztikák - Áttekintés - ' + vm.dates.from.format('YYYY. MM. DD.') + ' - ' + vm.dates.to.format('YYYY. MM. DD.');

        vm.dates.from = vm.dates.from.toDate();
        vm.dates.to = vm.dates.to.toDate();

        vm.adminMode = userInfo.roles.indexOf('admin') > -1;

        vm.coach = vm.adminMode && $routeParams.coach ? $routeParams.coach : userInfo.name;

        vm.coaches = coaches;

        vm.coachNames = [];
        vm.coaches.forEach(function (coach) { vm.coachNames.push(coach.name) });

        vm.updateDatesValidity = function () {
            vm.dates.invalid = (vm.dates.from > vm.dates.to);
        };

        $scope.$watch('vm.dates.from', vm.updateDatesValidity);
        $scope.$watch('vm.dates.to', vm.updateDatesValidity);

        vm.setLastMonth = function() {

          vm.dates.from = moment().startOf('month').subtract({month: 1}).toDate();
          vm.dates.to = moment().endOf('month').subtract({month: 1}).toDate();
        }

        vm.setCurrentMonth = function() {

          vm.dates.from = moment().startOf('month').toDate();
          vm.dates.to = moment().endOf('month').toDate();
        }

        vm.show = function(form) {

          if (!form || !form.$valid || vm.dates.invalid) {
            return;
          }

          $location.path('/statisztikak/attekintes/' + (vm.adminMode ? (vm.coach + '/') : '') + moment(vm.dates.from).format('YYYY-MM-DD') + '/' + moment(vm.dates.to).format('YYYY-MM-DD'));
        }
    }

})();