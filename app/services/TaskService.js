(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.service('TaskService', TaskService);

    function TaskService($http) {
        var service = {};

        service.getTasks = getTasks;
        service.createTask = createTask;
        service.updateTask = updateTask;
        service.insertComment = insertComment;

        return service;

        function getTasks(slug, sprintId) {
            return $http.get('/api/boards/' + slug + '/sprints/' + sprintId + '/tasks')
        }

        function createTask(slug, sprintId, task) {
            return $http.post('/api/boards/' + slug + '/sprints/' + sprintId + '/tasks', task);
        }

        function updateTask(slug, sprintId, task) {
            return $http.put('/api/boards/' + slug + '/sprints/' + sprintId + '/tasks/' + task.id, task);
        }

        function insertComment(slug, sprintId, taskId, comment) {
            return $http.post('/api/boards/' + slug + '/sprints/' + sprintId + '/tasks/' + taskId + '/comments', comment);
        }

    }
})();