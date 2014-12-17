(function () {

    'use strict';

    angular
        .module("gymassistant.front.profile")
        .config(ProfileConfig);

    /* @ngInject */
    function ProfileConfig($routeProvider) {
        $routeProvider
            .when("/profilom", {
                templateUrl: "profile/my_profile.html",
                controllerAs: "profile",
                controller: "Profile",
                resolve: {
                    /* @ngInject */
                    userInfo: function (locationHelper) {
                        return locationHelper.onlyAuthenticated();
                    },
                    /* @ngInject */
                    client: function ($q) {
                        return $q.when(null);
                    },
                    /* @ngInject */
                    allUsers: function (scheduleService) {
                        return $q.when(null);
                    }
                }
            })
            .when("/profil/:clientName", {
                templateUrl: "profile/client_profile.html",
                controllerAs: "profile",
                controller: "Profile",
                resolve: {
                    /* @ngInject */
                    userInfo: function (locationHelper) {
                        return locationHelper.onlyCoach();
                    },
                    /* @ngInject */
                    allUsers: function (scheduleService) {
                        return scheduleService.getUsers();
                    },
                    /* @ngInject */
                    client: function ($q, $route, coachService, locationHelper) {
                        var deferred = $q.defer();
                        coachService.getUserInfo($route.current.params.clientName).then(resolve, error);

                        function resolve (result) {
                            deferred.resolve(result);
                        }

                        function error (err) {
                            locationHelper.back();
                        }

                        return deferred.promise;
                    }
                }
            });
    }

})();