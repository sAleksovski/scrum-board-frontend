(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.directive('task', ['$mdMedia', '$mdDialog', 'TaskService', function($mdMedia, $mdDialog, TaskService) {
        return {
            restrict: 'E',
            templateUrl: 'app/task.tpl.html',
            scope: {
                task: '=task',
                slug: '=slug',
                sprint: '=sprint'
            },
            link: function($scope) {

                $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

                $scope.showTaskDetails = function (ev) {
                    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
                    $mdDialog.show({
                            controller: 'TaskDetailsModalController',
                            templateUrl: 'app/modal/task-details-modal.tpl.html',
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            clickOutsideToClose: true,
                            fullscreen: useFullScreen,
                            onRemoving: function () {
                                updateTask($scope.task);
                            },
                            locals: {task: $scope.task, slug: $scope.slug, sprint: $scope.sprint.id}
                        });
                    $scope.$watch(function () {
                        return $mdMedia('xs') || $mdMedia('sm');
                    }, function (wantsFullScreen) {
                        $scope.customFullscreen = (wantsFullScreen === true);
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