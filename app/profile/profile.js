(function () {

    'use strict';

    angular.module('gymassistant.front.profile')
        .controller('Profile', Profile);

    /* @ngInject */
    function Profile($location, $modal, profileService, authenticationService, errorService, infoService, eventHelper, userInfo, locationHelper, client) {

        var profile = this;

        profile.name = '';
        profile.email = '';
        profile.newPassword = '';
        profile.newPasswordAgain = '';
        profile.passwordChangeError = '';

        if (client) {
            profile.addCredit = addCredit;
            profile.registrationEmail = registrationEmail;
            profile.changeEmail = changeEmail;
        } else {
            profile.changePassword = changePassword;
        }

        fillProfile(client ? client : userInfo);

        eventHelper.subscribe.authenticationChanged(checkAuthentication);

        function checkAuthentication() {
            locationHelper.onlyAuthenticated().then(fillProfile);
        }

        function fillProfile(userInfo) {
            if (userInfo) {
                profile.name = userInfo.name;
                profile.email = userInfo.email;
                profile.role = userInfo.roles.indexOf('admin') === -1 ? (userInfo.roles.indexOf('coach') === -1 ? 'Tanítvány' : 'Edző') : 'Adminisztrátor';
                profile.qr = userInfo.qr;
            }
        }

        function changePassword() {

            profile.passwordChangeError = '';

            if (!profile.newPassword) {
                profile.passwordChangeError = 'Az új jelszót kötelező megadni';
                return;
            }

            if (!profile.newPasswordAgain) {
                profile.passwordChangeError = 'Az ellenőrző jelszót kötelező megadni';
                return;
            }

            if (profile.newPassword != profile.newPasswordAgain) {
                profile.passwordChangeError = 'Az új és ellenőrző jelszó nem egyezik meg';
                return;
            }

            profileService.changePassword(profile.newPassword).then(
                function () {

                    authenticationService.login(profile.name, profile.newPassword).then(
                        function () {
                            profile.newPassword = '';
                            profile.newPasswordAgain = '';

                            $modal.open({
                                templateUrl: 'modal/info.html',
                                controller: 'Info',
                                controllerAs: 'info',
                                size: 'sm',
                                resolve: {
                                    title: function () {
                                        return 'Jelszó változtatás';
                                    },
                                    message: function () {
                                        return 'A jelszavát sikeresen megváltoztattuk';
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

        function addCredit() {
            return '/berlet/vasarlas?tanitvany=' + encodeURI(profile.name);
        }

        function registrationEmail() {
            profileService.sendRegistrationEmail(profile.name)
                .then(function (result) { infoService.modal('Regisztrációs email újraküldése', result); })
                .catch(errorService.modal);
        }

        function changeEmail() {
            profileService.changeEmail(profile.name, profile.email).then(changeEmailSuccess, errorService.modal);

            function changeEmailSuccess (result) {
                infoService.modal('Email cím változtatás', result);
            }
        }
    }
})();