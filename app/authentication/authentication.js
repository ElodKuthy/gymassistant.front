(function () {

    "use strict";

    angular
        .module("gymassistant.front.authentication", [])
        .factory("authenticationService", AuthenticationService);

    AuthenticationService.$inject = ["$q", "$window", "httpService"];

    function AuthenticationService($q, $window, httpService) {

        var authorization;
        var authenticated;

        function login(userName, password) {
            authorization = "Basic " + window.btoa(userName + ":" + password);

            return authorize();
        }

        function authorize() {
            authenticated = $q.defer();

            if (authorization) {

                httpService.get("/api/login", authorization)
                    .then(
                    function (result) {

                        if (result.userInfo && !result.error) {
                            $window.sessionStorage["authorization"] = authorization;
                            authenticated.resolve(result.userInfo);
                        } else {
                            authenticated.reject(result.error);
                        }
                    },
                    function (error) {
                        authenticated.reject(error);
                    });
            } else {
                authenticated.reject();
            }

            return authenticated.promise;
        }

        function logout() {
            authorization = null;
            $window.sessionStorage["authorization"] = null;
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
            authorization = $window.sessionStorage["authorization"];
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