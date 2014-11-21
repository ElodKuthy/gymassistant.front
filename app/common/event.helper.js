(function (){

    "use strict";

    angular.module("gymassistant.front.common")
        .factory("eventHelper", EventHelper);

    /* @ngInject */
    function EventHelper($rootScope) {

        var authenticationChangedEvent = "authenticationChanged";

        return {
            broadcast: {
                authenticationChanged: broadcastAuthenticationChanged
            },
            subscribe: {
                authenticationChanged: onAuthenticationChanged
            }
        };

        function  broadcastAuthenticationChanged() {
            $rootScope.$broadcast(authenticationChangedEvent);
        }

        function onAuthenticationChanged(callback) {
            $rootScope.$on(authenticationChangedEvent, callback);
        }
    }
})();