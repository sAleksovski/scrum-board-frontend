(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.controller('HomeController', function($scope, $http, $location) {
        function init() {
            $http.get('/api/boards').then(function(response) {
                $scope.list = response.data;
            });
        }

        init();

        $scope.data = {};

        $scope.save = function() {
            $http.post('/api/boards', $scope.data.name).then(function(response) {
                console.log(response);
                $scope.data.name = '';
                init();
            });
        }
    });
})();