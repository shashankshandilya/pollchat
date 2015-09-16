#!/usr/bin/node


var io = require('socket.io-client');
var kafka = require('kafka-node');
var kafka = require('kafka-node')
var kafkahost = '127.0.0.1';
var kafkaport = 9092;
var kafkatopic = 'chatroom';
var kafkapartition = 0;

var Consumer = kafka.Consumer,
    client = new kafka.Client(),
    consumer = new Consumer(
        client,
        [
            { topic: kafkatopic, partition: kafkapartition }
        ],
        {
            autoCommit: false
        }
    );


var redis   = require('redis')
var rClient = redis.createClient('6379', '127.0.0.1');

var sockets = {}
var socket  = null;

consumer.on('message', function (message) {
  console.log("message received ***** " + JSON.stringify( message ) );
  
  var msg = JSON.parse( message.value );
  
  rClient.get( msg['receiver'], function( err, obj){
    if( obj == null ){
      return;
    }
    console.log( obj );
    obj = JSON.parse( obj );
    if( typeof( obj['h'] ) == "undefined" ){
      console.log("null object")
      return;
    }else{
      console.log(obj['h']);
      var socket_url = "http://"+obj['h']+":"+obj['p'];
      if( typeof( sockets[ socket_url ] ) == "undefined" ){
        socket = io.connect( socket_url );
        sockets[ socket_url ] =  socket;
      }else{
        console.log("Socket Alive");
        socket = sockets[ socket_url ];
      }
      msg['receiver'] = obj['id'];
      socket.emit('subscribe', JSON.stringify( msg ) )
    }//done
  });
});

// var socket  = io.connect('http://msg.com:6000');

// var msg = {}
// msg['receiver'] = 'gXCUrl1fIjKPhpqXAAAD'
// msg['msg'] = "Hello From Subscriber 4";
// msg['sender'] = 'WSOExjQw-SqlAU5rAAAC';
 
// socket.emit('subscribe', JSON.stringify( msg ) );
// var con = socket('http://msg.com:6001');
// socket.on('connect', function(){});
// socket.on('event', function(data){});
// socket.on('disconnect', function(){});