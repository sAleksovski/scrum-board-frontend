(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.service('AuthService', AuthService);

    function AuthService($http, $rootScope, $location) {
        var service = {};

        service.getUser = getUser;
        service.logout = logout;

        return service;

        function getUser() {
            return $http.get('/api/me');
        }

        function logout() {
            $http.post('/auth/logout').then(function() {
                $rootScope.authenticated = false;
                $location.path('/');
                location.reload(true);
            }, function() {
                $rootScope.authenticated = false;
                $location.path('/');
                location.reload(true);
            });
        }

    }
})();