(function (){

    "use strict";

    angular.module("gymassistant.front.common")
        .factory("httpService", HttpService);

    /* @ngInject */
    function HttpService($location, $http, $q, storageHelper, eventHelper) {

        var api = "https://localhost:8000";

        return {
            get: get,
            post: post
        };

        function get(url, def, auth) {

            var deferred = $q.defer();
                    var authorization = auth ? auth : storageHelper.getAuth();

                    $http.get(api + url, {
                        headers: {"Authorization": authorization}
                    }).then(function (result) {
                        if (result.data.error) {
                            if (def) {
                                deferred.resolve(def);
                            } else {
                            if (result.data.error == "Hibás felhasználónév vagy jelszó") {
                                storageHelper.setAuth(null);
                                storageHelper.setUserInfo(null, false);
                                eventHelper.broadcast.authenticationChanged();
                                $location.path("/");
                            }
                                deferred.reject(result.data.error);
                            }
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
            var authorization = auth ? auth : storageHelper.getAuth();

            $http.post(api + url, body, {
                headers: {"Authorization": authorization}
            }).then(function (result) {
                if (result.data.error) {
                    if (result.data.error == "Hibás felhasználónév vagy jelszó") {
                        storageHelper.setAuth(null);
                        storageHelper.setUserInfo(null, false);
                        eventHelper.broadcast.authenticationChanged();
                        $location.path("/");
                    }

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