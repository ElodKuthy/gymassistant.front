(function() {
    "use strict";

    angular.module("gymassistant.front.common")
            .directive('gaEnter', function () {
            return function (scope, element, attrs) {
                element.bind("keydown keypress", function (event) {
                    if(event.which === 13) {
                        scope.$apply(function (){
                            scope.$eval(attrs.gaEnter);
                        });

                        event.preventDefault();
                    }
                });
            };
        });
})();