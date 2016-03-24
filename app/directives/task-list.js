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

                    TaskService.updateTask($scope.slug, $scope.sprint.id, task).then(function(response) {
                    }, function (response) {
                    });

                    return task;
                };

                $scope.openAddTaskModal = function (ev, zone) {
                    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
                    $mdDialog.show({
                            controller: 'TaskAddModalController',
                            templateUrl: 'app/modal/task-add-modal.tpl.html',
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            clickOutsideToClose: true,
                            fullscreen: useFullScreen,
                            locals: {zone: zone, slug: $scope.slug}
                        })
                        .then(function (task) {
                            createTask(task);
                        }, function () {
                        });
                    $scope.$watch(function () {
                        return $mdMedia('xs') || $mdMedia('sm');
                    }, function (wantsFullScreen) {
                        $scope.customFullscreen = (wantsFullScreen === true);
                    });
                };

                function createTask(task) {
                    TaskService.createTask($scope.slug, $scope.sprint.id, task).then(function (response) {
                        console.log(response);
                        $scope.list.push(response.data);
                    });
                }
            }
        }
    }]);

})();