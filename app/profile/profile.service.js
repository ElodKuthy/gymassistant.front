(function () {

    'use strict';

    angular.module('gymassistant.front.profile')
        .factory('profileService', ProfileSevice);

    /* @ngInject */
    function ProfileSevice(httpService) {

        return {
            changePassword: changePassword,
            changeEmail: changeEmail,
            sendRegistrationEmail: sendRegistrationEmail,
            getCredits: getCredits,
            changeName: changeName,
            unsubscribe: unsubscribe
        };

        function changePassword(newPassword) {
            return httpService.post('/api/change/password', {
                password: newPassword
            });
        }

        function changeEmail(name, email) {
            return httpService.get('/api/change/email/of/user/' + name + '/to/' + email);
        }

        function sendRegistrationEmail(name) {
            return httpService.get('/api/send/registration/email/to/user/' + name);
        }

        function getCredits() {
            return httpService.get("/api/my/credits");
        }

        function changeName(name, newName) {
            return httpService.post('/api/change/name', {
                name: name,
                userName: newName
            });
        }

        function unsubscribe(id, preferences) {
            return httpService.post('/api/unsubscribe/' + id, preferences);
        }
    }

})();