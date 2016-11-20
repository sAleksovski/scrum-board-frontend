(function () {
    'use strict';

    var app = angular.module('scrum-board-frontend', [
        'ngMaterial',
        'ui.router',
        "dndLists",
        'ngResource',
        'ngCookies',
        'pascalprecht.translate',
        'xeditable']);

    app.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $mdThemingProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                controller: 'HomeController',
                templateUrl: 'app/home.tpl.html'
            })
            .state('board', {
                url: '/b/:slug',
                controller: 'BoardController',
                templateUrl: 'app/board.tpl.html'
            })
            .state('board.task', {
                url: '/tasks/{sprintId:[0-9]+}-:taskId',
                params: {
                    ev: null,
                    originalTask: null
                },
                onEnter: function ($stateParams, TaskService) {
                    TaskService.showTaskModal($stateParams.slug, $stateParams.sprintId, $stateParams.taskId, $stateParams.ev, $stateParams.originalTask);
                }
            })
            .state('notifications', {
                url: '/notifications',
                controller: 'NotificationsController',
                templateUrl: 'app/notifications.tpl.html'
            });

        $urlRouterProvider.otherwise('/');

        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

        // $mdThemingProvider.theme('default')
        //     .primaryPalette('teal')
        //     .accentPalette('red');
    });

})();
