(function() {

    "use strict";

    angular.module("gymassistant.front.common")
        .factory("locationHelper", LocationHelper);

    /* @ngInject */
    function LocationHelper($q, $window, $location, authenticationService) {

        return  {
            back: back,
            onlyAuthenticated: onlyAuthenticated,
            onlyNotAuthenticated: onlyNotAuthenticated,
            onlyCoach: onlyCoach,
            onlyAdmin: onlyAdmin
        };

        function onlyCoach() {
            var deferred = $q.defer();

            authenticationService.getUserInfo().then(function (userInfo) {

                if (!userInfo || userInfo.roles.indexOf("coach") === -1) {
                    deferred.reject("Ezt a nézetet csak edzők érhetik el");
                    back();
                }

                deferred.resolve(userInfo);
            });

            return deferred.promise;
        }

        function onlyAdmin() {
            var deferred = $q.defer();

            authenticationService.getUserInfo().then(function (userInfo) {

                if (!userInfo || userInfo.roles.indexOf("admin") === -1) {
                    deferred.reject("Ezt a nézetet csak adminisztrátorok érhetik el");
                    back();
                }

                deferred.resolve(userInfo);

            });

            return deferred.promise;
        }

        function onlyAuthenticated() {
            var deferred = $q.defer();

            authenticationService.getUserInfo().then(function (userInfo) {

                if (!userInfo) {
                    deferred.reject("Ezt a nézetet csak belépett felhsználók érhetik el");
                    back();
                }

                deferred.resolve(userInfo);
            });

            return deferred.promise;
        }

        function onlyNotAuthenticated() {
            var deferred = $q.defer();

            authenticationService.getUserInfo().then(function (userInfo) {

                if (userInfo) {
                    deferred.reject("Már be van lépve");
                    back();
                }

                deferred.resolve({});

            });

            return deferred.promise;
        }

        function back() {
                $location.path("/");
        }
    }

})();
