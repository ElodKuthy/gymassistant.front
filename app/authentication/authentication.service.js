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
            getUserInfo: getUserInfo
        };

        function getUserInfo() {
            return storageHelper.getUserInfo();
        }

        function login(userName, password, remember) {

            var deferred = $q.defer();
            var authorization = "Basic " + window.btoa(encodeURIComponent(escape(userName + ":" + password)));

            httpService.get("/api/login", null, authorization).then(
                function (result) {
                    if (!result.error) {
                        storageHelper.setAuth(authorization, remember);
                        storageHelper.setUserInfo(result, remember);
                        deferred.resolve(result);
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
            storageHelper.setUserInfo(null);
            eventHelper.broadcast.authenticationChanged();
            deferred.resolve(null);

            return deferred.promise;
        }
    }
})();