(function (){

    'use strict';

    angular.module('gymassistant.front.coach')
        .factory('coachService', CoachSevice);

    /* @ngInject */
    function CoachSevice(httpService) {

        return {
            addNewClient: addNewClient,
            addNewCoach: addNewCoach,
            getUserInfo: getUserInfo,
            addNewSubscription: addNewSubscription,
            getSeries: getSeries,
            getCredits: getCredits
        };

        function addNewClient(name, email) {
            return httpService.get('/api/add/new/user/with/name/' + name + '/and/email/' + email);
        }

        function addNewCoach(name, email) {
            return httpService.get('/api/add/new/coach/with/name/' + name + '/and/email/' + email);
        }

        function getUserInfo(name) {
            return httpService.get('/api/user/' + name);
        }

        function addNewSubscription(amount, userName, period, series) {
            return httpService.get('/api/add/subscription/with/'+ amount + '/credits/to/user/' + userName + '/for/' + period + (series && series.length ? '?series=' + series.join() : ''));
        }

        function getSeries() {
            return httpService.get('/api/all/training/series');
        }

        function getCredits(userName) {
            return httpService.get('/api/credits/of/user/' + userName);
        }
    }

})();
