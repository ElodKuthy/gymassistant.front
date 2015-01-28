(function () {

    "use strict";

    angular.module("gymassistant.front.modal")
        .controller("DecisionController", DecisionController);

    /* @ngInject */
    function DecisionController($modalInstance, title, message, yesLabel, noLabel) {

        var vm = this;

        vm.title = title;
        vm.message = message;
        vm.yesButtonLabel = yesLabel;
        vm.noButtonLabel = noLabel;
        vm.yes = yes;
        vm.no = no;

        function yes () {
            $modalInstance.close();
        }

        function no () {
            $modalInstance.dismiss('no');
        }
    }
})();