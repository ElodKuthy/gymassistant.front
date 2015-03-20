(function () {

    "use strict";

    angular.module("gymassistant.front.modal")
        .controller("DecisionController", DecisionController);

    /* @ngInject */
    function DecisionController($modalInstance, title, message, yesLabel, noLabel, checkbox) {

        var vm = this;

        vm.title = title;
        vm.message = message;
        vm.yesButtonLabel = yesLabel;
        vm.noButtonLabel = noLabel;
        vm.yes = yes;
        vm.no = no;
        vm.checkbox = checkbox;

        function yes () {
            $modalInstance.close({ checkbox: vm.checkbox ? vm.checkbox.value : undefined });
        }

        function no () {
            $modalInstance.dismiss({ checkbox:  vm.checkbox ? vm.checkbox.value : undefined });
        }
    }
})();