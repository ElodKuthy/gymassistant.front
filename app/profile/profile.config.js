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
                controllerAs: "vm",
                controller: "ProfileController",
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
                    allUsers: function ($q, storageHelper, scheduleService) {
                        var user = storageHelper.getUserInfo();
                        if (user && user.roles.indexOf('coach') > -1) {
                            return scheduleService.getUsers();
                        }
                        else {
                            return $q.when(null);
                        }
                    },
                    /* @ngInject */
                    credits: function (profileService) {
                        return profileService.getCredits();
                    }
                }
            })
            .when("/profil/:clientName", {
                templateUrl: "profile/client_profile.html",
                controllerAs: "vm",
                controller: "ProfileController",
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
                    },
                    /* @ngInject */
                    credits: function ($route, coachService) {
                        return coachService.getCredits($route.current.params.clientName);
                    }
                }
            });
    }

})();