(function () {

    'use strict';

    angular
        .module('gymassistant.front.authentication')
        .controller('ForgottenPasswordController', ForgottenPasswordController);

    /* @ngInject */
    function ForgottenPasswordController($modal, $rootScope, $q, locationHelper, authenticationService, loadingService, infoService) {

        var vm = this;

        $rootScope.title = 'Elfelejtett jelszó';

        vm.userName = '';
        vm.email = '';
        vm.error = '';

        vm.submit = function(form) {

            vm.error = '';
            form.$setPristine();

            if (!form || form.$invalid) {
                return;
            }

            loadingService.startLoading();

            authenticationService.forgottenPassword(vm.userName, vm.email)
                .then(function () {
                    loadingService.endLoading();
                    return infoService.modal('Elfelejtett jelszó', 'Amennyiben a megadott adatok helyesek, hamarosan kapsz egy e-mailt, kövesd az abban leírtakat az új jelszó megadásához!');
                })
                .then(function () {
                    locationHelper.back();
                })
                .catch(function (error) {
                    loadingService.endLoading();
                    vm.error = error.message ? error.message : error;
                });
        };
    }

})();