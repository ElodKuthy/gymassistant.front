(function () {

    'use strict';

    angular.module('gymassistant.front.profile')
        .controller('ProfileController', ProfileController);

    /* @ngInject */
    function ProfileController($rootScope, $location, profileService, authenticationService, errorService, infoService, eventHelper, userInfo, locationHelper, client, allUsers, credits, loadingService) {

        var vm = this;

        vm.name = '';
        vm.newName = '';
        vm.email = '';
        vm.password = '';
        vm.passwordAgain = '';
        vm.passwordChangeError = '';
        vm.credits = credits;
        vm.now = moment().unix();

        vm.opened = {
            basic: true,
            password: true,
            preferences: true,
            credits: true
        };

        if (client) {
            vm.addCredit = addCredit;
            vm.registrationEmail = registrationEmail;
            vm.changeEmail = changeEmail;
            $rootScope.title = 'Profil - ' + client.name;
        } else {
            vm.changePassword = changePassword;
            $rootScope.title = 'Profilom';
        }

        vm.userInfo = userInfo;
        vm.adminMode = userInfo.roles.indexOf('admin') > -1;

        if (vm.adminMode) {
            vm.changeName = function () {
                if (vm.name != vm.newName) {
                    profileService.changeName(vm.name, vm.newName)
                        .then(function () {
                            vm.name = vm.newName;
                            infoService.modal('Névváltoztatás', 'A tanítvány nevét sikeresen megváltoztattuk');
                        }, function (error) {
                            errorService.modal(error);
                        })
                }
            }
        }

        fillProfile(client ? client : userInfo);

        if (userInfo.roles.indexOf('coach') > -1) {
            vm.allUsers = allUsers;
            vm.viewUser = viewUser;
        }

        eventHelper.subscribe.authenticationChanged(checkAuthentication);

        function checkAuthentication() {
            locationHelper.onlyAuthenticated().then(fillProfile);
        }

        function fillProfile(userInfo) {
            if (userInfo) {
                vm.name = userInfo.name;
                vm.newName = vm.name;
                vm.email = userInfo.email;
                vm.role = userInfo.roles.indexOf('admin') === -1 ? (userInfo.roles.indexOf('coach') === -1 ? 'Tanítvány' : 'Edző') : 'Adminisztrátor';
                vm.isClient = userInfo.roles.indexOf('admin') === -1 && userInfo.roles.indexOf('coach') === -1;
                vm.qr = userInfo.qr;
            }
        }

        function changePassword() {

            vm.passwordChangeError = '';

            if (!vm.password) {
                vm.passwordChangeError = 'Az új jelszót kötelező megadni';
                return;
            }

            if (!vm.passwordAgain) {
                vm.passwordChangeError = 'Az ellenőrző jelszót kötelező megadni';
                return;
            }

            if (vm.password != vm.passwordAgain) {
                vm.passwordChangeError = 'Az új és ellenőrző jelszó nem egyezik meg';
                return;
            }

            profileService.changePassword(vm.password).then(
                function () {

                    authenticationService.login(vm.name, vm.password).then(
                        function () {
                            vm.password = '';
                            vm.passwordAgain = '';

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
            $location.path('/profil/' + ((typeof vm.userToView === 'string') ? vm.userToView : vm.userToView.name));
        }

        function addCredit() {
            return '/berlet/vasarlas?tanitvany=' + encodeURI(vm.name);
        }

        function registrationEmail() {
            profileService.sendRegistrationEmail(vm.name)
                .then(function (result) {
                    infoService.modal('Regisztrációs email újraküldése', result);
                })
                .catch(errorService.modal);
        }

        function changeEmail() {
            profileService.changeEmail(vm.name, vm.email).then(changeEmailSuccess, errorService.modal);

            function changeEmailSuccess(result) {
                infoService.modal('Email cím változtatás', result);
            }
        }

        vm.updatePreferences = function () {
            loadingService.startLoading();
            return authenticationService.updatePreferences(vm.userInfo.preferences)
                .then(loadingService.endLoading);
        }
    }
})();