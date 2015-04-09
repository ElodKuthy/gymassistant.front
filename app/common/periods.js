(function () {
    'use strict';

    angular.module('gymassistant.front.common')
        .service('periods', Periods);

    /* @ngInject */
    function Periods() {
        var self = this;

        function Period (text, local, days) {
            var _text = text;
            var _days = days;
            var _local = local;

            this.toString = function() { return _text; };
            this.days = function() { return _days; };
            this.toLocal = function() { return _local; };
        }

        self.today = new Period('today', 'napijegy', 0);
        self.fourWeeks = new Period('four_weeks', '4 hetes', 28);
        self.twelveWeeks = new Period('twelve_weeks', '12 hetes', 84);

        var periods = [self.today, self.fourWeeks, self.twelveWeeks];
        var periodTexts = [self.today.toString(), self.fourWeeks.toString(), self.twelveWeeks.toString()];

        self.parse = function(period) {
            var index = periodTexts.indexOf(period);
            if (index == -1) {
                throw new Error('Ismeretlen periódus');
            }
            return periods[index];
        };

        self.parseUnixInterval = function(interval) {
            if (interval < 2419200) { // four weeks in sec
                return self.today;
            }
            if (interval < 7257600) { // tweleve weeks in sec
                return self.fourWeeks;
            }

            return self.twelveWeeks;
        };
    }
})();