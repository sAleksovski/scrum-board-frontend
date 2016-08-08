(function () {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.service('WebSocketsService', WebSocketsService);

    function WebSocketsService($q) {
        
        var service = {};

        var host = "$$BACKEND$$";

        service.URL = host + "/api/ws";

        var socket = {
            client: null,
            stomp: null
        };

        var listener = $q.defer();
        var connectedListener = $q.defer();

        service.connect = connect;
        service.disconnect = disconnect;
        service.receive = receive;
        service.receiveStatus = receiveStatus;

        return service;

        function connect() {
            socket.client = new SockJS(service.URL);
            socket.stomp = Stomp.over(socket.client);
            socket.stomp.debug = null;
            socket.stomp.connect({}, function (frame) {
                connectedListener.notify(true);
                socket.stomp.subscribe('/user/queue/notifications', function (message) {
                    listener.notify(JSON.parse(message.body));
                });
            });
        }

        function receive() {
            return listener.promise;
        }

        function disconnect() {
            if (socket.stomp != null) {
                socket.stomp.disconnect();
            }
            connectedListener.notify(false);
        }

        function receiveStatus() {
            return connectedListener.promise;
        }

    }
})();