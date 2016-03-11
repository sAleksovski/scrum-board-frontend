(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.controller('BoardController', function($scope, $http, $location, $stateParams, $uibModal) {

    	$scope.slug = $stateParams.slug;
        $scope.sprint = '';

        $http.get('/api/boards/' + $scope.slug).then(function(response) {
            $scope.board = response.data;
            $scope.currentSprintId = $scope.board.sprints[$scope.board.sprints.length - 1].id;
            $scope.sprintChanged();
        });

        $scope.sprintChanged = function() {
            $http.get('/api/boards/' + $scope.slug + '/sprints/' + $scope.currentSprintId + '/tasks').then(function(response) {
                $scope.tasks = response.data;
            });
        };

        $scope.openAddSprintModal = function () {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/modal/sprint-add-modal.tpl.html',
                controller: 'SprintAddModalController'
            });

            modalInstance.result.then(function (dates) {
                createSprint(dates.fromDate, dates.toDate);
            }, function () {
            });
        };

        function createSprint(fromDate, toDate) {
            var sprint = {};
            sprint.fromDate = [fromDate.getFullYear(), fromDate.getMonth() + 1, fromDate.getDate()];
            sprint.toDate = [toDate.getFullYear(), toDate.getMonth() + 1, toDate.getDate()];
            $http.post('/api/boards/' + $scope.slug + '/sprints', sprint).then(function(response) {
                $scope.board.sprints.push(response.data);
                $scope.currentSprintId = response.data.id;
                $scope.sprintChanged();
            });
        }

    });
})();