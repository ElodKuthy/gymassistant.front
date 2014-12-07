(function () {

    'use strict';

    angular
        .module('gymassistant.front.coach')
        .controller('NewUser', NewUser);

    /* @ngInject */
    function NewUser($modal, coachService, errorService, userInfo) {

        var newUser = this;

        newUser.name = '';
        newUser.email = '';
        newUser.save = save;

        function reset() {
            newUser.name = '';
            newUser.email = '';
        }

        function save() {

            coachService.addNewUser(newUser.name, newUser.email).then(newUserSaved, newUserSaveError);

            function newUserSaved() {
                reset();

                $modal.open({
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
            }

            function newUserSaveError(error) {
                errorService.modal(error, 'sm');
            }
        }
    }
})();