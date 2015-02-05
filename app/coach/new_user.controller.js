(function () {

    'use strict';

    angular
        .module('gymassistant.front.coach')
        .controller('NewUserController', NewUserController);

    /* @ngInject */
    function NewUserController($rootScope, $location, coachService, errorService, userInfo, infoService) {

        var vm = this;

        vm.name = '';
        vm.email = '';
        vm.save = save;
        vm.type = 'client';
        vm.adminMode = userInfo.roles.indexOf('admin') > -1;

        $rootScope.title = 'Új felhasználó';

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

                infoService.modal('Új felhasználó hozzáadása', 'Az új felhasználót sikeresen létrehoztuk')
                    .then(function () {
                        $location.path("/profil/" + name);
                    });
            }

            function newUserSaveError(error) {
                errorService.modal(error, 'sm');
            }
        }
    }
})();