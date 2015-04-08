(function () {

    'use strict';

    angular
        .module('gymassistant.front.stats')
        .service('statsService', StatsService);

    /* @ngInject */
    function StatsService(httpService) {

        var self = this;

        self.getActiveSubscriptions = function(from, to) {
            return httpService.get('/api/active/subscriptions/from/' + from + '/to/' + to);
        };

        self.getAllCoaches = function() {
            return httpService.get('/api/all/coaches');
        };

        self.getOwnOveriew = function(from, to) {
            return httpService.get('/api/get/overview/' + from + '/' + to);
        };

        self.getOthersOveriew = function(from, to, coach) {
            return httpService.get('/api/get/overview/' + coach + '/' + from + '/' + to);
        };
    }
})();