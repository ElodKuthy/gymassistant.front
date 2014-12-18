(function (){

    "use strict";

    angular.module("gymassistant.front.common")
        .factory("storageHelper", StorageHelper);

    /* @ngInject */
    function StorageHelper($window, ipCookie) {

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
                authorization = ipCookie(authorizationCookieKey);
                $window.sessionStorage.authorization = authorization;
            }

            return authorization;
        }

        function setAuth(authorization, remember) {
            $window.sessionStorage.authorization = authorization;
            if (!authorization) {
                ipCookie.remove(authorizationCookieKey);
            } else if (remember) {
                ipCookie(authorizationCookieKey, authorization, { expires: 1000 });
            }
        }

        function getUserInfo() {
            var userInfo = window.sessionStorage.userInfo;
            if (!userInfo) {
                userInfo = ipCookie(userInfoCookieKey);
                if (userInfo) {
                    userInfo = JSON.stringify(userInfo);
                    $window.sessionStorage.userInfo = userInfo;
                }
            }

            return userInfo ? JSON.parse(userInfo) : null;
        }

        function setUserInfo(userInfo, remember) {
            $window.sessionStorage.userInfo = JSON.stringify(userInfo);
            if (!userInfo) {
                ipCookie.remove(userInfoCookieKey);
            } else if (remember) {
                ipCookie(userInfoCookieKey, JSON.stringify(userInfo), { expires: 1000 });
            }
        }
    }
})();