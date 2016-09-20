(function () {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.controller('BoardController', function ($scope, $rootScope, $stateParams, $cookies, $mdDialog, $mdMedia, BoardService, SprintService, TaskService) {

        $scope.slug = $stateParams.slug;

        $scope.showSettings = false;

        $scope.sprintChanged = sprintChanged;
        $scope.openAddTaskModal = openAddTaskModal;
        $scope.openAddSprintModal = openAddSprintModal;
        $scope.openBoardSettingsModal = openBoardSettingsModal;

        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        $scope.tasks = {
            "TODO": [],
            "IN_PROGRESS": [],
            "TESTING": [],
            "BLOCKED": [],
            "DONE": []
        };

        BoardService.getBoard($scope.slug).then(function (response) {
            setBoardUserRole(response.data);
            $scope.board = response.data;
            var currentSprintId = getSelectedSprint();
            if (currentSprintId != -1) {
                response.data.sprints.forEach(function (sprint) {
                    if (sprint.id === currentSprintId) {
                        $scope.currentSprint = sprint;
                    }
                });
            } else if (response.data.sprints.length > 0) {
                $scope.currentSprint = response.data.sprints[0];
            } else {
                openAddSprintModal();
            }
            $scope.currentSprint && $scope.sprintChanged();
        });

        function setBoardUserRole(board) {
            board.boardUserRole.forEach(function (bur) {
                if (bur.user.id == $rootScope.currentUser.id) {
                    if (bur.role == 'ROLE_ADMIN') {
                        $scope.showSettings = true;
                    }
                }
            });
        }

        function sprintChanged() {
            saveSelectedSprint();
            TaskService.getTasks($scope.slug, $scope.currentSprint.id).then(function (response) {
                addTasksToModel(response.data);
            });
        }

        function openAddSprintModal(ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                    controller: 'SprintAddModalController',
                    templateUrl: 'app/modal/sprint-add-modal.tpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen
                })
                .then(function (sprint) {
                    createSprint(sprint);
                }, function () {
                    if ($scope.board.sprints.length == 0) {
                        openAddSprintModal();
                    }
                });
            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }

        function openAddTaskModal (ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                    controller: 'TaskAddModalController',
                    templateUrl: 'app/modal/task-add-modal.tpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen,
                    locals: {zone: 'TODO', slug: $scope.slug}
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
        }

        function createTask(task) {
            TaskService.createTask($scope.slug, $scope.currentSprint.id, task).then(function (response) {
                $scope.tasks.TODO.push(response.data);
            });
        }
        
        function openBoardSettingsModal(ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                    controller: 'SprintSettingsModalController',
                    templateUrl: 'app/modal/sprint-settings-modal.tpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen,
                    locals: {
                        slug: $scope.slug
                    }
                });
            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }

        function createSprint(sprint) {
            SprintService.addSprint($scope.slug, sprint).then(function (response) {
                $scope.board.sprints.push(response.data);
                $scope.currentSprint = response.data;
                $scope.sprintChanged();
            });
        }

        function addTasksToModel(tasks) {
            $scope.tasks = {
                "TODO": [],
                "IN_PROGRESS": [],
                "TESTING": [],
                "BLOCKED": [],
                "DONE": []
            };
            tasks.forEach(function (task) {
                $scope.tasks[task.progress].push(task);
            })
        }

        function getSelectedSprint() {
            var boardToSprint = $cookies.get('bts') || '{}';
            boardToSprint = JSON.parse(boardToSprint);
            if (boardToSprint[$scope.slug]) {
                return boardToSprint[$scope.slug];
            }
            return -1;
        }

        function saveSelectedSprint() {
            var boardToSprint = $cookies.get('bts') || '{}';
            boardToSprint = JSON.parse(boardToSprint);
            boardToSprint[$scope.slug] = $scope.currentSprint.id;
            boardToSprint = JSON.stringify(boardToSprint);
            $cookies.put('bts', boardToSprint);
        }

    });
})();