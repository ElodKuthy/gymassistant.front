(function (){

    "use strict";

    angular.module("gymassistant.front.attendees")
        .factory("attendeesService", AttendeesSevice);

    /* @ngInject */
    function AttendeesSevice(httpService) {

        return {
            addToTraining: addToTraining,
            removeFromTraining: removeFromTraining,
            checkIn: checkIn,
            undoCheckIn: undoCheckIn
        };

        function addToTraining(id, userName) {

            return httpService.get("/api/add/user/" + userName + "/session/" + id);
        }

        function removeFromTraining(id, userName) {

            return httpService.get("/api/remove/user/" + userName + "/session/" + id);
        }

        function checkIn(id, userName) {

            return httpService.get("/api/check/in/user/" + userName + "/session/" + id);
        }

        function undoCheckIn(id, userName) {

            return httpService.get("/api/undo/check/in/user/" + userName + "/session/" + id);
        }
    }

})();
