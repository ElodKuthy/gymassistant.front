(function () {

    'use strict';

    angular
        .module('gymassistant.front', [
            'ngRoute',
            'ui.bootstrap',
            'angularMoment',
            'ja.qr',
            'ipCookie',
            'gymassistant.front.common',
            'gymassistant.front.credits',
            'gymassistant.front.error',
            'gymassistant.front.home',
            'gymassistant.front.authentication',
            'gymassistant.front.attendees',
            'gymassistant.front.schedule',
            'gymassistant.front.profile',
            'gymassistant.front.modal',
            'gymassistant.front.coach',
            'gymassistant.front.series',
            'gymassistant.front.stats'
        ])
        .config(AppConfig)
        .controller('NavbarController', NavbarController);

    /* @ngInject */
    function AppConfig ($routeProvider, $locationProvider) {
          $routeProvider.
              when('/', {
                  templateUrl: 'home/home.html',
                  controller: 'HomeController'
              }).
          otherwise({redirectTo: '/'});
      $locationProvider.html5Mode(true);
    }

    /* @ngInject */
    function NavbarController(authenticationService, eventHelper) {

        var vm = this;

        update();

        vm.logout = logout;

        eventHelper.subscribe.authenticationChanged(update);

        function logout() {
            authenticationService.logout();
        }

        vm.today = '/orarend/' + moment().format('YYYY-MM-DD');

        function update() {
            vm.userInfo = authenticationService.getUserInfo();
            vm.welcomeText = vm.userInfo ? 'Üdv ' + vm.userInfo.name + '!' : 'Üdv, kérlek lépj be!';
            vm.welcomeTextLink = vm.userInfo ? '/profilom' : '/belepes';
            vm.isLoggedIn = vm.userInfo ? true : false;
            vm.isCoach = vm.userInfo && vm.userInfo.roles.indexOf('coach') > -1;
            vm.isAdmin = vm.userInfo && vm.userInfo.roles.indexOf('admin') > -1;
        }
    }

})();

