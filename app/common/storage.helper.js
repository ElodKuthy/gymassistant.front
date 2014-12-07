(function (){

    "use strict";

    angular.module("gymassistant.front.common")
        .factory("storageHelper", StorageHelper);

    /* @ngInject */
    function StorageHelper($window, $cookieStore) {

        var authorizationCookieKey = "authorization";
        var userInfoCookieKey = "userInfo";

        return {
            getAuth: getAuth,
            setAuth: setAuth,
            getUserInfo: getUserInfo,
            setUserInfo: setUserInfo
        };

        function getAuth() {
            var authorization = $window.sessionStorage.authorization;
            if (!authorization) {
                authorization = $cookieStore.get(authorizationCookieKey);
                $window.sessionStorage.authorization = authorization;
            }

            return authorization;
        }

        function setAuth(authorization, remember) {
            $window.sessionStorage.authorization = authorization;
            if (!authorization) {
                $cookieStore.remove(authorizationCookieKey);
            } else if (remember) {
                $cookieStore.put(authorizationCookieKey, authorization);
            }
        }

        function getUserInfo() {
            var userInfo = window.sessionStorage.userInfo;
            if (!userInfo) {
                userInfo = $cookieStore.get(userInfoCookieKey);
                if (userInfo) {
                    $window.sessionStorage.userInfo = userInfo;
                }
            }

            return userInfo ? JSON.parse(userInfo) : null;
        }

        function setUserInfo(userInfo, remember) {
            $window.sessionStorage.userInfo = JSON.stringify(userInfo);
            if (!userInfo) {
                $cookieStore.remove(userInfoCookieKey);
            } else if (remember) {
                $cookieStore.put(userInfoCookieKey, JSON.stringify(userInfo));
            }
        }
    }
})();