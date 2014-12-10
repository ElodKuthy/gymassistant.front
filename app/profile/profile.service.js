(function (){

    'use strict';

    angular.module('gymassistant.front.profile')
        .factory('profileService', ProfileSevice);

    /* @ngInject */
    function ProfileSevice(httpService) {

        return {
            changePassword: changePassword,
            changeEmail: changeEmail
        };

        function changePassword(newPassword) {
            return httpService.post('/api/change/password', { password: newPassword });
        }

        function changeEmail(name, email) {
            return httpService.get('/api/change/email/of/user/' + name + '/to/' + email);
        }
    }

})();
