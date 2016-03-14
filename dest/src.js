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
(function () {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.controller('BoardController', function ($scope, $stateParams, $cookies, $uibModal, BoardService, SprintService, TaskService) {

        $scope.slug = $stateParams.slug;

        $scope.sprintChanged = sprintChanged;
        $scope.openAddSprintModal = openAddSprintModal;

        $scope.tasks = {
            "TODO": [],
            "IN_PROGRESS": [],
            "TESTING": [],
            "BLOCKED": [],
            "DONE": []
        };

        BoardService.getBoard($scope.slug).then(function (response) {
            var currentSprintId = getSelectedSprint();
            if (currentSprintId != -1) {
                response.data.sprints.forEach(function (sprint) {
                    if (sprint.id === currentSprintId) {
                        $scope.currentSprint = sprint;
                    }
                });
            } else if (response.data.sprints.length > 0) {
                $scope.currentSprint = response.data.sprints[0];
            }
            $scope.board = response.data;
            $scope.currentSprint && $scope.sprintChanged();
        });

        function sprintChanged() {
            saveSelectedSprint();
            TaskService.getTasks($scope.slug, $scope.currentSprint.id).then(function (response) {
                addTasksToModel(response.data);
            });
        }

        function openAddSprintModal() {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/modal/sprint-add-modal.tpl.html',
                controller: 'SprintAddModalController'
            });

            modalInstance.result.then(function (sprint) {
                createSprint(sprint);
            }, function () {
            });
        }

        function createSprint(sprint) {
            SprintService.addSprint($scope.slug, sprint).then(function (response) {
                $scope.board.sprints.push(response.data);
                $scope.currentSprint = response.data;
                $scope.sprintChanged();
            });
        }

        function addTasksToModel(tasks) {
            $scope.tasks = {
                "TODO": [],
                "IN_PROGRESS": [],
                "TESTING": [],
                "BLOCKED": [],
                "DONE": []
            };
            tasks.forEach(function (task) {
                $scope.tasks[task.taskProgress].push(task);
            })
        }

        function getSelectedSprint() {
            var boardToSprint = $cookies.get('bts') || '{}';
            boardToSprint = JSON.parse(boardToSprint);
            if (boardToSprint[$scope.slug]) {
                return boardToSprint[$scope.slug];
            }
            return -1;
        }

        function saveSelectedSprint() {
            var boardToSprint = $cookies.get('bts') || '{}';
            boardToSprint = JSON.parse(boardToSprint);
            boardToSprint[$scope.slug] = $scope.currentSprint.id;
            boardToSprint = JSON.stringify(boardToSprint);
            $cookies.put('bts', boardToSprint);
        }

    });
})();
(function () {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.controller('HomeController', function ($scope, BoardService) {

        function init() {
            BoardService.getBoards().then(function (response) {
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
            BoardService.addBoard($scope.data.name).then(function (response) {
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
                    });
                };
            }
        }
    }]);

})();
(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.directive('taskList', ['$location', '$rootScope', '$http', 'TaskService', function($location, $rootScope, $http, TaskService) {
        return {
            restrict: 'E',
            templateUrl: 'app/task-list.tpl.html',
            scope: {
                list: '=tasks',
                slug: '=slug',
                sprint: '=sprint',
                zone: '=zone'
            },
            link: function($scope) {

                $scope.zones = [];
                $scope.zones["TODO"] = "Todo";
                $scope.zones["IN_PROGRESS"] = "In Progress";
                $scope.zones["TESTING"] = "Testing";
                $scope.zones["BLOCKED"] = "Blocked";
                $scope.zones["DONE"] = "Done";

                $scope.dropCallback = function(index, item, external, type, zone) {
                    item.taskProgress = zone;

                    TaskService.updateTask($scope.slug, $scope.sprint.id, item).then(function(response) {
                    }, function (response) {
                    });

                    return item;
                };
            }
        }
    }]);

})();
(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.directive('task', ['$location', '$rootScope', '$http', 'AuthService', function($location, $rootScope, $http, AuthService) {
        return {
            restrict: 'E',
            templateUrl: 'app/task.tpl.html',
            scope: {
                task: '=task',
                selected: '=selected'
            },
            link: function($scope) {
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

    app.service('BoardService', BoardService);

    function BoardService($http) {
        var service = {};

        service.getBoards = getBoards;
        service.getBoard = getBoard;
        service.addBoard = addBoard;

        return service;

        function getBoards() {
            return $http.get('/api/boards');
        }

        function getBoard(slug) {
            return $http.get('/api/boards/' + slug);
        }

        function addBoard(name) {
            return $http.post('/api/boards', name);
        }

    }
})();
(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.service('SprintService', SprintService);

    function SprintService($http) {
        var service = {};

        service.addSprint = addSprint;

        return service;

        function addSprint(slug, sprint) {
            sprint.fromDate = [sprint.fromDate.getFullYear(), sprint.fromDate.getMonth() + 1, sprint.fromDate.getDate()];
            sprint.toDate = [sprint.toDate.getFullYear(), sprint.toDate.getMonth() + 1, sprint.toDate.getDate()];
            return $http.post('/api/boards/' + slug + '/sprints', sprint);
        }

    }
})();
(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.service('TaskService', TaskService);

    function TaskService($http) {
        var service = {};

        service.getTasks = getTasks;
        service.updateTask = updateTask;

        return service;

        function getTasks(slug, sprintId) {
            return $http.get('/api/boards/' + slug + '/sprints/' + sprintId + '/tasks')
        }

        function updateTask(slug, sprintId, task) {
            return $http.put('/api/boards/' + slug + '/sprints/' + sprintId + '/tasks/' + task.id, task);
        }

    }
})();
(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.controller('SprintAddModalController', function ($scope, $uibModalInstance) {

        $scope.sprint = {};

        $scope.ok = function () {
            $scope.error = '';
            if (typeof $scope.sprint.name === 'undefined'
                || typeof $scope.sprint.fromDate === 'undefined'
                || typeof $scope.sprint.toDate === 'undefined') {
                $scope.error = 'Both dates are required!';
                return;
            }
            $uibModalInstance.close($scope.sprint);
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