(function () {

    "use strict";

    angular
        .module("gymassistant.front.schedule")
        .factory("scheduleService", ScheduleService);

    /* @ngInject */
    function ScheduleService(httpService) {

        return {
            getSchedule: getSchedule,
            getCurrentCredit: getCurrentCredit,
            joinClass: joinClass,
            leaveClass: leaveClass,
            getUsers: getUsers,
            getInstance: getInstance
        };

        function getSchedule(begin, end) {

            var url = "/api/schedule";

            if (begin && end) {
                url = url + "/from/" + begin + "/to/" + end;
            } else {
                url = url + "/this/week";
            }

            return httpService.get(url);
        }

        function getCurrentCredit() {
            return httpService.get("/api/my/credits")
                .then(function (results) {
                    var result = null;
                    var latest = 0;

                    results.forEach(function (current) {
                        if (current.expiry > latest) {
                            result = current;
                            latest = current.expiry;
                        }
                    });

                    return result;
                });
        }

        function joinClass(classId) {
            return httpService.get("/api/join/training/id/" + classId);
        }

        function leaveClass(classId) {
            return httpService.get("/api/leave/training/id/" + classId);
        }

        function getUsers() {
            return httpService.get("/api/all/users");
        }

        function getInstance(id) {
            return httpService.get("/api/training/id/" + id);
        }
    }
})();