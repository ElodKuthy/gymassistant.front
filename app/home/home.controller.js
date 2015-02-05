(function () {

    'use strict';

    angular
        .module('gymassistant.front.home')
        .controller('HomeController', HomeController);

    /* @ngInject */
    function HomeController($rootScope) {

        $rootScope.title = 'Testkultúra Terem Segéd';
    }

})();