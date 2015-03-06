(function (){

    'use strict';

    angular
        .module('gymassistant.front.credits')
        .config(CreditsConfig);

    /* @ngInject */
    function CreditsConfig($routeProvider) {
        $routeProvider.when('/berlet/reszletek/:name/:id', {
            templateUrl: 'credits/details.html',
            controllerAs: 'vm',
            controller: 'CreditDetailsController',
            resolve: {
                /* @ngInject */
                userInfo: function (locationHelper) {
                    return locationHelper.onlyCoach();
                },
                /* @ngInject */
                credit: function ($route, creditsService) {
                    return creditsService.getCreditDetails($route.current.params.id, $route.current.params.name);
                }
            }
        }),
        $routeProvider.when('/berlet/reszletek/:id', {
            templateUrl: 'credits/details.html',
            controllerAs: 'vm',
            controller: 'CreditDetailsController',
            resolve: {
                /* @ngInject */
                userInfo: function (locationHelper) {
                    return locationHelper.onlyAuthenticated();
                },
                /* @ngInject */
                credit: function ($route, creditsService) {
                    return creditsService.getCreditDetails($route.current.params.id);
                }
            }
        });
    }
})();
