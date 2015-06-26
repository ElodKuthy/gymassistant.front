(function () {

    "use strict";

    angular
        .module("gymassistant.front.authentication")
        .factory("authenticationService", AuthenticationService);

    /* @ngInject */
    function AuthenticationService($q, $window, $route, httpService, eventHelper, storageHelper) {

        return {
            login: login,
            logout: logout,
            getUserInfo: getUserInfo,

            forgottenPassword: function (userName, email) {
                return httpService.get('/api/reset/password/user/' + userName + '/email/' + email);
            },

            changePassword: function (userName, email, token, password) {
                return httpService.post('/api/change/password', {
                    userName: userName,
                    email: email,
                    token: token,
                    password: password
                });
            },

            updatePreferences: function (preferences) {
                return httpService.post('/api/my/preferences', {
                        preferences: preferences
                    })
                    .then(function () {
                        return refreshUserInfo();
                    });
            },
        };

        function refreshUserInfo() {
            storageHelper.setUserInfo(null);
            return getUserInfo();
        }

        function getUserInfo() {
            var userInfo = storageHelper.getUserInfo();

            if (!userInfo && storageHelper.getAuth()) {
                return httpService.get("/api/login").then(function (result) {
                    if (!result.error) {
                        storageHelper.setUserInfo(result);
                        userInfo = storageHelper.getUserInfo();
                        return userInfo;
                    }
                });
            }

            return $q.when(userInfo);
        }

        function login(userName, password, remember) {

            var deferred = $q.defer();
            var authorization = "Basic " + window.btoa(encodeURIComponent(escape(userName + ":" + password)));

            httpService.get("/api/login", {
                error: 'Hibás felhasználónév vagy jelszó'
            }, authorization).then(
                function (result) {
                    if (!result.error) {
                        storageHelper.setAuth(authorization, remember);
                        storageHelper.setUserInfo(result);
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

            getUserInfo().then(function (userInfo) {
                if (userInfo) {
                    storageHelper.setAuth(null);
                    storageHelper.setUserInfo(null);
                    eventHelper.broadcast.authenticationChanged();
                    $route.reload();
                }

                deferred.resolve(null);
            });

            return deferred.promise;
        }
    }
})();