(function () {

    'use strict';

    angular
        .module('gymassistant.front.coach')
        .controller('NewUser', NewUser);

    /* @ngInject */
    function NewUser($modal, $location, coachService, errorService, userInfo) {

        var newUser = this;

        newUser.name = '';
        newUser.email = '';
        newUser.save = save;

        function reset(form) {
            newUser.name = '';
            newUser.email = '';
            if (form) {
                form.$setPristine();
                form.$setUntouched();
            }
        }

        function save(form) {

            if(!form || !form.$valid) {
                return;
            }

            coachService.addNewUser(newUser.name, newUser.email).then(newUserSaved, newUserSaveError);

            function newUserSaved() {
                var name = newUser.name;

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