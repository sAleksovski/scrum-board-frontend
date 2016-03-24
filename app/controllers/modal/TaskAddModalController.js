(function () {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.controller('TaskAddModalController', function ($scope, $mdDialog, BoardService, zone, slug) {

        $scope.users = [];

        BoardService.getBoard(slug).then(function (response) {
            response.data.boardUserRole.forEach(function (user) {
                $scope.users.push(user.user);
            });
            console.log($scope.users);
        });

        $scope.task = {};
        $scope.task.taskProgress = zone;

        $scope.progressList = ['TODO', 'IN_PROGRESS', 'TESTING', 'BLOCKED', 'DONE'];
        $scope.dificultyList = ['_0', '_1', '_2', '_3', '_5', '_8', '_13', '_21', '_34', '_55', '_89'];
        $scope.priorityList = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.add = function () {
            $scope.error = '';
            if (typeof $scope.task.name === 'undefined') {
                $scope.error = 'The title is required!';
                return;
            }
            $mdDialog.hide($scope.task);
        };

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
    });
})();