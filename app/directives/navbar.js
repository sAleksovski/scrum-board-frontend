(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.directive('navbar', ['$location', '$rootScope', function($location, $rootScope) {
        return {
            restrict: 'EA',
            templateUrl: 'app/navbar.tpl.html',
            link: function($scope) {
                $scope.location = $location.path();
                $rootScope.$on('$locationChangeStart', function(event, next) {
                    $scope.location = next.split('#')[1];

                });
            }
        }
    }]);

})();