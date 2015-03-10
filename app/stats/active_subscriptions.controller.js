(function () {

    'use strict';

    angular
        .module('gymassistant.front.stats')
        .controller('ActiveSubscriptionsController', ActiveSubscriptionsController);

    /* @ngInject */
    function ActiveSubscriptionsController($rootScope, $scope, $location, $routeParams, userInfo, coaches, subscriptions) {

        var vm = this;

        $rootScope.title = 'Aktív bérletek' + $routeParams.from && $routeParams.to ? ' - ' + $routeParams.from + '-tól ' + $routeParams.to + '-ig' : '';

        vm.dates = {
            from: $routeParams.from ? moment($routeParams.from).toDate() : moment().startOf('month').toDate(),
            to: $routeParams.to ? moment($routeParams.to).toDate() : moment().endOf('month').toDate(),
            min: new Date(2014),
            max: new Date(2020),
            opened: !($routeParams.from && $routeParams.to),
            invalid: false
        }

        vm.updateDatesValidity = function () {
            vm.dates.invalid = (vm.dates.from > vm.dates.to);
        };

        $scope.$watch('vm.dates.from', vm.updateDatesValidity);
        $scope.$watch('vm.dates.to', vm.updateDatesValidity);

        vm.status = {
            open: true
        };


        vm.calculate = function() {
            vm.distinct = 0;
            vm.all = 0;

            if (!vm.coaches || !vm.subscriptions) {
                return;
            }

            var countedClients = {};

            vm.coaches.forEach(function(coach) {
                if (coach.selected) {
                    vm.subscriptions[coach.name].subscriptions.forEach(function (credit) {
                        if (!countedClients[credit.client]) {
                            countedClients[credit.client] = true;
                            vm.distinct++;
                        }
                        vm.all++;
                    });
                }
            });
        }

        if (subscriptions) {
            vm.coaches = [];

            coaches.forEach(function (coach) {
                if (subscriptions[coach.name]) {
                    vm.coaches.push({ name: coach.name, selected: true});
                }
            })

            vm.subscriptions = subscriptions;

            vm.calculate();
        }

        vm.show = function(form) {

            if (!form || !form.$valid || vm.dates.invalid) {
                return;
            }

            $location.path('/statisztikak/aktiv/berletek/' + moment(vm.dates.from).format('YYYY-MM-DD') + '/' + moment(vm.dates.to).format('YYYY-MM-DD'));
        }

    }
})();