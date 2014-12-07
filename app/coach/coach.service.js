(function (){

    'use strict';

    angular.module('gymassistant.front.coach')
        .factory('coachService', CoachSevice);

    /* @ngInject */
    function CoachSevice(httpService) {

        return {
            addNewUser: addNewUser,
            getUserInfo: getUserInfo,
            addNewSubscription: addNewSubscription,
            addNewSubscriptionTillDate: addNewSubscriptionTillDate,
            getSeries: getSeries
        };

        function addNewUser(name, email) {

            return httpService.get('/api/add/new/user/with/name/' + name + '/and/email/' + email);
        }

        function getUserInfo(name) {
            return httpService.get('/api/user/' + name);
        }

        function addNewSubscription(amount, userName, period, series) {

            return httpService.get('/api/add/subscription/with/'+ amount + '/credits/to/user/' + userName + '/for/' + period + (series && series.length ? '?series=' + series.join() : ''));
        }

        function addNewSubscriptionTillDate(amountPerWeek, userName, date, series) {

            return httpService.get('/api/add/subscription/with/'+ amount + '/credits/per/week/to/user/' + userName + '/till/date/' + date + (series && series.length ? '?series=' + series.join() : ''));
        }

        function getSeries() {
            return httpService.get('/api/my/training/series');
        }
    }

})();
