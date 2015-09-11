//https://www.npmjs.com/package/kafka-node


console.log("Test To Kafka");

var kafka = require('kafka-node');

function _log( msg ){
  console.log( msg );
}

var kafka = require('kafka-node'),
    Producer = kafka.Producer,
    KeyedMessage = kafka.KeyedMessage,
    client = new kafka.Client(),
    producer = new Producer(client),
    km = new KeyedMessage('key', 'message'),
    payloads = [
        { topic: 'test', messages: 'hi', partition: 0 },
        { topic: 'test', messages: ['hello', 'world', km] }
    ];
producer.on('ready', function () {
  producer.send(payloads, function (err, data) {
    console.log(data);
  });
});
 
producer.on('error', function (err) {
  _log("err  ==>  "+err)
})

var Consumer = kafka.Consumer,
    client = new kafka.Client(),
    consumer = new Consumer(
        client,
        [
            { topic: 'test' }
        ],
        {
            autoCommit: false
        }
    );

consumer.on('message', function (message) {
  _log("msg ==> "+JSON.stringify(message));
  _log(message.value);
});

