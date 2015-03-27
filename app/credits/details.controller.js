(function () {

    'use strict';

    angular
        .module('gymassistant.front.credits')
        .controller('CreditDetailsController', CreditDetailsController);

    /* @ngInject */
    function CreditDetailsController($rootScope, $routeParams, userInfo, credit, creditsService, infoService, decisionService, loadingService, errorService) {

        var vm = this;

        $rootScope.title = 'Bérlet részletek';

        vm.userName = $routeParams.name ? $routeParams.name : userInfo.name;
        vm.credit = credit;
        vm.isAdmin = userInfo.roles.indexOf('admin') > -1;
        vm.now = moment().unix();

        vm.profileLink = function() {

            if (vm.userName == userInfo.name) {
                return '/profilom';
            } else {
                return '/profil/' + vm.userName;
            }
        }

        vm.increaseValidity = function() {
            if (vm.isAdmin) {
                decisionService.modal('Érvényesség hoszzabbítás', 'Biztos szeretnéd meghosszabítani ennek a bérletnek az érvényességét egy héttel?', 'Biztos', 'Mégsem')
                    .then(function () {
                        loadingService.startLoading();
                        creditsService.increaseValidity(vm.credit.id, vm.userName)
                            .then(function (result) {
                                vm.credit.expiry += 604800; // 1 week in secs
                                loadingService.endLoading();
                                infoService.modal('Érvényesség hoszzabbítás', 'Sikeresen meghosszabítottad a bérlet érvényességét egy héttel');
                            })
                            .catch(function (err) {
                                loadingService.endLoading();
                                errorService.modal(err);
                            });
                    });
            }
        }

        vm.increaseFreeCredits = function() {
            if (vm.isAdmin) {
                decisionService.modal('Szabad kredit hozzáadása', 'Biztos szeretnél hozzáadni egy szabad kreditet ehhez a bérlethez?', 'Biztos', 'Mégsem')
                    .then(function () {
                        loadingService.startLoading();
                        creditsService.increaseFreeCredits(vm.credit.id, vm.userName)
                            .then(function (result) {
                                vm.credit.free++;
                                loadingService.endLoading();
                                infoService.modal('Szabad kredit hozzáadása', 'Sikeresen hozzáadtál egy szabad kreditet a bérlethez');
                            })
                            .catch(function (err) {
                                loadingService.endLoading();
                                errorService.modal(err);
                            });
                    });
            }
        }

        vm.trainingLink = function(training) {
            if (vm.isAdmin) {
                return '/resztvevok/' + training.id;
            }

            var begin = moment.unix(training.date).startOf('week').format('YYYY-MM-DD');
            var end = moment.unix(training.date).endOf('week').format('YYYY-MM-DD');

            return 'orarend/' + begin + '/' + end;
        }
    }
})();