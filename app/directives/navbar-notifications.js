(function () {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.directive('navbarNotifications', ['$rootScope', 'WebSocketsService', '$http', function ($rootScope, WebSocketsService, $http) {
        return {
            restrict: 'EA',
            templateUrl: 'app/navbar-notifications.tpl.html',
            link: function ($scope) {

                WebSocketsService.connect();

                $scope.notifications = [];

                $http.get('/api/notifications').then(function (response) {
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
                    $mdOpenMenu(ev);
                };

                $scope.countUnread = function () {
                    return $scope.notifications.filter(function (n) {
                        return n.unread == true;
                    }).length;
                };

                $scope.getNotificationText = function (notif) {
                    if (notif.notificationType == 'ADDED_TO_BOARD') {
                        return notif.creators[0].firstName + ' ' + notif.creators[0].lastName
                            + ' added you to board ' + notif.board.name;
                    }
                    if (notif.notificationType == 'REMOVED_FROM_BOARD') {
                        return notif.creators[0].firstName + ' ' + notif.creators[0].lastName
                            + ' removed you from board ' + notif.board.name;
                    }
                    if (notif.notificationType == 'MADE_ADMIN') {
                        return notif.creators[0].firstName + ' ' + notif.creators[0].lastName
                            + ' made you admin to board ' + notif.board.name;
                    }
                    if (notif.notificationType == 'REMOVED_ADMIN') {
                        return notif.creators[0].firstName + ' ' + notif.creators[0].lastName
                            + ' removed you as a admin to board ' + notif.board.name;
                    }
                    if (notif.notificationType == 'АSSIGNED_TASK') {
                        return notif.creators[0].firstName + ' ' + notif.creators[0].lastName
                            + ' assigned a task to you ' + notif.task.name;
                    }
                    if (notif.notificationType == 'COMMENTED_ON_TASK') {
                        return notif.creators[0].firstName + ' ' + notif.creators[0].lastName
                            + (notif.creators.length > 0 ? ' and ' + (notif.creators.length - 1) + ' more' : '')
                            + ' commented on a task ' + notif.task.name;
                    }
                    if (notif.notificationType == 'CREATED_SPRINT') {
                        return notif.creators[0].firstName + ' ' + notif.creators[0].lastName
                            + ' created a sprint in board ' + notif.board.name;
                    }
                    return "<Error>";
                };
            }
        }
    }]);

})();