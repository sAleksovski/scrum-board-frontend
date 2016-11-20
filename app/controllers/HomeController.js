(function () {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.controller('HomeController', function ($scope, BoardService) {

        function init() {
            BoardService.getBoards().then(function (response) {
                $scope.boards = response.data;
            });
        }

        init();

        $scope.showForm = false;
        $scope.data = {};

        $scope.showAdd = function () {
            $scope.showForm = true;
        };

        $scope.onBlur = function () {
            $scope.showForm = false;
            $scope.data.name = '';
        };

        $scope.keyDown = function (event) {
            if (event.keyCode == 27) {
                $scope.showForm = false;
                $scope.data.name = '';
            }
            if (event.keyCode == 13) {
                $scope.showForm = false;
                $scope.addBoard();
            }
        };

        $scope.addBoard = function() {
            $scope.showForm = false;
            BoardService.addBoard($scope.data.name).then(function (response) {
                $scope.boards.push(response.data);
                $scope.data.name = '';
            });
        }
    });
})();