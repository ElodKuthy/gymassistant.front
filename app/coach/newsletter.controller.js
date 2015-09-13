(function () {

    'use strict';

    angular
        .module('gymassistant.front.coach')
        .controller('NewsletterController', NewsletterController);

    /* @ngInject */
    function NewsletterController($rootScope, decisionService, coachService, loadingService, infoService, errorService) {

        var vm = this;
        vm.title = '';
        vm.content = '';

        $rootScope.title = 'Hírlevél';

        vm.send = function() {
            decisionService.modal('Hírlevél', 'Biztos vagy benne, hogy el szeretnéd küldeni ezt a hírlevelet?', 'Biztos', 'Mégsem')
                .then(function () {
                    loadingService.startLoading();
                    coachService.sendNewsletter(vm.title, vm.content)
                        .then(function(result) {
                            loadingService.endLoading();
                            infoService.modal('Hírlevél', 'Sikeresen kiküldted a hírlevelet');
                        })
                        .catch(function(err) {
                            loadingService.endLoading();
                            errorService.modal(err, 'sm');
                        });
                });
        }
    }

})();