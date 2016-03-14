(function () {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.controller('BoardController', function ($scope, $stateParams, $cookies, $uibModal, BoardService, SprintService, TaskService) {

        $scope.slug = $stateParams.slug;

        $scope.sprintChanged = sprintChanged;
        $scope.openAddSprintModal = openAddSprintModal;

        $scope.tasks = {
            "TODO": [],
            "IN_PROGRESS": [],
            "TESTING": [],
            "BLOCKED": [],
            "DONE": []
        };

        BoardService.getBoard($scope.slug).then(function (response) {
            var currentSprintId = getSelectedSprint();
            if (currentSprintId != -1) {
                response.data.sprints.forEach(function (sprint) {
                    if (sprint.id === currentSprintId) {
                        $scope.currentSprint = sprint;
                    }
                });
            } else if (response.data.sprints.length > 0) {
                $scope.currentSprint = response.data.sprints[0];
            }
            $scope.board = response.data;
            $scope.currentSprint && $scope.sprintChanged();
        });

        function sprintChanged() {
            saveSelectedSprint();
            TaskService.getTasks($scope.slug, $scope.currentSprint.id).then(function (response) {
                addTasksToModel(response.data);
            });
        }

        function openAddSprintModal() {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/modal/sprint-add-modal.tpl.html',
                controller: 'SprintAddModalController'
            });

            modalInstance.result.then(function (sprint) {
                createSprint(sprint);
            }, function () {
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
                $scope.tasks[task.taskProgress].push(task);
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