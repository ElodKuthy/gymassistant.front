(function () {
    "use strict";
    angular
        .module("gymassistant.front.modal")
        .service("loadingService", LoadingService);

    /* @ngInject */
    function LoadingService($modal) {

        var self = this;
        var loadingModal;

        self.startLoading = function() {
            loadingModal = $modal.open({
                templateUrl: "modal/loading.html",
                windowTemplateUrl: "modal/loading_window.html",
                backdrop: "static",
                keyboard: false
            });
        }

        self.endLoading = function() {
            if (loadingModal) {
                loadingModal.dismiss();
                loadingModal = null;
            }
        }
    }
})();