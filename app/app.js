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
        .controller("MainCtrl", MainController);

    AppConfig.$inject = ["$routeProvider", "$locationProvider"];

    function AppConfig ($routeProvider, $locationProvider) {
          $routeProvider.
              when("/", {
                  templateUrl: "home.html"
              }).
          otherwise({redirectTo: "/"});
      $locationProvider.html5Mode(true);
    }

    MainController.inject = ["$rootScope", "$location", "authenticationService"];

    function MainController($rootScope, $location, authenticationService) {

        var vm = this;

        update(null);
        checkUserInfo();

        vm.login = login;
        vm.logout = logout;

        $rootScope.$on("authenticationChanged", checkUserInfo);

        function login() {
            $location.path("/belepes");
        }

        function logout() {
            authenticationService.logout();
            $rootScope.$broadcast("authenticationChanged");
        }

        function checkUserInfo() {
            authenticationService.getUserInfo().then(update);
        }

        function update(userInfo) {
            vm.welcomeText = userInfo ? "Üdv " + userInfo.userName + "!" : "Üdv, kérlek lépj be!";
            vm.showLoginButton = userInfo ? false : true;
            vm.showLogoutButton = userInfo ? true : false;
        }

    }

})();

