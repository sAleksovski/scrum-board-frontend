(function() {
  'use strict';

  var app = angular.module('scrum-board-frontend');

  app.controller('HomeController', function($scope, $http, $location) {
    $scope.authenticated = false;
    $http.get('/api/user').then(function(response) {
      console.log(response.data);
      $scope.authenticated = true;
      $scope.user = response.data.firstName;
    });

    $scope.logout = function() {
      $http.post('/auth/logout').then(function(response) {
        console.log(response);
        $location.path('/');
        $scope.authenticated = false;
        location.reload(true);
      }, function(response) {
        console.log(response);
        $scope.authenticated = false;
        $location.path('/');
        location.reload(true);
      })
    };
  });
})();