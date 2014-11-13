(function (){

    "use strict";

    angular
        .module("gymassistant.front.attendees")
        .config(AttendeesConfig);

    /* @ngInject */
    function AttendeesConfig($routeProvider) {
        $routeProvider.when('/resztvevok/:id', {
            templateUrl: 'attendees/attendees.html',
            controllerAs: 'attendees',
            controller: 'Attendees'
        });
    }
})();
