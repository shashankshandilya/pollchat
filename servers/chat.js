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

var users = {};
var clients = {};

app.use(express.static( root + '/views') );

io.on('connection', function(socket){

  console.log(' :: user connected :: id :: '+socket.id);

  socket.on('disconnect', function(){
    delete clients[ socket.id ];
    delete users[ socket.id ];
    io.emit('disconnect', JSON.stringify( users ) );
  });

  socket.on('chat message', function(msg){
    msg = JSON.parse( msg );
    console.log( msg );
    io.sockets.connected[ msg['receiver'] ].emit( 'chat message', JSON.stringify( msg ) );
    // io.to( msg['receiver']).emit( 'chat message', JSON.stringify( msg ) );
    // io.emit('chat message', msg);
  });

  socket.on('user', function(msg){
    username = msg[ 'username'];
    users[ socket.id ] = username;
    clients[ socket.id ] = socket;
    io.emit('user', JSON.stringify( users ) );
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});