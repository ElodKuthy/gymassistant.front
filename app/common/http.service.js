(function (){

    "use strict";

    angular.module("gymassistant.front.common")
        .factory("httpService", HttpService);

    /* @ngInject */
    function HttpService($http, $q, $window) {

        var api = "https://localhost:9000";

        return {
            get: get,
            post: post
        };

        function get(url, auth) {

            var deferred = $q.defer();
                    var authorization = auth ? auth : $window.sessionStorage["authorization"];

                    $http.get(api + url, {
                        headers: {"Authorization": authorization}
                    }).then(function (result) {
                        if (result.data.error) {
                            deferred.reject(result.data.error);
                        } else {
                            deferred.resolve(result.data);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function post(url, body, auth) {

            var deferred = $q.defer();
            var authorization = auth ? auth : $window.sessionStorage["authorization"];

            $http.post(api + url, body, {
                headers: {"Authorization": authorization}
            }).then(function (result) {
                if (result.data.error) {
                    deferred.reject(result.data.error);
                } else {
                    deferred.resolve(result.data);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }
    }

})();