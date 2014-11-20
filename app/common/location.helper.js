(function() {

    "use strict";

    angular.module("gymassistant.front.common")
        .factory("locationHelper", LocationHelper);

    /* @ngInject */
    function LocationHelper($window, $location) {

        return  {
            back: back,
            onlyAuthenticated: onlyAuthenticated,
            onlyNotAuthenticated: onlyNotAuthenticated
        };

        function onlyAuthenticated(userInfo) {
            if (!userInfo) {
                back();
            }
        }

        function onlyNotAuthenticated(userInfo) {
            if (userInfo) {
                back();
            }
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
