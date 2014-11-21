(function () {

    "use strict";

    angular.module("gymassistant.front.profile")
        .controller("Profile", Profile);

    /* @ngInject */
    function Profile($modal, authenticationService, eventHelper, userInfo, locationHelper) {

        var profile = this;

        profile.name = "";
        profile.email = "";
        profile.newPassword = "";
        profile.newPasswordAgain = "";
        profile.passwordChangeError = "";
        profile.changePassword = changePassword;

        fillProfile(userInfo);

        eventHelper.subscribe.authenticationChanged(checkAuthentication);

        function checkAuthentication() {
            locationHelper.onlyAuthenticated().then(fillProfile);
        }

        function fillProfile(userInfo) {
            if (userInfo) {
                profile.name = userInfo.userName;
                profile.email = userInfo.email;
                profile.role = userInfo.roles.indexOf("coach") === -1 ? "Tanítvány" : "Edző";
                profile.changePassword = changePassword;
            }
        }

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
                function () {

                    authenticationService.login(profile.name, profile.newPassword).then(
                        function () {
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
                        function () {
                            authenticationService.logout();
                        });
                },
                function (error) {
                    profile.passwordChangeError = error;
                });
        }
    }
})();