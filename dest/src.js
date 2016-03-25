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
(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.directive('taskList', ['$mdDialog', '$mdMedia', 'TaskService', function($mdDialog, $mdMedia, TaskService) {
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

                $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

                $scope.zones = [];
                $scope.zones["TODO"] = "Todo";
                $scope.zones["IN_PROGRESS"] = "In Progress";
                $scope.zones["TESTING"] = "Testing";
                $scope.zones["BLOCKED"] = "Blocked";
                $scope.zones["DONE"] = "Done";

                $scope.dropCallback = function(index, task, external, type, zone) {
                    task.progress = zone;
                    if ($scope.list.length != 0) {
                        if (index == 0) {
                            task.position = $scope.list[0].position - 1;
                        } else if (index == $scope.list.length) {
                            task.position = $scope.list[$scope.list.length - 1].position + 1;
                        } else {
                            task.position = parseFloat($scope.list[index - 1].position + $scope.list[index].position) / 2.0;
                        }
                    }

                    TaskService.updateTask($scope.slug, $scope.sprint.id, task).then(function(response) {
                    }, function (response) {
                    });

                    return task;
                };

                $scope.openAddTaskModal = function (ev, zone) {
                    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
                    $mdDialog.show({
                            controller: 'TaskAddModalController',
                            templateUrl: 'app/modal/task-add-modal.tpl.html',
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            clickOutsideToClose: true,
                            fullscreen: useFullScreen,
                            locals: {zone: zone, slug: $scope.slug}
                        })
                        .then(function (task) {
                            createTask(task);
                        }, function () {
                        });
                    $scope.$watch(function () {
                        return $mdMedia('xs') || $mdMedia('sm');
                    }, function (wantsFullScreen) {
                        $scope.customFullscreen = (wantsFullScreen === true);
                    });
                };

                function createTask(task) {
                    TaskService.createTask($scope.slug, $scope.sprint.id, task).then(function (response) {
                        $scope.list.push(response.data);
                    });
                }
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
                task: '=task'
            },
            link: function($scope) {
                $scope.selected = false;
            }
        }
    }]);

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

    app.controller('BoardController', function ($scope, $stateParams, $cookies, $mdDialog, $mdMedia, BoardService, SprintService, TaskService) {

        $scope.slug = $stateParams.slug;

        $scope.sprintChanged = sprintChanged;
        $scope.openAddSprintModal = openAddSprintModal;

        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

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

        function openAddSprintModal(ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                    controller: 'SprintAddModalController',
                    templateUrl: 'app/modal/sprint-add-modal.tpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen
                })
                .then(function (sprint) {
                    createSprint(sprint);
                }, function () {
                });
            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
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
                $scope.tasks[task.progress].push(task);
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

    app.filter('capitalize', function() {
        return function(input) {
            input = input.replace('_', ' ');
            return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        }
    });
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
        service.createTask = createTask;
        service.updateTask = updateTask;

        return service;

        function getTasks(slug, sprintId) {
            return $http.get('/api/boards/' + slug + '/sprints/' + sprintId + '/tasks')
        }

        function createTask(slug, sprintId, task) {
            return $http.post('/api/boards/' + slug + '/sprints/' + sprintId + '/tasks', task);
        }

        function updateTask(slug, sprintId, task) {
            return $http.put('/api/boards/' + slug + '/sprints/' + sprintId + '/tasks/' + task.id, task);
        }

    }
})();
(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.controller('SprintAddModalController', function ($scope, $mdDialog) {

        $scope.sprint = {};

        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.add = function() {
            $scope.error = '';
            if (typeof $scope.sprint.name === 'undefined'
                || typeof $scope.sprint.fromDate === 'undefined'
                || typeof $scope.sprint.toDate === 'undefined') {
                $scope.error = 'Both dates and name are required!';
                return;
            }
            $mdDialog.hide($scope.sprint);
        };
    });
})();
(function () {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.controller('TaskAddModalController', function ($scope, $mdDialog, BoardService, zone, slug) {

        $scope.users = [];

        BoardService.getBoard(slug).then(function (response) {
            response.data.boardUserRole.forEach(function (user) {
                $scope.users.push(user.user);
            });
            console.log($scope.users);
        });

        $scope.progressList = ['TODO', 'IN_PROGRESS', 'TESTING', 'BLOCKED', 'DONE'];
        $scope.dificultyList = ['_0', '_1', '_2', '_3', '_5', '_8', '_13', '_21', '_34', '_55', '_89'];
        $scope.priorityList = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

        $scope.task = {};
        $scope.task.progress = zone;

        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.add = function () {
            $scope.error = '';
            if (typeof $scope.task.name === 'undefined') {
                $scope.error = 'The title is required!';
                return;
            }
            $mdDialog.hide($scope.task);
        };

        $scope.querySearch = function (query) {
            return query ? $scope.users.filter(createFilterFor(query)) : $scope.users;
        };

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(user) {
                var u = user.firstName + ' ' + user.lastName + ' ' + user.firstName;
                u = angular.lowercase(u);
                return (u.indexOf(lowercaseQuery) > -1);
            };
        }
    });
})();