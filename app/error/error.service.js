(function () {

    "use strict";

    angular
        .module("gymassistant.front.error")
        .factory("errorService", ErrorService);

    /* @ngInject */
    function ErrorService($modal) {

        return {
            modal: modal
        };

        function modal(error) {

            return $modal.open({
                templateUrl: "error/error.html",
                controller: "Error",
                controllerAs: "error",
                size: 'sm',
                resolve: {
                    message: function () { return error; }
                }
            });
        }

    }

})();
