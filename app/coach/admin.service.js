(function (){

    'use strict';

    angular.module('gymassistant.front.coach')
        .factory('adminService', AdminSevice);

    /* @ngInject */
    function AdminSevice(httpService) {

        return {
            addNewSubscription: addNewSubscription,
        };

        function addNewSubscription(amount, userName, coachName, date, period, series) {

            return httpService.get('/api/add/subscription/with/' + amount + '/credits/to/user/' + userName + '/from/date/' + date + '/for/' + period + '/by/' + coachName + (series && series.length ? '?series=' + series.join() : ''));
        }
    }

})();