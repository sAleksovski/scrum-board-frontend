(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.directive('navbar', ['$location', '$rootScope', '$http', 'AuthService', function($location, $rootScope, $http, AuthService) {
        return {
            restrict: 'EA',
            templateUrl: 'app/navbar.tpl.html',
            link: function($scope) {
                $scope.location = $location.path();
                $rootScope.$on('$locationChangeStart', function(event, next) {
                    $scope.location = next.split('#')[1];

                });

                $scope.user = {};

                AuthService.getUser().then(function(response) {
                    $scope.user.name = response.data.firstName + ' ' + response.data.lastName;
                    $scope.user.profilePicture = response.data.imageUrl;
                });

                $scope.openMenu = function($mdOpenMenu, ev) {
                    $mdOpenMenu(ev);
                };

                $scope.logout = function() {
                    AuthService.logout().then(function() {
                        $scope.authenticated = false;
                        $location.path('/');
                        location.reload(true);
                    }, function(response) {
                        console.log(response);
                        $scope.authenticated = false;
                        $location.path('/');
                        location.reload(true);
                    });
                };
            }
        }
    }]);

})();