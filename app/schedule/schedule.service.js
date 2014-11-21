(function () {

    "use strict";

    angular
        .module("gymassistant.front.schedule")
        .factory("scheduleService", ScheduleService);

    /* @ngInject */
    function ScheduleService(httpService) {

        return {
            getSchedule: getSchedule,
            getCredits: getCredits,
            joinClass: joinClass,
            leaveClass: leaveClass,
            getUsers: getUsers,
            getInstance: getInstance
        };

        function getSchedule(begin, end) {

            var url = "/api/schedule";

            if (begin) {
                url = url + "/" + begin;
            }
            if (end) {
                url = url + "/" + end;
            }

            return httpService.get(url);
        }

        function getCredits() {
            return httpService.get("/api/my/credits", { credits: null });
        }

        function joinClass(classId) {
            return httpService.get("/api/join/session/" + classId);
        }

        function leaveClass(classId) {
            return httpService.get("/api/leave/session/" + classId);
        }

        function getUsers() {
            return httpService.get("/api/users");
        }

        function getInstance(id) {
            return httpService.get("/api/schedule/" + id);
        }
    }
})();