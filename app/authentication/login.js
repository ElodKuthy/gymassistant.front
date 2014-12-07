(function () {

    "use strict";

    angular
        .module("gymassistant.front.authentication")
        .controller("Login", Login);

    /* @ngInject */
    function Login(locationHelper, authenticationService) {

        var login = this;

        login.submit = submit;
        login.remember = false;

        function clear() {
            login.password = "";
            login.error = "";
        }

        function submit() {
            authenticationService.login(login.userName, login.password, login.remember).then(
                function() {
                    clear();
                    locationHelper.back();
                },
                function (error) {
                    clear();
                    login.error = error.message;
            });

        }
    }

})();