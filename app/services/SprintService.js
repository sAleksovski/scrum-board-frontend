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