(function () {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.controller('TaskDetailsModalController', function ($scope, $mdDialog, TaskService, BoardService, slug, sprintId, task, originalTask) {

        $scope.dificultyList = ['_0', '_1', '_2', '_3', '_5', '_8', '_13', '_21', '_34', '_55', '_89'];
        $scope.priorityList = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

        $scope.task = task;
        $scope.comment = '';

        $scope.users = [];

        BoardService.getBoard(slug).then(function (response) {
            response.data.boardUserRole.forEach(function (user) {
                $scope.users.push(user.user);
            });
        });

        $scope.querySearch = function (query) {
            return query ? $scope.users.filter(createFilterFor(query)) : $scope.users;
        };

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(user) {
                var u = user.firstName + ' ' + user.lastName + ' ' + user.firstName;
                u = angular.lowercase(u);
                return (u.indexOf(lowercaseQuery) > -1);
            };
        }

        $scope.save = function () {
            TaskService.updateTask(slug, sprintId, $scope.task).then(function (response) {
                $scope.task = response.data;
                if (originalTask) {
                    Object.assign(originalTask, response.data);
                }
            });
        };

        $scope.insertComment = function () {
            TaskService.insertComment(slug, sprintId, $scope.task.id, $scope.comment).then(function (response) {
                $scope.task.comments.push(response.data);
                if (originalTask) {
                    originalTask.comments.push(response.data);
                }
                $scope.comment = '';
            });
        };

        $scope.close = function () {
            $mdDialog.hide($scope.task);
        };
    });
})();