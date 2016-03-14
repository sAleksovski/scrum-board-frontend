(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend', [
        'ui.router',
        'ui.bootstrap',
        "dndLists",
        'ngResource',
        'ngCookies',
        'pascalprecht.translate',
        'toastr',
        'ui.select',
        'xeditable']);

    app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
        $stateProvider
        .state('/', {
            url: '/',
            controller: 'HomeController',
            templateUrl: 'app/home.tpl.html'
        })
        .state('/b/:slug', {
            url: '/b/:slug',
            controller: 'BoardController',
            templateUrl: 'app/board.tpl.html'
        });

        $urlRouterProvider.otherwise('/');

        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    });

    app.run(function(editableOptions) {
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    });

})();
