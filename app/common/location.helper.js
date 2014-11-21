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
            onlyCoach: onlyCoach
        };

        function onlyCoach() {
            var deferred = $q.defer();
            authenticationService.getUserInfo().then(
                function(userInfo) {
                    if (!userInfo || userInfo.roles.indexOf("coach") === -1) {
                        deferred.reject("Ezt a nézetet csak edzők érhetik el");
                        back();
                    }

                    deferred.resolve(userInfo);
                },
                function(error) {
                    back();
            });


            return deferred.promise;
        }

        function onlyAuthenticated() {
            var deferred = $q.defer();
            authenticationService.getUserInfo().then(function(userInfo){
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
            authenticationService.getUserInfo().then(function(userInfo){
                if (userInfo) {
                    deferred.reject("Már be van lépve");
                    back();
                }

                deferred.resolve({});
            });

            return deferred.promise;
        }

        function back() {
            if ($window.history.length > 1) {
                $window.history.back();
            } else {
                $location.path("/");
            }
        }
    }

})();
