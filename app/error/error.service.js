(function () {

    "use strict";

    angular
        .module("gymassistant.front.error")
        .factory("errorService", ErrorService);

    ErrorService.$inject = ["$modal"];    

    function ErrorService($modal) {
        
        return {
            modal: modal
        };
    
        function modal(error, size) {
            
            $modal.open({
                templateUrl: "error/error.html",
                controller: "Error",
                controllerAs: "error",
                size: size,
                resolve: {
                    message: function () { return error }
                }
            });
        }
        
    }

})();