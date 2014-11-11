"use strict";

(function () {

    angular
        .module("gymassistant.front", [
            "ngRoute",
            "ui.bootstrap",
            "angularMoment",
            "gymassistant.front.error",
            "gymassistant.front.authentication",
            "gymassistant.front.attendees",
            "gymassistant.front.schedule"
        ])
        .config(AppConfig)
        .controller("Navbar", Navbar);

    AppConfig.$inject = ["$routeProvider", "$locationProvider"];

    function AppConfig ($routeProvider, $locationProvider) {
          $routeProvider.
              when("/", {
                  templateUrl: "home.html"
              }).
          otherwise({redirectTo: "/"});
      $locationProvider.html5Mode(true);
    }

    Navbar.inject = ["$rootScope", "$location", "authenticationService"];

    function Navbar($rootScope, authenticationService) {

        var navbar = this;

        update(null);
        checkUserInfo();

        navbar.logout = logout;

        $rootScope.$on("authenticationChanged", checkUserInfo);

        function logout() {
            authenticationService.logout();
            $rootScope.$broadcast("authenticationChanged");
        }

        function checkUserInfo() {
            authenticationService.getUserInfo().then(update);
        }

        function update(userInfo) {
            navbar.welcomeText = userInfo ? "Üdv " + userInfo.userName + "!" : "Üdv, kérlek lépj be!";
            navbar.welcomeTextLink = userInfo ? "/profilom" : "/belepes";
            navbar.showLogin = userInfo ? false : true;
            navbar.showLogout = userInfo ? true : false;
        }

    }

})();

