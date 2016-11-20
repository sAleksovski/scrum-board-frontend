(function () {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.directive('navbarNotifications', ['$rootScope', 'WebSocketsService', 'NotificationService', function ($rootScope, WebSocketsService, NotificationService) {
        return {
            restrict: 'EA',
            templateUrl: 'app/navbar-notifications.tpl.html',
            link: function ($scope) {

                WebSocketsService.connect();

                $scope.notifications = [];

                NotificationService.getNotifications().then(function (response) {
                    $scope.notifications = $scope.notifications.concat(response.data);
                });

                WebSocketsService.receive().then(null, null, function (message) {
                    var toSplice = -1;
                    for (var i = 0; i < $scope.notifications.length; i++) {
                        if ($scope.notifications[i].id == message.id) {
                            toSplice = i;
                        }
                    }
                    if (toSplice > -1) {
                        $scope.notifications.splice(toSplice, 1);
                    }
                    $scope.notifications.unshift(message);
                });

                WebSocketsService.receiveStatus().then(null, null, function (status) {
                    $scope.connected = status;
                });

                $scope.openMenu = function ($mdOpenMenu, ev) {
                    NotificationService.markAsRead().then(function() {
                        for (var i = 0; i < $scope.notifications.length; i++) {
                            $scope.notifications[i].unread = false;
                        }
                    });
                    $mdOpenMenu(ev);
                };

                $scope.countUnread = function () {
                    return $scope.notifications.filter(function (n) {
                        return n.unread == true;
                    }).length;
                };

                $scope.getNotificationText = function (notif) {
                    return NotificationService.getNotificationText(notif);
                };
            }
        }
    }]);

})();