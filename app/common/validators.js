(function () {

  'use strict';

  angular
    .module('gymassistant.front.common')
    .directive('equals', function () {
      return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
          ctrl.$validators.equals = function (modelValue, viewValue) {
            if (ctrl.$isEmpty(modelValue)) {
              return true;
            }

            if (attrs.equals && attrs.equals == viewValue) {
              return true;
            }

            return false;
          };
        }
      };
    })
    .directive('isItemOfList', function () {
      return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
          ctrl.$validators.isItemOfList = function (modelValue, viewValue) {
            if (ctrl.$isEmpty(modelValue)) {
              return true;
            }

            if (JSON.parse(attrs.isItemOfList).indexOf(viewValue) > -1) {
              return true;
            }

            return false;
          };
        }
      };
    });
})();