(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.controller('AuthController', function($scope, $location, AuthService) {
        $scope.authenticated = false;
        $scope.show = false;
        AuthService.getUser().then(function() {
            $scope.authenticated = true;
            $scope.show = true;
        }, function() {
            $scope.authenticated = false;
            $location.path('/');
            $scope.show = true;
        });
    });
})();