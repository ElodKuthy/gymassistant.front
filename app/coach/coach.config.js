(function (){

    'use strict';

    angular
        .module('gymassistant.front.coach')
        .config(CoachConfig);

    /* @ngInject */
    function CoachConfig($routeProvider) {
        $routeProvider
        .when('/uj/felhasznalo', {
            templateUrl: 'coach/new_user.html',
            controllerAs: 'vm',
            controller: 'NewUserController',
            resolve: {
                /* @ngInject */
                userInfo: function (locationHelper) {
                    return locationHelper.onlyCoach();
                }
            }
        })
        .when('/berlet/vasarlas', {
            templateUrl: 'coach/add_credit.html',
            controllerAs: 'vm',
            controller: 'AddCreditController',
            resolve: {
                /* @ngInject */
                userInfo: function (locationHelper) {
                    return locationHelper.onlyCoach();
                },
                /* @ngInject */
                clientName: function ($route, $q) {
                    return $q.when($route.current.params.tanitvany);
                },
                /* @ngInject */
                allUsers: function (scheduleService) {
                    return scheduleService.getUsers();
                },
                /* @ngInject */
                series: function (coachService) {
                    return coachService.getSeries();
                }
            }
        });
    }
})();
