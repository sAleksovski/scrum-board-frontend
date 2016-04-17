(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.controller('AuthController', function($rootScope, $location, AuthService) {
        $rootScope.authenticated = false;
        $rootScope.showapp = false;
        AuthService.getUser().then(function(response) {
            $rootScope.currentUser = response.data;
            $rootScope.authenticated = true;
            $rootScope.showapp = true;
        }, function() {
            $rootScope.currentUser = undefined;
            $rootScope.authenticated = false;
            $location.path('/');
            $rootScope.showapp = true;
        });
    });
})();