(function () {

    'use strict';

    angular
        .module('gymassistant.front.series')
        .controller('SeriesController', SeriesController);

    /* @ngInject */
    function SeriesController($filter, userInfo, seriesService, loadingService) {

        var vm = this;
        vm.series = [];

        loadingService.startLoading();

        seriesService.getSeries()
            .then(function (series) {
                vm.series = series;

                vm.series.forEach(function (instance) {
                    var datesFormatted = [];

                    instance.dates.forEach(function (date) {
                        datesFormatted.push($filter('date')(moment({ hours: date.hour }).day(date.day).toDate(), 'EEEE H:mm'));
                    });

                    instance.datesFormatted = datesFormatted.join(', ');
                });
            })
            .finally(function () { loadingService.endLoading(); });
    }
})();