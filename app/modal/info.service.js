(function () {

    "use strict";

    angular
        .module("gymassistant.front.modal")
        .factory("infoService", InfoService);

    /* @ngInject */
    function InfoService($modal) {

        return {
            modal: modal
        };

        function modal(title, message) {

            return $modal.open({
                templateUrl: "modal/info.html",
                controller: "Info",
                controllerAs: "info",
                size: "sm",
                resolve: {
                    title: function () {
                        return title;
                    },
                    message: function () {
                        return message;
                    }
                }
            });
        }

    }

})();
