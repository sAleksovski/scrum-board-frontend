(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.controller('AuthController', function($scope, $location, AuthService) {
        $scope.authenticated = false;
        
        AuthService.getUser().then(function(response) {
            $scope.authenticated = true;;
        }, function(response) {
            $scope.authenticated = false;
            $location.path('/');
        });
    });
})();