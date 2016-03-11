(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.controller('SprintAddModalController', function ($scope, $uibModalInstance) {

        $scope.ok = function () {
            $scope.error = '';
            if (typeof $scope.fromDate === 'undefined' ||
                typeof $scope.toDate === 'undefined') {
                $scope.error = 'Both dates are required!';
                return;
            }
            var dates = {
                fromDate: $scope.fromDate,
                toDate: $scope.toDate
            };
            $uibModalInstance.close(dates);
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