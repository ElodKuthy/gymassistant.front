(function () {

    'use strict';

    angular
        .module('gymassistant.front.series')
        .controller('SeriesController', SeriesController);

    /* @ngInject */
    function SeriesController($rootScope, $filter, $q, userInfo, seriesService, loadingService, decisionService, infoService, errorService) {

        var vm = this;
        vm.series = [];

        $rootScope.title = 'Edzés sablonok';

        function loadSeries() {
            loadingService.startLoading();

            seriesService.getAll()
                .then(function (series) {
                    vm.series = series;

                    vm.series.forEach(function (instance) {
                        instance.dateAsDate = moment().isoWeekday(instance.date.day).hours(instance.date.hour).minutes(0).toDate();
                    });
                })
                .finally(function () { loadingService.endLoading(); });
        }

        loadSeries();

        vm.deleteSeries = function(id) {

            decisionService.modal('Törlés', 'Biztos, hogy törölni akarod ezt az edzést? Az összes jövőbeli alkalom törölve lesz.', 'Biztos', 'Mégsem')
                .then(function () { doDelete(id); });
        }

        function doDelete(id) {

            $q.when(loadingService.startLoading)
                .then(function () {
                    return seriesService.deleteSeries(id);
                })
                .then(function () {
                    loadingService.endLoading();
                    return infoService.modal('Törlés', 'Az edzést sikeresen törölted');
                })
                .catch(function (error) {
                    loadingService.endLoading();
                    return errorService.modal(error);
                })
                .finally(function () {
                    loadSeries();
                });
        }
    }
})();