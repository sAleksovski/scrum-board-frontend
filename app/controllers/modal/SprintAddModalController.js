(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.controller('SprintAddModalController', function ($scope, $mdDialog) {

        $scope.sprint = {};

        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.add = function() {
            $scope.error = '';
            if (typeof $scope.sprint.name === 'undefined'
                || typeof $scope.sprint.fromDate === 'undefined'
                || typeof $scope.sprint.toDate === 'undefined') {
                $scope.error = 'Both dates and name are required!';
                return;
            }
            $mdDialog.hide($scope.sprint);
        };
    });
})();