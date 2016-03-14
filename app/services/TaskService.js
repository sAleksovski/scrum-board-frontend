(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.service('TaskService', TaskService);

    function TaskService($http) {
        var service = {};

        service.getTasks = getTasks;
        service.updateTask = updateTask;

        return service;

        function getTasks(slug, sprintId) {
            return $http.get('/api/boards/' + slug + '/sprints/' + sprintId + '/tasks')
        }

        function updateTask(slug, sprintId, task) {
            return $http.put('/api/boards/' + slug + '/sprints/' + sprintId + '/tasks/' + task.id, task);
        }

    }
})();