(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.controller('BoardController', function($scope, $http, $location, $stateParams, $resource) {

    	$scope.slug = $stateParams.slug;
        $scope.sprint = '';

        $http.get('/api/boards/' + $scope.slug).then(function(response) {
            $scope.board = response.data;
            console.log($scope.board);
            $scope.sprint = $scope.board.sprints[$scope.board.sprints.length - 1].id;
            $scope.sprintChanged();
        });

        $scope.sprintChanged = function() {
            console.log($scope.sprint);
            $http.get('/api/boards/' + $scope.slug + '/sprints/' + $scope.sprint + '/tasks').then(function(response) {
                $scope.tasks = response.data;
            });
        };

        // var t = {
        //     "fromDate": [
        //       2016,
        //       3,
        //       25
        //     ],
        //     "toDate": [
        //       2016,
        //       3,
        //       30
        //     ]
        //   };

        // $http.post('/api/boards/' + $scope.slug + '/sprints', t).then(function(response) {
        //     console.log(response);
        //     $scope.board = response.data;
        // });

        // var Board = $resource('/api/boards/:slug', {
        //     slug:'@slug'
        // });

        // var boards = Board.query(function() {
        //     console.log(boards[0]);
        // });
    });
})();