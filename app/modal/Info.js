(function () {

    "use strict";

    angular.module("gymassistant.front.modal")
        .controller("Info", Info);

    /* @ngInject */
    function Info($modalInstance, title, message) {

        var info = this;

        info.title = title;
        info.message = message;
        info.close = close;

        function close() {
            $modalInstance.close();
        }
    }
})();