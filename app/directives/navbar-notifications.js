(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.directive('navbarNotifications', ['$rootScope', 'WebSocketsService', function($rootScope, WebSocketsService) {
        return {
            restrict: 'EA',
            templateUrl: 'app/navbar-notifications.tpl.html',
            link: function($scope) {

                WebSocketsService.connect();

                $scope.notifications = [];

                WebSocketsService.receive().then(null, null, function(message) {
                    $scope.notifications.push(message);
                });

                WebSocketsService.receiveStatus().then(null, null, function(status) {
                    $scope.connected = status;
                });

                $scope.openMenu = function($mdOpenMenu, ev) {
                    $mdOpenMenu(ev);
                };

                $scope.countUnread = function () {
                    return $scope.notifications.filter(function (n) {
                        return n.read == "false";
                    }).length;
                }
            }
        }
    }]);

})();