(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.directive('taskList', ['$location', '$rootScope', '$http', 'TaskService', function($location, $rootScope, $http, TaskService) {
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

                $scope.zones = [];
                $scope.zones["TODO"] = "Todo";
                $scope.zones["IN_PROGRESS"] = "In Progress";
                $scope.zones["TESTING"] = "Testing";
                $scope.zones["BLOCKED"] = "Blocked";
                $scope.zones["DONE"] = "Done";

                $scope.dropCallback = function(index, item, external, type, zone) {
                    item.taskProgress = zone;

                    TaskService.updateTask($scope.slug, $scope.sprint.id, item).then(function(response) {
                    }, function (response) {
                    });

                    return item;
                };
            }
        }
    }]);

})();