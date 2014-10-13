'use strict';

(function () {

    angular
        .module('gymassistant.front', [
            'ngRoute',
            'gymassistant.front.login',
            'gymassistant.front.schedule'
        ])
        .config(AppConfig)
        .controller('MainCtrl', MainController);

    AppConfig.$inject = ['$routeProvider', '$locationProvider'];

    function AppConfig ($routeProvider, $locationProvider) {
          $routeProvider.
              when('/', {
                  templateUrl: 'home.html'
              }).
          otherwise({redirectTo: '/'});
      $locationProvider.html5Mode(true);
    }

    MainController.inject = ['$location', 'authenticationService'];

    function MainController($location, authenticationService) {

        var vm = this;

        vm.welcome = authenticationService.isLoggedIn() ? "Üdv " + authenticationService.getUserInfo().userName + "!" : "Üdv, kérlek lépj be!";
        vm.hideLogutButton = !authenticationService.isLoggedIn();

        vm.login = login;
        vm.logout = logout;

        function login() {
            $location.path("/login");
        }

        function logout() {
              authenticationService.logout()
                .then(function (result) {
                  vm.userInfo = null;
                  vm.hideLogutButton = true;
                  vm.welcome = "Üdv, kérlek lépj be!";
                });
          }
    }

})();

