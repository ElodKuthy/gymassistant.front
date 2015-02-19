(function () {

    'use strict';

    angular
        .module('gymassistant.front.series')
        .controller('DetailsController', DetailsController);

    /* @ngInject */
    function DetailsController($rootScope, $scope, userInfo, training, seriesService, infoService, errorService, coaches) {

        var vm = this;
        vm.training = training ? training : { date : { day: 1, hour: 0 } } ;
        vm.isNewTraining = (training == null);
        vm.coaches = [];

        vm.days = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap'];
        vm.hours = ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];

        vm.refresh = {
            from: new Date(),
            to: new Date(),
            min: new Date(2014),
            max: new Date(2020),
            invalid: false
        }

        $rootScope.title = training ? 'Edzés sablon - ' + vm.training.name + ' ' + vm.days[training.date.day - 1] + ' ' + vm.hours[training.date.hour] : 'Új edzés sablon';

        vm.selectedDay = function (value) {
            if (value && vm.days.indexOf(value) > -1) {
                vm.training.date.day = vm.days.indexOf(value) + 1;
            }

            return vm.days[vm.training.date.day - 1];
        }

        vm.selectedHour = function (value) {
            if (value && vm.hours.indexOf(value) > -1) {
                vm.training.date.hour = vm.hours.indexOf(value);
            }

            return vm.hours[vm.training.date.hour];
        }

        coaches.forEach(function (coach) {
            vm.coaches.push(coach.name);
        });


        vm.submit = function (form) {

            if (!form || form.$invalid) {
                return;
            }

            if (vm.isNewTraining) {
                seriesService.add(vm.training)
                    .then(
                        function () {
                            infoService.modal('Edzés létrehozása', 'Az edzést sikeresen létrehoztad');
                        },
                        function (err) {
                            errorService.modal(err);
                        });
            } else {
                seriesService.update(vm.training)
                    .then(
                        function () {
                            infoService.modal('Edzés módosítása', 'Az edzést sikeresen módosítottad');
                        },
                        function (err) {
                            errorService.modal(err);
                        });
            }
        };

        vm.update = function () {
            vm.refresh.invalid = (vm.refresh.from > vm.refresh.to);
        };

        $scope.$watch('vm.refresh.from', vm.update);
        $scope.$watch('vm.refresh.to', vm.update);
    }
})();