(function () {

    'use strict';

    angular
        .module("gymassistant.front.profile")
        .config(ProfileConfig);

    /* @ngInject */
    function ProfileConfig($routeProvider) {
        $routeProvider
            .when("/profilom", {
                templateUrl: "profile/profile.html",
                controllerAs: "profile",
                controller: "Profile",
                resolve: {
                    /* @ngInject */
                    userInfo: function (locationHelper) {
                        return locationHelper.onlyAuthenticated();
                    }
            }
            });
    }

})();