(function () {

    'use strict';

    angular
        .module('gymassistant.front.coach')
        .controller('NewUserController', NewUserController);

    /* @ngInject */
    function NewUserController($modal, $location, coachService, errorService, userInfo) {

        var vm = this;

        vm.name = '';
        vm.email = '';
        vm.save = save;
        vm.type = 'client';
        vm.adminMode = userInfo.roles.indexOf('admin') > -1;

        function reset(form) {
            vm.name = '';
            vm.email = '';
            vm.type = 'cient';
            if (form) {
                form.$setPristine();
                form.$setUntouched();
            }
        }

        function save(form) {

            if(!form || !form.$valid) {
                return;
            }

            if(vm.type == 'coach') {
                coachService.addNewCoach(vm.name, vm.email).then(newUserSaved, newUserSaveError);
            } else {
                coachService.addNewClient(vm.name, vm.email).then(newUserSaved, newUserSaveError);
            }

            function newUserSaved() {
                var name = vm.name;

                reset(form);

                var modalInstance = $modal.open({
                    templateUrl: "modal/info.html",
                    controller: "Info",
                    controllerAs: "info",
                    size: "sm",
                    resolve: {
                        title: function () {
                            return "Új felhasználó hozzáadása";
                        },
                        message: function () {
                            return "Az új felhasználót sikeresen létrehoztuk";
                        }
                    }
                });

                modalInstance.result.then(afterInfoDialog);

                function afterInfoDialog() {
                    $location.path("/profil/" + name);
                }
            }

            function newUserSaveError(error) {
                errorService.modal(error, 'sm');
            }
        }
    }
})();