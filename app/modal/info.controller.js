(function () {

    "use strict";

    angular.module("gymassistant.front.modal")
        .controller("InfoController", InfoController);

    /* @ngInject */
    function InfoController($modalInstance, title, message) {

        var info = this;

        info.title = title;
        info.message = message;
        info.close = close;

        function close() {
            $modalInstance.close();
        }
    }
})();