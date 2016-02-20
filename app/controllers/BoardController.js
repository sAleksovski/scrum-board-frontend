(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.controller('BoardController', function($scope, $http, $location, $stateParams, $resource) {

    	$scope.slug = $stateParams.slug;

        $http.get('/api/boards/' + $scope.slug).then(function(response) {
            $scope.board = response.data;
        });

        // var Board = $resource('/api/boards/:slug', {
        //     slug:'@slug'
        // });

        // var boards = Board.query(function() {
        //     console.log(boards[0]);
        // });
    });
})();