(function () {

    "use strict";

    angular
        .module("gymassistant.front.schedule")
        .factory("scheduleService", ScheduleService);

    ScheduleService.$inject = ["$http", "$q", "$window"];

    function ScheduleService($http, $q, $window) {

        return {
            getSchedule: getSchedule,
            getCredits: getCredits,
            joinClass: joinClass,
            leaveClass: leaveClass
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
        
        function getSchedule(begin, end) {
            
            var url = "/api/schedule";
            
            if (begin) {
                url.concat("/" + begin);
            }
            if (end) {
                url.concat("/" + end);
            }
            
            return get(url);
        }

        function getCredits() {
            
            return get("/api/credits");
        }

        function joinClass(classId) {
            
            return get("/api/join/" + classId);
        }

        function leaveClass(classId) {
            
            return get("/api/leave/" + classId);
        }
    }
})();