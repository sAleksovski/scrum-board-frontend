(function () {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.controller('SprintSettingsModalController', function ($scope, $mdDialog, $http, $q, BoardService, slug) {

        $scope.idsToIgnore = [];

        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.close = function () {
            $mdDialog.cancel();
        };

        function init() {
            $scope.searchText = '';
            BoardService.getBoard(slug).then(function (response) {
                $scope.boardUserRole = parseBoardUserRole(response.data.boardUserRole);
                setIdsToIgnore();
            });
        }
        init();

        $scope.selectedItemChanged = function () {
            if ($scope.selectedItem) {
                BoardService.addUser(slug, $scope.selectedItem).then(function () {
                    init();
                });
            }
        };

        $scope.removeUser = function (user) {
            BoardService.deleteUser(slug, user.id).then(function() {
                init();
            });
        }

        $scope.querySearch = function (query) {
            var deferred = $q.defer();
            BoardService.searchUsers(query).then(function (response) {
                var users = response.data.filter(function (u) {
                    return $scope.idsToIgnore.indexOf(u.id) === -1;
                });
                return deferred.resolve(users);
            });
            return deferred.promise;
        };

        $scope.roleChanged = function (bur) {
            bur.role = bur.role === 'ROLE_ADMIN' ? 'ROLE_USER' : 'ROLE_ADMIN';
            BoardService.updateUser(slug, bur).then(function () {
                init();
            });
        };

        function setIdsToIgnore() {
            var idsToIgnore = [];
            $scope.boardUserRole.forEach(function (bur) {
                idsToIgnore.push(bur.user.id);
            });
            $scope.idsToIgnore = idsToIgnore;
        }

        function parseBoardUserRole(bur) {
            bur.forEach(function (b) {
                b.isAdmin = b.role === 'ROLE_ADMIN';
            });
            return bur;
        }

        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.add = function () {
            $mdDialog.hide();
        };
    });
})();