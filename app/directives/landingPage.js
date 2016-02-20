(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.directive('landingPage', ['$location', '$rootScope', function($location, $rootScope) {
        return {
            restrict: 'EA',
            templateUrl: 'app/landing-page.tpl.html',
        }
    }]);
})();