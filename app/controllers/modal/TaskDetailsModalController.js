(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.controller('TaskDetailsModalController', function ($scope, $mdDialog, TaskService, task, slug, sprint) {

        $scope.progressList = ['TODO', 'IN_PROGRESS', 'TESTING', 'BLOCKED', 'DONE'];
        $scope.dificultyList = ['_0', '_1', '_2', '_3', '_5', '_8', '_13', '_21', '_34', '_55', '_89'];
        $scope.priorityList = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

        $scope.task = task;
        $scope.comment = '';

        $scope.save = function () {
            TaskService.updateTask(slug, sprint, $scope.task).then(function (response) {
                $scope.task = response.data;
            });
        };

        $scope.insertComment = function () {
            TaskService.insertComment(slug, sprint, $scope.task.id, $scope.comment).then(function (response) {
                $scope.task.comments.push(response.data);
                $scope.comment = '';
            });
        };

        $scope.hide = function() {
            $mdDialog.hide($scope.task);
        };
        $scope.cancel = function() {
            $mdDialog.hide($scope.task);
        };
    });
})();