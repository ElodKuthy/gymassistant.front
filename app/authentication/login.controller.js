(function () {

    'use strict';

    angular
        .module('gymassistant.front.authentication')
        .controller('LoginController', LoginController);

    /* @ngInject */
    function LoginController($rootScope, locationHelper, authenticationService) {

        var vm = this;

        vm.submit = submit;
        vm.remember = false;

        $rootScope.title = 'Belépés';

        function clear() {
            vm.password = '';
            vm.error = '';
        }

        function submit() {
            authenticationService.login(vm.userName, vm.password, vm.remember).then(
                function() {
                    clear();
                    locationHelper.back();
                },
                function (error) {
                    clear();
                    vm.error = error;
            });

        }
    }

})();