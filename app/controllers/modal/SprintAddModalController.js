(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.controller('SprintAddModalController', function ($scope, $uibModalInstance) {

        $scope.sprint = {};

        $scope.ok = function () {
            $scope.error = '';
            if (typeof $scope.sprint.name === 'undefined'
                || typeof $scope.sprint.fromDate === 'undefined'
                || typeof $scope.sprint.toDate === 'undefined') {
                $scope.error = 'Both dates are required!';
                return;
            }
            $uibModalInstance.close($scope.sprint);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.inlineOptions = {
            showWeeks: true
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.openFrom = function() {
            $scope.popupFrom.opened = true;
        };

        $scope.openTo = function() {
            $scope.popupTo.opened = true;
        };

        $scope.formats = ['yyyy-MM-dd', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

        $scope.popupFrom = {
            opened: false
        };

        $scope.popupTo = {
            opened: false
        };
    });
})();