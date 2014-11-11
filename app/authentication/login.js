'use strict';

(function () {

    angular
        .module('gymassistant.front.authentication')
        .config(LoginConfig)
        .controller('LoginCtrl', LoginController);

    LoginConfig.$inject = ['$routeProvider'];

    function LoginConfig ($routeProvider)
    {
        $routeProvider.when('/belepes', {
            templateUrl: 'authentication/login.html',
            controller: 'LoginCtrl',
            controllerAs: 'vm'
        });
    }

    LoginController.$inject = ['$rootScope', '$window', '$location', 'authenticationService'];

    function LoginController ($rootScope, $window, $location, authenticationService) {

        var vm = this;

        authenticationService.getUserInfo().then(function(userInfo) {
            if (userInfo) {
                $window.history.length > 1 ? $window.history.back() : $location.path('/');
            }

            vm.login = login;
            vm.cancel = cancel;
        });

        function login() {
            authenticationService.login(vm.userName, vm.password)
                .then(success, error);

            function clear() {
                vm.password = "";
                vm.error = "";
            }

            function success() {
                clear();

                $rootScope.$broadcast('authenticationChanged');
                $window.history.length > 1 ? $window.history.back() : $location.path('/');
            }

            function error(error) {
                clear();

                vm.error = error;
            }

        }

        function cancel() {
            vm.userName = "";
            vm.password = "";
        }
    }

})();