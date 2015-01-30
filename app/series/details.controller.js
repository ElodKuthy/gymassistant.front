(function () {

    'use strict';

    angular
        .module('gymassistant.front.series')
        .controller('DetailsController', DetailsController);

    /* @ngInject */
    function DetailsController(userInfo, training, seriesService, infoService, errorService) {

        var vm = this;
        vm.training = training;

        vm.changeName = function (form) {

            if (!form || form.$invalid)
                return;

            seriesService.updateInstance(vm.training)
                .then(
                    function () {
                        infoService.modal('Edzés módosítása', 'Az edzés nevét sikeresen megváltoztattad');
                    },
                    function (err) {
                        errorService.modal(err);
                    });
        };

        vm.changeCoach = function (form) {

            if (!form || form.$invalid)
                return;

            seriesService.updateInstance(vm.training)
                .then(
                    function () {
                        infoService.modal('Edzés módosítása', 'Az edzéstartót személyét sikeresen megváltoztattad');
                    },
                    function (err) {
                        errorService.modal(err);
                    });
        };

        vm.changeMax = function (form) {

            if(!form || form.$invalid)
                return;

            seriesService.updateInstance(vm.training)
                .then(
                    function () {
                        infoService.modal('Edzés módosítása', 'Az edzés maximális létszámát sikeresen megváltoztattad');
                    },
                    function (err) {
                        errorService.modal(err);
                    });
        };
    }
})();