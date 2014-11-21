(function (){

    "use strict";

    angular.module("gymassistant.front.common")
        .factory("storageHelper", StorageHelper);

    /* @ngInject */
    function StorageHelper($window, $cookieStore) {

        var authorizationCookieKey = "authorization";

        return {
            getAuth: getAuth,
            setAuth: setAuth
        };

        function  getAuth() {
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
    }
})();