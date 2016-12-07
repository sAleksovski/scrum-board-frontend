(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.service('NotificationService', NotificationService);

    function NotificationService($http) {
        var service = {};

        service.getNotifications = getNotifications;
        service.markAsRead = markAsRead;
        service.getNotificationText = getNotificationText;

        return service;

        function getNotifications(page, size) {
            page = page || 0;
            size = size || 10;
            return $http.get('/api/notifications?page=' + page + '&size=' + size);
        }

        function markAsRead() {
            return $http.post('/api/notifications');
        }

        function getNotificationText(notif) {
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
                    + (notif.creators.length > 1 ? ' and ' + (notif.creators.length - 1) + ' more' : '')
                    + ' commented on a task ' + notif.task.name;
            }
            if (notif.notificationType == 'CREATED_SPRINT') {
                return notif.creators[0].firstName + ' ' + notif.creators[0].lastName
                    + ' created a sprint in board ' + notif.board.name;
            }
            return "<Error>";
        }

    }
})();