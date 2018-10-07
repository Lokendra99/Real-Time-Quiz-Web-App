var myApp = angular.module('quiz', ['ngRoute', 'satellizer']);

var socket = io();



socket.on('connect', function() {
  console.log('sockets in controller file');
})
