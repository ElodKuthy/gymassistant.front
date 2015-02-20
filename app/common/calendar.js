(function () {

  'use strict';

  angular
    .module('gymassistant.front.common')
    // Fix for Angular UI Datepicker formatting bug
    .directive('datepickerPopup', function () {
    return {
        restrict: 'EAC',
        require: 'ngModel',
        link: function (scope, element, attr, controller) {
        //remove the default formatter from the input directive to prevent conflict
        controller.$formatters.shift();
        }
      }
    })
    .directive('calendar', function () {
      return {
        restrict: 'E',
        scope: {},
        bindToController: {
          id: '@',
          date: '=model',
          minDate: '@',
          maxDate: '@',
          format: '@',
        },
        /* @ngInject */
        controller: function () {
          var vm = this;

          vm.opened = false;

          vm.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
          };

          vm.today = function () {
              vm.date = new Date();
          };

          vm.clear = function () {
            vm.calendar.date = null;
          };

          /* @ngInject */
          vm.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.opened = true;
          };

          vm.today();
        },
        controllerAs: 'vm',
        templateUrl: '/common/calendar.html'
      };
    });
})();