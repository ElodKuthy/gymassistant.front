(function () {

    "use strict";

    angular.module("gymassistant.front.profile")
        .controller("Profile", Profile);

    /* @ngInject */
    function Profile($rootScope, $window, $modal, authenticationService) {

        var profile = this;

        profile.name = "";
        profile.email = "";
        profile.newPassword = "";
        profile.newPasswordAgain = "";
        profile.passwordChangeError = "";
        profile.changePassword = null;

        checkAuthentication();

        function checkAuthentication() {
            authenticationService.getUserInfo().then(function (userInfo) {
                if (!userInfo) {
                    $window.history.length > 1 ? $window.history.back() : $location.path('/');
                }
            });
        }

        $rootScope.$on("authenticationChanged", checkAuthentication);

        authenticationService.getUserInfo().then(function(userInfo) {
            if (userInfo) {
                profile.name = userInfo.userName;
                profile.email = userInfo.email;
                profile.role = userInfo.roles.indexOf("coach") === -1 ? "Tanítvány" : "Edző";
                profile.changePassword = changePassword;
            }
        });

        function changePassword() {

            profile.passwordChangeError = "";

            if (!profile.newPassword) {
                profile.passwordChangeError = "Az új jelszót kötelező megadni";
                return;
            }

            if (!profile.newPasswordAgain) {
                profile.passwordChangeError = "Az ellenőrző jelszót kötelező megadni";
                return;
            }

            if (profile.newPassword != profile.newPasswordAgain) {
                profile.passwordChangeError = "Az új és ellenőrző jelszó nem egyezik meg";
                return;
            }

            authenticationService.changePassword(profile.newPassword).then(
                function() {

                    authenticationService.logout();
                    authenticationService.login(profile.name, profile.newPassword).then(
                        function() {
                            profile.newPassword = "";
                            profile.newPasswordAgain = "";

                            $modal.open({
                                templateUrl: "modal/info.html",
                                controller: "Info",
                                controllerAs: "info",
                                size: "sm",
                                resolve: {
                                    title: function () {
                                        return "Jelszó változtatás";
                                    },
                                    message: function () {
                                        return "A jelszavát sikeresen megváltoztattuk";
                                    }
                                }
                            });
                        },
                        function() {
                            $rootScope.$broadcast("authenticationChanged");
                        });
                },
                function(error) {
                    profile.passwordChangeError = error;
                });
        }
    }
})();