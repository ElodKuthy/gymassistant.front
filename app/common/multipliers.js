(function() {
    'use strict';

    angular.module('gymassistant.front.common')
        .service('multipliers', Multipliers);

    /* @ngInject */
    function Multipliers(periods) {

      var self = this;

      var _single = {
        instance: [2],
        sum: [2]
      };

      var _fourWeeks = {
        instance: [1.75, 1.5, 1.25, 1.1, 1, 0.95, 0.9],
        sum: [7, 12, 15, 18, 20, 23, 25]
      };

      var _twelveWeeks = {
        instance: [1.6, 1.2, 1, 0.88, 0.8, 0.76, 0.72],
        sum: [17, 29, 36, 42, 48, 55, 60]
      };

      self.get = function(period, amount) {

        var result;

        if (period === periods.today && amount == 1) {
          result = _single.instance[amount - 1];
        }

        if (period === periods.fourWeeks) {
          result = _fourWeeks.instance[Math.round(amount / 4) - 1];
        }

        if (period === periods.twelveWeeks) {
          result = _twelveWeeks.instance[Math.round(amount / 12) - 1];
        }

        if (!result) {
          throw new Error('Ismeretlen periódus');
        }

        return result;
      };

      self.getSum = function(period, amount) {

        var result;

        if (period === periods.today && amount == 1) {
          result = _single.sum[amount - 1];
        }

        if (period === periods.fourWeeks) {
          result = _fourWeeks.sum[Math.round(amount / 4) - 1];
        }

        if (period === periods.twelveWeeks) {
          result = _twelveWeeks.sum[Math.round(amount / 12) - 1];
        }

        if (!result) {
          throw new Error('Ismeretlen periódus');
        }

        return result;
      };
    }

})();