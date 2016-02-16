(function() {
  'use strict';

  var app = angular.module('scrum-board-frontend', [
    'ui.router',
    'ngResource',
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
    });

    $urlRouterProvider.otherwise('/');

    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  });

  app.run(function(editableOptions) {
      editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
  });

})();

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