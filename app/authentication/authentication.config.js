(function() {

    'use strict';

    angular.module('gymassistant.front.authentication')
        .config(LoginConfig);

    /* @ngInject */
    function LoginConfig ($routeProvider)
    {
        $routeProvider.when('/belepes', {
            templateUrl: 'authentication/login.html',
            controller: 'LoginController',
            controllerAs: 'vm',
            resolve: {
                /* @ngInject */
                userInfo: function (locationHelper) {
                    return locationHelper.onlyNotAuthenticated();
                }
            }
        })
        .when('/elfelejtett/jelszo', {
            templateUrl: 'authentication/forgotten_password.html',
            controller: 'ForgottenPasswordController',
            controllerAs: 'vm',
            resolve: {
                /* @ngInject */
                userInfo: function (locationHelper) {
                    return locationHelper.onlyNotAuthenticated();
                }
            }
        })
        .when('/jelszo/csere/:name/:token', {
            templateUrl: 'authentication/reset_password.html',
            controller: 'ResetPasswordController',
            controllerAs: 'vm',
            resolve: {
                /* @ngInject */
                userInfo: function (locationHelper) {
                    return locationHelper.onlyNotAuthenticated();
                }
            }
        });
    }
})();