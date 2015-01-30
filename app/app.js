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
            'gymassistant.front.error',
            'gymassistant.front.authentication',
            'gymassistant.front.attendees',
            'gymassistant.front.schedule',
            'gymassistant.front.profile',
            'gymassistant.front.modal',
            'gymassistant.front.coach',
            'gymassistant.front.series'
        ])
        .config(AppConfig)
        .controller('Navbar', Navbar);

    /* @ngInject */
    function AppConfig ($routeProvider, $locationProvider) {
          $routeProvider.
              when('/', {
                  templateUrl: 'home/home.html'
              }).
          otherwise({redirectTo: '/'});
      $locationProvider.html5Mode(true);
    }

    /* @ngInject */
    function Navbar(authenticationService, eventHelper) {

        var navbar = this;

        update();

        navbar.logout = logout;

        eventHelper.subscribe.authenticationChanged(update);

        function logout() {
            authenticationService.logout();
        }

        function update() {
            var userInfo = authenticationService.getUserInfo();
            navbar.welcomeText = userInfo ? 'Üdv ' + userInfo.name + '!' : 'Üdv, kérlek lépj be!';
            navbar.welcomeTextLink = userInfo ? '/profilom' : '/belepes';
            navbar.isLoggedIn = userInfo ? true : false;
            navbar.isCoach = userInfo && userInfo.roles.indexOf('coach') > -1;
            navbar.isAdmin = userInfo && userInfo.roles.indexOf('admin') > -1;
        }
    }

})();

