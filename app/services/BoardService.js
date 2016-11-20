(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.service('BoardService', BoardService);

    function BoardService($http) {
        var service = {};

        service.getBoards = getBoards;
        service.getBoard = getBoard;
        service.addBoard = addBoard;
        service.addUser = addUser;
        service.updateUser = updateUser;
        service.deleteUser = deleteUser;
        service.searchUsers = searchUsers;

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
        
        function addUser(slug, user) {
            return $http.post('/api/boards/' + slug + '/users', user);
        }

        function updateUser(slug, bur) {
            return $http.put('/api/boards/' + slug + '/users', bur);
        }

        function deleteUser(slug, bur) {
            return $http.delete('/api/boards/' + slug + '/users/' + bur);
        }

        function searchUsers(query) {
            return $http.get('/api/users?query=' + query);
        }

    }
})();