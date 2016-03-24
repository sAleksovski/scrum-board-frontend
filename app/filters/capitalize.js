(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.filter('capitalize', function() {
        return function(input) {
            input = input.replace('_', ' ');
            return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        }
    });
})();