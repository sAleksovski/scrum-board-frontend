(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.directive('taskList', ['$mdDialog', '$mdMedia', 'TaskService', function($mdDialog, $mdMedia, TaskService) {
        return {
            restrict: 'E',
            templateUrl: 'app/task-list.tpl.html',
            scope: {
                list: '=tasks',
                slug: '=slug',
                sprint: '=sprint',
                zone: '=zone'
            },
            link: function($scope) {

                $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

                $scope.zones = [];
                $scope.zones["TODO"] = "Todo";
                $scope.zones["IN_PROGRESS"] = "In Progress";
                $scope.zones["TESTING"] = "Testing";
                $scope.zones["BLOCKED"] = "Blocked";
                $scope.zones["DONE"] = "Done";

                $scope.dropCallback = function(index, task, external, type, zone) {
                    task.progress = zone;
                    if ($scope.list.length != 0) {
                        if (index == 0) {
                            task.position = $scope.list[0].position - 1;
                        } else if (index == $scope.list.length) {
                            task.position = $scope.list[$scope.list.length - 1].position + 1;
                        } else {
                            task.position = parseFloat($scope.list[index - 1].position + $scope.list[index].position) / 2.0;
                        }
                    }

                    TaskService.updateTask($scope.slug, $scope.sprint.id, task).then(function(response) {
                    }, function (response) {
                    });

                    return task;
                };

            }
        }
    }]);

})();