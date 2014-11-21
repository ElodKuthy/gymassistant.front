(function() {

    "use strict";

    angular.module("gymassistant.front.authentication")
        .config(LoginConfig);

    /* @ngInject */
    function LoginConfig ($routeProvider)
    {
        $routeProvider.when("/belepes", {
            templateUrl: "authentication/login.html",
            controller: "Login",
            controllerAs: "login",
            resolve: {
                /* @ngInject */
                userInfo: function (locationHelper) {
                    return locationHelper.onlyNotAuthenticated();
                }
            }
        });
    }
})();