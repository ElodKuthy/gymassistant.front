(function (){

    'use strict';

    angular
        .module('gymassistant.front.coach')
        .config(CoachConfig);

    /* @ngInject */
    function CoachConfig($routeProvider) {
        $routeProvider
        .when('/adminisztracio', {
            templateUrl: 'coach/admin.html',
            resolve: {
                /* @ngInject */
                userInfo: function (locationHelper) {
                    return locationHelper.onlyCoach();
                }
            }
        })
        .when('/uj/felhasznalo', {
            templateUrl: 'coach/new_user.html',
            controllerAs: 'vm',
            controller: 'NewUserController',
            resolve: {
                /* @ngInject */
                userInfo: function (locationHelper) {
                    return locationHelper.onlyCoach();
                }
            }
        })
        .when('/berlet/vasarlas', {
            templateUrl: 'coach/add_credit.html',
            controllerAs: 'vm',
            controller: 'AddCreditController',
            resolve: {
                /* @ngInject */
                userInfo: function (locationHelper) {
                    return locationHelper.onlyCoach();
                },
                /* @ngInject */
                allUsers: function (scheduleService) {
                    return scheduleService.getUsers()
                        .then(function (allUsers) {
                            var results = { usersCanBeAdded: [], coachesCanBeAdded: [] };
                            allUsers.forEach(function (user) {
                                if (user.roles.indexOf('admin') === -1) {
                                    if (user.roles.indexOf('coach') === -1) {
                                        results.usersCanBeAdded.push(user.name);
                                    } else {
                                        results.coachesCanBeAdded.push(user.name);
                                    }
                                }
                            });
                            return results;
                    });
                },
                /* @ngInject */
                series: function ($filter, coachService) {
                    return coachService.getSeries()
                        .then(function (series) {
                            var results = [];
                            series.forEach(function (current) {
                                results.push({
                                    _id: current._id,
                                    name: current.name,
                                    coach: current.coach,
                                    date: moment({ days: current.date.day, hours: current.date.hour }).toDate(),
                                    dateText: $filter('date')(moment({ hours: current.date.hour }).day(current.date.day).toDate(), 'EEEE H:mm'),
                                    selected: false
                                });
                            });
                            return results;
                        });
                }
            }
        });
    }
})();
