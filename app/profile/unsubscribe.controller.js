(function () {

    'use strict';

    angular.module('gymassistant.front.profile')
        .controller('UnsubscribeController', UnsubscribeController);

    /* @ngInject */
    function UnsubscribeController($rootScope, $routeParams, profileService, loadingService) {
        var vm = this;

        $rootScope.title = 'Leiratkozás';

        vm.id = $routeParams.id;

        vm.expirationNotification = true;
        vm.newsletter = true;

        vm.unsubscribe = function () {

            loadingService.startLoading();
            return profileService.unsubscribe(vm.id, {
                expirationNotification: !vm.expirationNotification,
                newsletter: !vm.newsletter
            }).then(function (result) {
                vm.showResult = result;
                loadingService.endLoading();
            }, function (error) {
                vm.error = true;
                vm.showResult = error;
                loadingService.endLoading();
            });
        }
    }

})();