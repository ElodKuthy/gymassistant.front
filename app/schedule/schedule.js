'use strict';

(function () {

    angular
        .module('gymassistant.front.schedule', ['ngRoute'])
        .config(ScheduleConfig)
        .controller('ScheduleCtrl', [ScheduleController]);

    ScheduleConfig.$inject = ['$routeProvider'];

    function ScheduleConfig ($routeProvider) {
        $routeProvider.when('/orarend', {
            templateUrl: 'schedule/schedule.html',
            controllerAs: 'vm',
            controller: 'ScheduleCtrl'
        });
    }

    function ScheduleController () {
        var vm = this;

        vm.schedule = {
            "rows" : [
            { "time" : "7:00",
                "classes" : [
                    { "name": "Dinamikus Jóga", "trainer": "Krisztina", "max": 12, "current": 6 },
                    { "name": "Bajnokok Reggelije", "trainer": "Dávid", "max": 12, "current": 10 },
                    { "name": "Bajnokok Reggelije", "trainer": "Dávid", "max": 12, "current": 9 },
                    { "name": "Dinamikus Jóga", "trainer": "Krisztina", "max": 12, "current": 8 },
                    { "name": "Bajnokok Reggelije", "trainer": "Dávid", "max": 12, "current": 5 }
                ]},
            {
                "time" : "17:00",
                "classes" : [
                    { "name": "Haladó Kettlebell", "trainer": "Arnold", "max": 12, "current": 9 },
                    { "name": "Haladó Kettlebell", "trainer": "Albert", "max": 12, "current": 11 },
                    { "name": "Haladó Kettlebell", "trainer": "Arnold", "max": 12, "current": 12 },
                    { "name": "Haladó Kettlebell", "trainer": "Albert", "max": 12, "current": 11 },
                    { }
                ]},
            { "time" : "18:00",
                "classes" : [
                    { "name": "Kezdő Kettlebell", "trainer": "Arnold", "max": 12, "current": 9 },
                    { "name": "Haladó Kettlebell", "trainer": "Albert", "max": 12, "current": 11 },
                    { "name": "kezdő Kettlebell", "trainer": "Arnold", "max": 12, "current": 12 },
                    { "name": "Haladó Kettlebell", "trainer": "Albert", "max": 12, "current": 11 },
                    { "name": "Clubbell", "trainer": "Albert", "max": 8, "current": 4 }
                ]},
            { "time" : "19:00",
                "classes" : [
                    { "name": "OldSchool Training", "trainer": "Zsolt", "max": 12, "current": 6 },
                    { "name": "Primal Move", "trainer": "Albert", "max": 8, "current": 4 },
                    { "name": "OldSchool Training", "trainer": "Zsolt", "max": 12, "current": 8 },
                    { "name": "Primal Move", "trainer": "Albert", "max": 8, "current": 4 },
                    { "name": "Bajnokok Vacsorája", "trainer": "David", "max": 12, "current": 8 }
                ]},
            { "time" : "20:00",
                "classes" : [
                    { "name": "OldSchool Training", "trainer": "Zsolt", "max": 12, "current": 7 },
                    { "name": "Haladó Kettlebell", "trainer": "Albert", "max": 12, "current": 11 },
                    { "name": "OldSchool Training", "trainer": "Zsolt", "max": 12, "current": 7 },
                    { "name": "Haladó Kettlebell", "trainer": "Albert", "max": 12, "current": 12 },
                    { "name": "Bajnokok Vacsorája", "trainer": "David", "max": 12, "current": 7 }
                ]}
        ]

        }
    }

})();
