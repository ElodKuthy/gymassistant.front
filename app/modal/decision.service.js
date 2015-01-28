(function () {

    "use strict";

    angular
        .module("gymassistant.front.modal")
        .factory("decisionService", DecisionService);

    /* @ngInject */
    function DecisionService($modal) {

        return {
            modal: modal
        };

        function modal(title, message, yesLabel, noLabel) {

            return $modal.open({
                templateUrl: "modal/decision.html",
                controller: "DecisionController",
                controllerAs: "vm",
                size: "sm",
                resolve: {
                    title: function () {
                        return title;
                    },
                    message: function () {
                        return message;
                    },
                    yesLabel: function () {
                        return yesLabel;
                    },
                    noLabel: function () {
                        return noLabel;
                    }
                }
            }).result;
        }

    }

})();
