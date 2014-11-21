(function () {

    "use strict";

    angular
        .module("gymassistant.front.authentication")
        .factory("authenticationService", AuthenticationService);

    /* @ngInject */
    function AuthenticationService($q, $window, $cookieStore, httpService, eventHelper, storageHelper) {

        return {
            login: login,
            logout: logout,
            getUserInfo: getUserInfo,
            changePassword: changePassword
        };


        function getUserInfo() {
            var deferred = $q.defer();

            httpService.get("/api/user").then(
                function (result) {
                    deferred.resolve(result.userInfo);
                },
                function (error) {
                    deferred.resolve(null);
                });

            return deferred.promise;
        }

        function login(userName, password, remember) {

            var deferred = $q.defer();
            var authorization = "Basic " + window.btoa(userName + ":" + password);

            httpService.get("/api/login", null, authorization).then(
                function (result) {
                    if (result.userInfo && !result.error) {
                        storageHelper.setAuth(authorization, remember);
                        deferred.resolve(result.userInfo);
                        eventHelper.broadcast.authenticationChanged();
                    } else {
                        deferred.reject(result.error);
                    }
                },
                function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        function logout() {
            var deferred = $q.defer();

            storageHelper.setAuth(null);
            eventHelper.broadcast.authenticationChanged();
            deferred.resolve({});

            return deferred.promise;
        }

        function changePassword(newPassword) {
            return httpService.post("/api/change/password", { password: newPassword });
        }
    }
})();