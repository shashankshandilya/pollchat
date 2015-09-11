#!/usr/bin/node

//
// Very simple kafka based chat client for node JS
//
// Basically a less crappy functional test than the can-fake-with-netcat one that
// comes with kafka
//
// David Basden <davidb@anchor.net.au>
//

"use strict";

//============================================//

var listenport = 31337;

var kafkahost = '127.0.0.1';
var kafkaport = 9092;
var kafkatopic = 'chatroom';
var kafkapartition = 0;

//============================================//

var WebSocketServer = require('websocket').server;
var http = require('http');

// Logging 
function ln(msg) { 
	console.log( (new Date()) + msg ); 
}

// Setup HTTP listener
var server = http.createServer(function(request,response) { });
server.listen(listenport, function() {});


// Websockets server 
//
var wsServer = new WebSocketServer( { httpServer: server });

wsServer.on('request', function(req) {
	ln("New connection from " + req.origin + "...");
	var conn = req.accept(null,req.origin);
	ln("... accepted. Connecting to kafka...");
	var kafka = require('kafka-node');

	var Producer = kafka.Producer;
	var client   = new kafka.Client();
	var producer = new Producer(client);


	// Handle messages from the client
	conn.on('message', function(msg) {
		if (msg.type === 'utf8') { // Only bother with text messages
			var data = [ { topic : kafkatopic, messages: msg.utf8Data, partition: kafkapartition } ];
			ln("Got message from client ==> "+conn.remoteAddress+" : " + msg );
			console.log(msg);
			//producer.on('ready', function () {
		  producer.send(data, function (err, data) {
		   	console.log(data);
		   	console.log(err);
		   	console.log("**** SEND ****");
		  });
			//});
		}
	});

	conn.on('error', function(err) { ln("websocketserver is throwing an error"); });

	producer.on('error', function (err) {
	  ln("err  ==>  "+err)
	})


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

	consumer.on('message', function (message) {
		ln("message received ***** ");
	  ln("msg ==> "+JSON.stringify(message));
	  ln(message.value);
	  conn.sendUTF(message.value );
	});

	consumer.on('error', function(err,more) { ln("consumer is throwing an error"); ln(err.toString()); });
	producer.on('error', function(err) { ln("producer is throwing an error");  ln(err.toString());});

	// Handle client disconnections
	conn.on('close', function(conn) { 
		ln(conn.remoteAddress +  " disconnected") 
		ln("closing kafka consumer");
		consumer.close();
		ln("closing kafka producer");
		producer.close();
	});

});
