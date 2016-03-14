(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.service('BoardService', BoardService);

    function BoardService($http) {
        var service = {};

        service.getBoards = getBoards;
        service.getBoard = getBoard;
        service.addBoard = addBoard;

        return service;

        function getBoards() {
            return $http.get('/api/boards');
        }

        function getBoard(slug) {
            return $http.get('/api/boards/' + slug);
        }

        function addBoard(name) {
            return $http.post('/api/boards', name);
        }

    }
})();