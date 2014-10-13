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
            templateUrl: 'login/login.html',
            controllerAs: 'vm',
            controller: 'LoginCtrl'
        });
    }

    LoginController.$inject = ['authenticationService'];

    function LoginController (authenticationService) {
        var vm = this;

        vm.userInfo = null;
        vm.login = login;
        vm.cancel = cancel;

        function login() {
            authenticationService.login(vm.userName, vm.password)
                .then(function (result) {
                    vm.userInfo = result;
                }, function (error) {
                    vm.errorMessage = 'Hiba';
                });
        }

        function cancel() {
            vm.userName = "";
            vm.password = "";
        }
    }

    AuthenticationService.$inject = ['$http', '$q', '$window'];

    function AuthenticationService($http, $q, $window) {

        var userInfo;

        function login(userName, password) {
            var deferred = $q.defer();
            /*var authorization = 'Basic ' + window.btoa(userName + ':' + password);

            $http.get('/api/login', {
                headers: { 'Authorization': authorization }
            }).
                then(function (result) {
                    userInfo = {
                        authorization: authorization,
                        userName: result.data.userName
                    };
                    $window.sessionStorage['userInfo'] = JSON.stringify(userInfo);
                    deferred.resolve(userInfo);
                }, function (error) {
                    deferred.reject(error);
                });*/

            userInfo = {
                userName: userName,
                password: password
            };
            $window.sessionStorage['userInfo'] = JSON.stringify(userInfo);

            deferred.resolve(userInfo);

            return deferred.promise;
        }

        function logout() {
            var deferred = $q.defer();

            /*$http({
             method: 'POST',
             url: '/api/logout',
             headers: {
             'access_token': userInfo.accessToken
             }
             }).then(function (result) {*/
            userInfo = null;
            $window.sessionStorage['userInfo'] = null;
            deferred.resolve('');
            /*}, function (error) {
             deferred.reject(error);
             });*/

            return deferred.promise;
        }

        function getUserInfo() {
            return userInfo;
        }

        function isLoggedIn() {
            return userInfo ? true : false;
        }

        function init() {
            if ($window.sessionStorage['userInfo']) {
                userInfo = JSON.parse($window.sessionStorage['userInfo']);
            }
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