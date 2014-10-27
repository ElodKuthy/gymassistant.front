'use strict';

(function () {

    angular
        .module('gymassistant.front.login', ['ngRoute'])
        .config(LoginConfig)
        .controller('LoginCtrl', LoginController)
        .factory('authenticationService', AuthenticationService);

    LoginConfig.$inject = ['$routeProvider'];

    function LoginConfig ($routeProvider)
    {
        $routeProvider.when('/login', {
            templateUrl: 'login/login.html'
        });
    }

    LoginController.$inject = ['$location', '$route', 'authenticationService'];

    function LoginController ($location, $route, authenticationService) {
        var vm = this;

        authenticationService.getUserInfo().then(function (result) {
            vm.userInfo = result;
        });

        vm.login = login;
        vm.logout = logout;

        vm.doLogin = doLogin;
        vm.cancel = cancel;

        function doLogin() {
            authenticationService.login(vm.userName, vm.password)
                .then(function (result) {
                    vm.password = "";
                    vm.userInfo = result;
                    $location.path(vm.beforeLogin);
                }, function (error) {
                    vm.errorMessage = error;
                });
        }

        function cancel() {
            vm.userName = "";
            vm.password = "";
        }

        function login() {
            vm.beforeLogin = $location.path();
            $location.path('/login');
        }

        function logout() {
            authenticationService.logout().then(function(){
                vm.userInfo = null;
                $route.reload();
            });
        }
    }

    AuthenticationService.$inject = ['$http', '$q', '$window'];

    function AuthenticationService($http, $q, $window) {

        var userInfo;
        var initialized = false;

        function login(userName, password) {
            var authorization = 'Basic ' + window.btoa(userName + ':' + password);

            return authorize(authorization);
        }

        function authorize(authorization) {
            var deferred = $q.defer();

            $http.get('/api/login', {
                headers: { 'Authorization': authorization }
            }).then(success, error);

            function success(result) {
                userInfo = {
                    userName: result.data.userName
                };

                $window.sessionStorage['authorization'] = authorization;
                deferred.resolve(userInfo);
            }

            function error(result) {
                deferred.reject(result);
            }

            return deferred.promise;
        }

        function logout() {
            var deferred = $q.defer();

            userInfo = {};
            $window.sessionStorage['authorization'] = null;
            deferred.resolve('');

            return deferred.promise;
        }

        function getUserInfo() {

            return authorize($window.sessionStorage['authorization']);
         }

        function isLoggedIn() {
            return userInfo ? true : false;
        }

        function init() {
            var deferred = $q.defer();

            if (!initialized && $window.sessionStorage['authorization']) {
                initialized = true;
                authorize($window.sessionStorage['authorization']).then(function() {
                    deferred.resolve(userInfo);
                });
            } else {
                deferred.resolve(userInfo);
            }

            return deferred.promise;
        }

        init();

        return {
            login: login,
            logout: logout,
            isLoggedIn: isLoggedIn,
            getUserInfo: getUserInfo
        };
    }
})();