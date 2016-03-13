(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.controller('BoardController', function($scope, $http, $location, $stateParams, $uibModal) {

    	$scope.slug = $stateParams.slug;

        $http.get('/api/boards/' + $scope.slug).then(function(response) {
            $scope.currentSprint = response.data.sprints[0];
            $scope.board = response.data;
            $scope.sprintChanged();
        });

        $scope.sprintChanged = function() {
            $http.get('/api/boards/' + $scope.slug + '/sprints/' + $scope.currentSprint.id + '/tasks').then(function(response) {
                $scope.tasks = response.data;
                addTasksToModel();
            });
        };

        $scope.openAddSprintModal = function () {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/modal/sprint-add-modal.tpl.html',
                controller: 'SprintAddModalController'
            });

            modalInstance.result.then(function (sprint) {
                createSprint(sprint);
            }, function () {
            });
        };

        function createSprint(sprint) {
            sprint.fromDate = [sprint.fromDate.getFullYear(), sprint.fromDate.getMonth() + 1, sprint.fromDate.getDate()];
            sprint.toDate = [sprint.toDate.getFullYear(), sprint.toDate.getMonth() + 1, sprint.toDate.getDate()];
            $http.post('/api/boards/' + $scope.slug + '/sprints', sprint).then(function(response) {
                $scope.board.sprints.push(response.data);
                $scope.currentSprint = response.data;
                $scope.sprintChanged();
            });
        }

        function addTasksToModel() {
            $scope.models.dropzones = {
                "TODO": [],
                "IN_PROGRESS": [],
                "TESTING": [],
                "BLOCKED": [],
                "DONE": []
            };
            $scope.tasks.forEach(function(task) {
                $scope.models.dropzones[task.taskProgress].push(task);
            })
        }

        // TODO,
        // IN_PROGRESS,
        // TESTING,
        // BLOCKED,
        // DONE

        $scope.models = {
            selected: null,
            dropzones: {
                "TODO": [],
                "IN_PROGRESS": [],
                "TESTING": [],
                "BLOCKED": [],
                "DONE": []
            }
        };

        $scope.dropCallback = function(index, item, external, type, zone) {
            item.taskProgress = zone;

            $http.put('/api/boards/' + $scope.slug + '/sprints/' + $scope.currentSprintId + '/tasks/' + item.id, item).then(function(response) {
                console.log(response);
            }, function (response) {
                console.log('error');
                console.log(response);
            });

            return item;
        };

    });
})();