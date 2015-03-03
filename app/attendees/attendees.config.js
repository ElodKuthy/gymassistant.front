(function (){

    "use strict";

    angular
        .module("gymassistant.front.attendees")
        .config(AttendeesConfig);

    /* @ngInject */
    function AttendeesConfig($routeProvider) {
        $routeProvider.when('/resztvevok/:id', {
            templateUrl: 'attendees/attendees.html',
            controllerAs: 'vm',
            controller: 'AttendeesController',
            resolve: {
                /* @ngInject */
                userInfo: function (locationHelper) {
                    return locationHelper.onlyCoach();
                },
                /* @ngInject */
                training: function ($route, scheduleService) {
                    return scheduleService.getInstance($route.current.params.id);
                },
                /* @ngInject */
                allUsers: function (scheduleService) {
                    return scheduleService.getUsers();
                }
            }
        });
    }
})();
