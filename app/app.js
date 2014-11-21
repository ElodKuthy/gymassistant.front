(function () {

    "use strict";

    angular
        .module("gymassistant.front", [
            "ngRoute",
            "ngCookies",
            "ui.bootstrap",
            "angularMoment",
            "gymassistant.front.common",
            "gymassistant.front.error",
            "gymassistant.front.authentication",
            "gymassistant.front.attendees",
            "gymassistant.front.schedule",
            "gymassistant.front.profile",
            "gymassistant.front.modal"
        ])
        .config(AppConfig)
        .controller("Navbar", Navbar);

    /* @ngInject */
    function AppConfig ($routeProvider, $locationProvider) {
          $routeProvider.
              when("/", {
                  templateUrl: "home/home.html"
              }).
          otherwise({redirectTo: "/"});
      $locationProvider.html5Mode(true);
    }

    /* @ngInject */
    function Navbar(authenticationService, eventHelper) {

        var navbar = this;

        update(null);
        checkUserInfo();

        navbar.logout = logout;

        eventHelper.subscribe.authenticationChanged(checkUserInfo);

        function logout() {
            authenticationService.logout();
        }

        function checkUserInfo() {
            authenticationService.getUserInfo().then(update);
        }

        function update(userInfo) {
            navbar.welcomeText = userInfo ? "Üdv " + userInfo.userName + "!" : "Üdv, kérlek lépj be!";
            navbar.welcomeTextLink = userInfo ? "/profilom" : "/belepes";
            navbar.isLoggedIn = userInfo ? true : false;
        }

    }

})();

