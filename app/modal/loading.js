(function () {
    "use strict";
    angular
        .module("gymassistant.front.modal")
        .factory("loadingService", LoadingService);

    /* @ngInject */
    function LoadingService($modal) {

        var loadingModal;

        return {
            startLoading: startLoading,
            endLoading: endLoading
        };

        function startLoading() {
            loadingModal = $modal.open({
                templateUrl: "modal/loading.html",
                windowTemplateUrl: "modal/loading_window.html",
                backdrop: "static",
                keyboard: false
            });
        }

        function endLoading() {
            if (loadingModal) {
                loadingModal.dismiss();
                loadingModal = null;
            }
        }
    }
})();