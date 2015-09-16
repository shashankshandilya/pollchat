#!/usr/bin/node


var io = require('socket.io-client');
var kafka = require('kafka-node');

var socket = io.connect('http://127.0.0.1:6000');

var msg = {}
msg['receiver'] = 'RPY8M7h8FhGn9w7ZAAAA'
msg['msg'] = "Hello From Subscriber 4";
msg['sender'] = 'WSOExjQw-SqlAU5rAAAC';
 
socket.emit('subscribe', JSON.stringify( msg ) );
// var con = socket('http://msg.com:6001');
// socket.on('connect', function(){});
// socket.on('event', function(data){});
// socket.on('disconnect', function(){});