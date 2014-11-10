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
            leaveClass: leaveClass,
            updateSchedule: updateSchedule,
            getUsers: getUsers,
            getInstance: getInstance
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

        function post(url, data) {

            var deferred = $q.defer();
            var authorization = $window.sessionStorage["authorization"];

            $http.post(url, data, {
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
                url = url + "/" + begin;
            }
            if (end) {
                url = url + "/" + end;
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

        function updateSchedule(schedule) {

            var data = {};
            data.schedule = schedule;

            return post("/api/schedule", data);
        }

        function getUsers() {

            return get("/api/users");
        }

        function getInstance(id) {

            return get("api/schedule/" + id);
        }
    }
})();