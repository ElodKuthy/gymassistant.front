(function (){

    'use strict';

    angular.module('gymassistant.front.common')
        .factory('storageHelper', StorageHelper);

    /* @ngInject */
    function StorageHelper($window, $location, ipCookie, errorService) {

        var authorizationCookieKey = 'authorization';
        var userInfoCookieKey = 'userInfo';

        return {
            getAuth: getAuth,
            setAuth: setAuth,
            getUserInfo: getUserInfo,
            setUserInfo: setUserInfo
        };

        function checkPrivateMode(err) {
            if (err.code === 22) {
                errorService.modal('A Safari privát módban van, így nem tudsz belépni. Válts normál módra, vagy probálkozz más böngészővel!');
                $location.path('/');
            } else {
                throw err;
            }
        }

        function getAuth() {
            try {
                var authorization = $window.sessionStorage.authorization;
                if (!authorization) {
                    authorization = ipCookie(authorizationCookieKey);
                    if (authorization) {
                        $window.sessionStorage.authorization = authorization;
                    }
                }

                return authorization;
            } catch (err) {
                checkPrivateMode(err);
            }
        }

        function setAuth(authorization, remember) {
            try {
                if (authorization) {
                    $window.sessionStorage.authorization = authorization;
                    if (remember) {
                        ipCookie(authorizationCookieKey, authorization, { expires: 1000 });
                    }
                } else {
                    $window.sessionStorage.removeItem('authorization');
                    ipCookie.remove(authorizationCookieKey);
                }
            } catch (err) {
                checkPrivateMode(err);
            }
        }

        function getUserInfo() {
            try {
                var userInfo = $window.sessionStorage.userInfo;
                if (!userInfo) {
                    userInfo = ipCookie(userInfoCookieKey);
                    if (userInfo) {
                        userInfo = JSON.stringify(userInfo);
                        $window.sessionStorage.userInfo = userInfo;
                    }
                }

                return userInfo ? JSON.parse(userInfo) : null;
            } catch (err) {
                checkPrivateMode(err);
            }
        }

        function setUserInfo(userInfo, remember) {
            try {
                if (userInfo) {
                    $window.sessionStorage.userInfo = JSON.stringify(userInfo);
                    if (remember) {
                        ipCookie(userInfoCookieKey, JSON.stringify(userInfo), { expires: 1000 });
                    }
                } else {
                    $window.sessionStorage.removeItem('userInfo');
                    ipCookie.remove(userInfoCookieKey);
                }
            } catch (err) {
                checkPrivateMode(err);
            }
        }
    }
})();