(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.directive('task', ['$location', '$rootScope', '$http', 'AuthService', function($location, $rootScope, $http, AuthService) {
        return {
            restrict: 'E',
            templateUrl: 'app/task.tpl.html',
            scope: {
                task: '=task',
                selected: '=selected'
            },
            link: function($scope) {
            }
        }
    }]);

})();