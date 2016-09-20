(function () {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.directive('task', ['$state', '$mdMedia', '$mdDialog', 'TaskService', function ($state, $mdMedia, $mdDialog, TaskService) {
        return {
            restrict: 'E',
            templateUrl: 'app/task.tpl.html',
            scope: {
                task: '=task',
                slug: '=slug',
                sprint: '=sprint'
            },
            link: function ($scope) {

                $scope.showTaskDetails = function (ev) {
                    $state.go('board.task', {
                        slug: $scope.slug,
                        sprintId: $scope.sprint.id,
                        taskId: $scope.task.id,
                        ev: ev,
                        originalTask: $scope.task
                    });
                };

                function updateTask(task) {
                    TaskService.updateTask($scope.slug, $scope.sprint.id, task).then(function (response) {
                        $scope.task = response.data;
                    });
                }
            }
        }
    }]);

})();