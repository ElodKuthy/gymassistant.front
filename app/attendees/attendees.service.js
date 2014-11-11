(function (){

    "use strict";

    angular.module("gymassistant.front.attendees")
        .factory("attendeesService", AttendeesSevice);

    AttendeesSevice.$inject = ["$http", "$q", "$window"];

    function AttendeesSevice($http, $q, $window) {

        return {
            addToTraining: addToTraining,
            removeFromTraining: removeFromTraining,
            checkIn: checkIn,
            undoCheckIn: undoCheckIn
        };

        function get(url) {

            var deferred = $q.defer();
            var authorization = $window.sessionStorage["authorization"];

            $http.get(url, {
                headers: {"Authorization": authorization}
            }).then(function (result) {
                if (result.data.error) {
                    deferred.reject(result.data.error);
                } else {
                    deferred.resolve(result.data);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function addToTraining(id, userName) {

            return get("/api/add/user/" + userName + "/session/" + id);
        }

        function removeFromTraining(id, userName) {

            return get("/api/remove/user/" + userName + "/session/" + id);
        }

        function checkIn(id, userName) {

            return get("/api/check/in/user/" + userName + "/session/" + id);
        }

        function undoCheckIn(id, userName) {

            return get("/api/undo/check/in/user/" + userName + "/session/" + id);
        }
    }

})();
