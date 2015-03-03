(function () {

    'use strict';

    angular
        .module('gymassistant.front.authentication')
        .controller('ResetPasswordController', ResetPasswordController);

    /* @ngInject */
    function ResetPasswordController($scope, $modal, $rootScope, $q, $routeParams, locationHelper, authenticationService, loadingService, infoService) {

        var vm = this;

        $rootScope.title = 'Elfelejtett jelszó';

        vm.userName = $routeParams.name;
        vm.token = $routeParams.token;
        vm.password = '';
        vm.passwordAgain = '';
        vm.error = '';

        function checkPasswords() {
            vm.password && vm.passwordAgain && vm.password != vm.passwordAgain ? vm.error = 'A két jelszónak meg kell egyeznie!' : vm.error = '';
        }

        $scope.$watch('vm.password', checkPasswords);
        $scope.$watch('vm.passwordAgain', checkPasswords);

        vm.submit = function(form) {

            vm.error = '';
            form.$setPristine();

            if (!form || form.$invalid) {
                return;
            }

            loadingService.startLoading();

            authenticationService.changePassword(vm.userName, vm.email, vm.token, vm.password)
                .then(function () {
                    return infoService.modal('Jelszó csere', 'Sikeresen megváltoztattad a jelszavadat');
                })
                .then(function () {
                    locationHelper.back();
                })
                .catch(function (error) {
                    vm.error = error.message ? error.message : error;
                })
                .finally(loadingService.endLoading);
        };
    }

})();