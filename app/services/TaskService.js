(function () {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.service('TaskService', TaskService);

    function TaskService($state, $http, $mdMedia, $mdDialog) {
        var service = {};

        service.getTask = getTask;
        service.getTasks = getTasks;
        service.createTask = createTask;
        service.updateTask = updateTask;
        service.showTaskModal = showTaskModal;
        service.insertComment = insertComment;

        return service;

        function getTask(slug, sprintId, taskId) {
            return $http.get('/api/boards/' + slug + '/sprints/' + sprintId + '/tasks/' + taskId)
        }

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

        function showTaskModal(slug, sprintId, taskId, ev, originalTask) {
            var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
            getTask(slug, sprintId, taskId).then(function (response) {
                var task = response.data;
                $mdDialog.show({
                    controller: 'TaskDetailsModalController',
                    templateUrl: 'app/modal/task-details-modal.tpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen,
                    onRemoving: function () {
                        updateTask(slug, sprintId, task).then(function () {
                            if (originalTask) {
                                Object.assign(originalTask, task);
                            }
                            $state.transitionTo("board", {slug: slug});
                        });
                    },
                    locals: {
                        slug: slug,
                        sprintId: sprintId,
                        task: task,
                        originalTask: originalTask
                    }
                });
            });
        }

    }
})();