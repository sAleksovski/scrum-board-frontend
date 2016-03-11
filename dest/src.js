(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend', [
        'ui.router',
        'ui.bootstrap',
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

(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.controller('AuthController', function($scope, $location, AuthService) {
        $scope.authenticated = false;
        $scope.show = false;
        AuthService.getUser().then(function() {
            $scope.authenticated = true;
            $scope.show = true;
        }, function() {
            $scope.authenticated = false;
            $location.path('/');
            $scope.show = true;
        });
    });
})();
(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.controller('BoardController', function($scope, $http, $location, $stateParams, $uibModal) {

    	$scope.slug = $stateParams.slug;
        $scope.sprint = '';

        $http.get('/api/boards/' + $scope.slug).then(function(response) {
            $scope.board = response.data;
            $scope.currentSprintId = $scope.board.sprints[$scope.board.sprints.length - 1].id;
            $scope.sprintChanged();
        });

        $scope.sprintChanged = function() {
            $http.get('/api/boards/' + $scope.slug + '/sprints/' + $scope.currentSprintId + '/tasks').then(function(response) {
                $scope.tasks = response.data;
            });
        };

        $scope.openAddSprintModal = function () {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/modal/sprint-add-modal.tpl.html',
                controller: 'SprintAddModalController'
            });

            modalInstance.result.then(function (dates) {
                createSprint(dates.fromDate, dates.toDate);
            }, function () {
            });
        };

        function createSprint(fromDate, toDate) {
            var sprint = {};
            sprint.fromDate = [fromDate.getFullYear(), fromDate.getMonth() + 1, fromDate.getDate()];
            sprint.toDate = [toDate.getFullYear(), toDate.getMonth() + 1, toDate.getDate()];
            $http.post('/api/boards/' + $scope.slug + '/sprints', sprint).then(function(response) {
                $scope.board.sprints.push(response.data);
                $scope.currentSprintId = response.data.id;
                $scope.sprintChanged();
            });
        }

    });
})();
(function () {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.controller('HomeController', function ($scope, $http) {
        function init() {
            $http.get('/api/boards').then(function (response) {
                $scope.boards = response.data;
            });
        }

        init();

        $scope.showForm = false;
        $scope.data = {};

        $scope.showAdd = function () {
            $scope.showForm = true;
        };

        $scope.onBlur = function () {
            $scope.showForm = false;
            $scope.data.name = '';
        };

        $scope.keyDown = function (event) {
            if (event.keyCode == 27) {
                $scope.showForm = false;
                $scope.data.name = '';
            }
            if (event.keyCode == 13) {
                $scope.showForm = false;
                addBoard();
            }
        };

        function addBoard() {
            $http.post('/api/boards', $scope.data.name).then(function (response) {
                $scope.boards.push(response.data);
                $scope.data.name = '';
            });
        }
    });
})();
(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.directive('focus', ['$timeout', function($timeout) {
        return {
            scope : {
                trigger : '@focus'
            },
            link : function(scope, element) {
                scope.$watch('trigger', function(value) {
                    if (value === "true") {
                        $timeout(function() {
                            element[0].focus();
                        });
                    }
                });
            }
        }
    }]);
})();
(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.directive('landingPage', function() {
        return {
            restrict: 'EA',
            templateUrl: 'app/landing-page.tpl.html'
        }
    });
})();
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
                })
              };
          }
      }
  }]);

})();
(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.service('AuthService', AuthService);

    function AuthService($http) {
        var service = {};

        service.getUser = getUser;
        service.logout = logout;

        return service;

        function getUser() {
            return $http.get('/api/user');
        }

        function logout() {
            return $http.post('/auth/logout');
        }

    }
})();
(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.controller('SprintAddModalController', function ($scope, $uibModalInstance) {

        $scope.ok = function () {
            $scope.error = '';
            if (typeof $scope.fromDate === 'undefined' ||
                typeof $scope.toDate === 'undefined') {
                $scope.error = 'Both dates are required!';
                return;
            }
            var dates = {
                fromDate: $scope.fromDate,
                toDate: $scope.toDate
            };
            $uibModalInstance.close(dates);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.inlineOptions = {
            showWeeks: true
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.openFrom = function() {
            $scope.popupFrom.opened = true;
        };

        $scope.openTo = function() {
            $scope.popupTo.opened = true;
        };

        $scope.formats = ['yyyy-MM-dd', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

        $scope.popupFrom = {
            opened: false
        };

        $scope.popupTo = {
            opened: false
        };
    });
})();