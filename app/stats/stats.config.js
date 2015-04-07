(function (){

    'use strict';

    angular
        .module('gymassistant.front.stats')
        .config(StatsConfig);

    /* @ngInject */
    function StatsConfig($routeProvider) {
        $routeProvider.when('/statisztikak', {
            templateUrl: 'stats/stats.html'
        }),
        $routeProvider.when('/statisztikak/attekintes', {
            templateUrl: 'stats/overview.html',
            controllerAs: 'vm',
            controller: 'OverviewController',
            resolve: {
                /* @ngInject */
                userInfo: function(locationHelper) {
                    return locationHelper.onlyCoach();
                },
                /* @ngInject */
                coaches: function(statsService) {
                    return statsService.getAllCoaches();
                },
                /* @ngInject */
                stats: function (statsService) {
                    var from = moment().startOf('month').subtract({month: 1}).format('YYYY-MM-DD');
                    var to = moment().endOf('month').subtract({month: 1}).format('YYYY-MM-DD');
                    return statsService.getOwnOveriew(from, to);
                }
            }
        }),
        $routeProvider.when('/statisztikak/attekintes/:from/:to', {
            templateUrl: 'stats/overview.html',
            controllerAs: 'vm',
            controller: 'OverviewController',
            resolve: {
                /* @ngInject */
                userInfo: function(locationHelper) {
                    return locationHelper.onlyCoach();
                },
                /* @ngInject */
                coaches: function() {
                    return null;
                },
                /* @ngInject */
                stats: function ($route, statsService) {
                    return statsService.getOwnOveriew($route.current.params.from, $route.current.params.to);
                }
            }
        }),
        $routeProvider.when('/statisztikak/attekintes/:coach/:from/:to', {
            templateUrl: 'stats/overview.html',
            controllerAs: 'vm',
            controller: 'OverviewController',
            resolve: {
                /* @ngInject */
                userInfo: function(locationHelper) {
                    return locationHelper.onlyAdmin();
                },
                /* @ngInject */
                coaches: function(statsService) {
                    return statsService.getAllCoaches();
                },
                /* @ngInject */
                stats: function ($route, statsService) {
                    return statsService.getOthersOveriew($route.current.params.from, $route.current.params.to, $route.current.params.coach);
                }
            }
        }),
        $routeProvider.when('/statisztikak/aktiv/berletek', {
            templateUrl: 'stats/active_subscriptions.html',
            controllerAs: 'vm',
            controller: 'ActiveSubscriptionsController',
            resolve: {
                /* @ngInject */
                userInfo: function(locationHelper) {
                    return locationHelper.onlyAdmin();
                },
                /* @ngInject */
                coaches: function(statsService) {
                    return statsService.getAllCoaches();
                },
                subscriptions: function() {
                    return null;
                }
            }
        }),
        $routeProvider.when('/statisztikak/aktiv/berletek/:from/:to', {
            templateUrl: 'stats/active_subscriptions.html',
            controllerAs: 'vm',
            controller: 'ActiveSubscriptionsController',
            resolve: {
                /* @ngInject */
                userInfo: function(locationHelper) {
                    return locationHelper.onlyAdmin();
                },
                /* @ngInject */
                coaches: function(statsService) {
                    return statsService.getAllCoaches();
                },
                /* @ngInject */
                subscriptions: function($route, statsService) {
                    return statsService.getActiveSubscriptions($route.current.params.from, $route.current.params.to);
                }
            }
        });
    }
})();