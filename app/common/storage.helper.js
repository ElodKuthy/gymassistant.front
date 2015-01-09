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
                if (authorization) {
                    $window.sessionStorage.authorization = authorization;
                }
            }

            return authorization;
        }

        function setAuth(authorization, remember) {

            if (authorization) {
                $window.sessionStorage.authorization = authorization;
                if (remember) {
                    ipCookie(authorizationCookieKey, authorization, { expires: 1000 });
                }
            } else {
                $window.sessionStorage.removeItem('authorization');
                ipCookie.remove(authorizationCookieKey);
            }
        }

        function getUserInfo() {
            var userInfo = $window.sessionStorage.userInfo;
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
            if (userInfo) {
                $window.sessionStorage.userInfo = JSON.stringify(userInfo);
                if (remember) {
                    ipCookie(userInfoCookieKey, JSON.stringify(userInfo), { expires: 1000 });
                }
            } else {
                $window.sessionStorage.removeItem('userInfo');
                ipCookie.remove(userInfoCookieKey);
            }
        }
    }
})();