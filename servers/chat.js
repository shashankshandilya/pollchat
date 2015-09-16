#!/usr/bin/node

//
// Very simple kafka based chat client for node JS
//
// Basically a less crappy functional test than the can-fake-with-netcat one that
// comes with kafka
// main.shashank@gmail.com
//

var express = require('express');
var app     = express();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);
var path    = require( 'path' )
var redis   = require('redis')

var rClient = redis.createClient('6379', '127.0.0.1');

var root    = path.dirname( path.dirname( __filename ) )
var users   = {};
var port    = 6000;
var address = "127.0.0.1";



/* KAFKA NODE */

var kafka = require('kafka-node')
var kafkahost = '127.0.0.1';
var kafkaport = 9092;
var kafkatopic = 'chatroom';
var kafkapartition = 0;

var Producer = kafka.Producer;
var client   = new kafka.Client();
var producer = new Producer(client);


function queueMessage( msg ){
  var data = [ { topic : kafkatopic, messages: msg, partition: kafkapartition } ];
  producer.send(data, function (err, data) {
    console.log(data);
    console.log(err);
    console.log("**** SEND ****");
  });
}

producer.on('error', function (err) {
  console.log("producer err  ==>  "+err)
});

/* END KAFKA*/
var listener = http.listen(port, function(){
  console.log('listening on *:'+port);
});


app.use(express.static( root + '/views') );

io.on('connection', function(socket){

  console.log(' :: user connected :: id :: '+socket.id );
  
  // On Disconnect of request
  socket.on('disconnect', function(){
    var userName = users[ socket.id ];
    delete users[ socket.id ];
    rClient.srem('users', userName, function( err, reply){
      broadCastUserLists( io, 'disconnect' );
    });
  });

  // Subsribe Sockets Action From Kafka
  socket.on('subscribe', function(msg){
    msg = JSON.parse( msg );
    console.log( msg );
    console.log( msg['receiver'] );
    io.sockets.connected[ msg['receiver'] ].emit( 'chat message', JSON.stringify( msg ) );
  });
  
  // Chat Messages To Go To KAFKA
  socket.on('chat message', function(msg){
    queueMessage( msg );
  });

  // On Connection Of Users

  socket.on('user', function(msg){
    username = msg[ 'username'];
    users[ socket.id ] = username;
    // Write To Redis
    rClient.sadd(['users', username], function(err, reply) {
      if( reply == 0 ){
        console.log( "user already connected" )
      }else{
        var userData = {};
        userData[ 'id' ] = socket.id;
        userData[ 'h' ]  = address;
        userData[ 'p' ]  = port; 
        rClient.set( username, JSON.stringify( userData) );        
      }
    }); // Add User Meta Data
    broadCastUserLists( io, 'user' );

  });
});

function broadCastUserLists( io, _event ){
  rClient.smembers('users', function(err, reply) {
    io.emit( _event, JSON.stringify( reply ) );
  });
}


