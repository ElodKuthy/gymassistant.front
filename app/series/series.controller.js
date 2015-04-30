(function () {

    'use strict';

    angular
        .module('gymassistant.front.series')
        .controller('SeriesController', SeriesController);

    /* @ngInject */
    function SeriesController($rootScope, $filter, userInfo, seriesService, loadingService) {

        var vm = this;
        vm.series = [];

        $rootScope.title = 'Edzés sablonok';

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
})();