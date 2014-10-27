'use strict';

(function () {

    angular
        .module('gymassistant.front', [
            'ngRoute',
            'gymassistant.front.login',
            'gymassistant.front.schedule'
        ])
        .config(AppConfig);

    AppConfig.$inject = ['$routeProvider', '$locationProvider'];

    function AppConfig ($routeProvider, $locationProvider) {
          $routeProvider.
              when('/', {
                  templateUrl: 'home.html'
              }).
          otherwise({redirectTo: '/'});
      $locationProvider.html5Mode(true);
    }
})();

