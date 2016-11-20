(function () {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.controller('NotificationsController', function ($scope, NotificationService) {

        $scope.notifications = [];

        $scope.page = 0;
        $scope.size = 10;
        $scope.showMoreButton = true;

        $scope.getNotifications = function() {        
            NotificationService.getNotifications($scope.page, $scope.size).then(function(response) {
                $scope.notifications = $scope.notifications.concat(response.data);
                $scope.page++;
                if (response.data.length < $scope.size) {
                    $scope.showMoreButton = false;
                }
            });
        }

        $scope.getNotifications();

        $scope.getNotificationText = function (notif) {
            return NotificationService.getNotificationText(notif);
        };

    });
})();