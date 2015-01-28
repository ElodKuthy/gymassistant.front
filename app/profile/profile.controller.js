(function () {

    'use strict';

    angular.module('gymassistant.front.profile')
        .controller('ProfileController', ProfileController);

    /* @ngInject */
    function ProfileController($location, profileService, authenticationService, errorService, infoService, eventHelper, userInfo, locationHelper, client, allUsers, credits) {

        var vm = this;

        vm.name = '';
        vm.email = '';
        vm.newPassword = '';
        vm.newPasswordAgain = '';
        vm.passwordChangeError = '';
        vm.credits = credits;
        vm.now = moment().unix();

        if (client) {
            vm.addCredit = addCredit;
            vm.registrationEmail = registrationEmail;
            vm.changeEmail = changeEmail;
            vm.allUsers = allUsers;
            vm.viewUser = viewUser;
        } else {
            vm.changePassword = changePassword;
        }

        fillProfile(client ? client : userInfo);

        eventHelper.subscribe.authenticationChanged(checkAuthentication);

        function checkAuthentication() {
            locationHelper.onlyAuthenticated().then(fillProfile);
        }

        function fillProfile(userInfo) {
            if (userInfo) {
                vm.name = userInfo.name;
                vm.email = userInfo.email;
                vm.role = userInfo.roles.indexOf('admin') === -1 ? (userInfo.roles.indexOf('coach') === -1 ? 'Tanítvány' : 'Edző') : 'Adminisztrátor';
                vm.isClient = userInfo.roles.indexOf('admin') === -1 && userInfo.roles.indexOf('coach') === -1;
                vm.qr = userInfo.qr;
            }
        }

        function changePassword() {

            vm.passwordChangeError = '';

            if (!vm.newPassword) {
                vm.passwordChangeError = 'Az új jelszót kötelező megadni';
                return;
            }

            if (!vm.newPasswordAgain) {
                vm.passwordChangeError = 'Az ellenőrző jelszót kötelező megadni';
                return;
            }

            if (vm.newPassword != vm.newPasswordAgain) {
                vm.passwordChangeError = 'Az új és ellenőrző jelszó nem egyezik meg';
                return;
            }

            profileService.changePassword(vm.newPassword).then(
                function () {

                    authenticationService.login(vm.name, vm.newPassword).then(
                        function () {
                            vm.newPassword = '';
                            vm.newPasswordAgain = '';

                            infoService.modal('Jelszó változtatás', 'A jelszavát sikeresen megváltoztattuk');
                        },
                        function () {
                            authenticationService.logout();
                        });
                },
                function (error) {
                    vm.passwordChangeError = error;
                });
        }

        function viewUser() {
            $location.path('/profil/' + vm.userToView.name);
        }

        function addCredit() {
            return '/berlet/vasarlas?tanitvany=' + encodeURI(vm.name);
        }

        function registrationEmail() {
            profileService.sendRegistrationEmail(vm.name)
                .then(function (result) { infoService.modal('Regisztrációs email újraküldése', result); })
                .catch(errorService.modal);
        }

        function changeEmail() {
            profileService.changeEmail(vm.name, vm.email).then(changeEmailSuccess, errorService.modal);

            function changeEmailSuccess (result) {
                infoService.modal('Email cím változtatás', result);
            }
        }
    }
})();