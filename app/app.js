(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend', [
        'ngMaterial',
        'ui.router',
        // 'ui.bootstrap',
        "dndLists",
        'ngResource',
        'ngCookies',
        'pascalprecht.translate',
        // 'toastr',
        // 'ui.select',
        'xeditable']);

    app.config(function($stateProvider, $urlRouterProvider, $httpProvider, $mdThemingProvider) {
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

        // $mdThemingProvider.theme('default')
        //     .primaryPalette('teal')
        //     .accentPalette('red');
    });

})();
