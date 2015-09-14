#!/usr/bin/node

//
// Very simple kafka based chat client for node JS
//
// Basically a less crappy functional test than the can-fake-with-netcat one that
// comes with kafka
// main.shashank@gmail.com
//

var express  = require('express')
var app      = express();
var http = require('http').Server(app);
var io   = require('socket.io')(http);
var path = require( 'path' )

var root = path.dirname( path.dirname( __filename ) )

app.use(express.static( root + '/views') );

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});