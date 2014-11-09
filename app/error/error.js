(function () {

    "use strict";

    angular
        .module("gymassistant.front.error")
        .controller("Error", Error);

    Error.$inject = ["$modalInstance", "message"];

    function Error($modalInstance, message) {
        var error = this;

        error.message = message;

        error.ok = function () {
            $modalInstance.close();
        };

    }
})();
