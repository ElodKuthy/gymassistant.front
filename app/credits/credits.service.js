(function (){

    'use strict';

    angular.module('gymassistant.front.credits')
        .service('creditsService', CreditsSevice);

    /* @ngInject */
    function CreditsSevice(httpService) {

        var self = this;

        self.getCreditDetails = function(id, name) {
                return httpService.get('/api/credit/details/' + id + (name ? ('/of/' + name) : ''));
        };

        self.increaseFreeCredits = function(id, name) {
                return httpService.post('/api/credit/details/' + id + '/of/' + name, { 'addFreeCredit': true });
        };

        self.increaseValidity = function(id, name) {
                return httpService.post('/api/credit/details/' + id + '/of/' + name, { 'addWeek': true });
        };
    }

})();
