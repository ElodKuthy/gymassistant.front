'use strict';

(function () {

    angular
        .module('gymassistant.front.authentication', [])
        .factory('authenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$q', '$window'];

    function AuthenticationService($http, $q, $window) {

        var authorization;
        var authenticated;

        function login(userName, password) {
            authorization = 'Basic ' + window.btoa(userName + ':' + password);

            return authorize();
        }

        function authorize() {
            authenticated = $q.defer();

            if (authorization) {

                $http.get('/api/login', {
                    headers: {'Authorization': authorization}
                }).then(success, error);
            } else {
                authenticated.reject();
            }


            function success(result) {

                if (result.data.userInfo) {
                    $window.sessionStorage['authorization'] = authorization;
                    authenticated.resolve(result.data.userInfo);
                } else {
                    authenticated.reject(result.data.error);
                }
            }

            function error(error) {
                authenticated.reject(error);
            }

            return authenticated.promise;
        }

        function logout() {
            authorization = null;
            $window.sessionStorage['authorization'] = null;
            authenticated = $q.defer();
            authenticated.reject();
        }

        function getUserInfo() {
            var getUserInfoDeferred = $q.defer();

            authenticated.promise.then(success, error);

            function success(userInfo) {
                getUserInfoDeferred.resolve(userInfo);
            }

            function error() {
                getUserInfoDeferred.resolve(null);
            }

            return getUserInfoDeferred.promise;
        }

        function init() {
            authorization = $window.sessionStorage['authorization'];
            authorize();
        }

        init();

        return {
            login: login,
            logout: logout,
            getUserInfo: getUserInfo
        };
    }
})();