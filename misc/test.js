
// https://github.com/NodeRedis/node_redis
// http://www.sitepoint.com/using-redis-node-js/

var path = require( 'path' )
function _l( msg ){
  console.log( msg );
}

_l( path.dirname( path.dirname( __filename ) ) )


var redis   = require('redis')
var rClient = redis.createClient('6379', '127.0.0.1')


rClient.get('foo', function (error, value) { 
  _l( value );
})

rClient.set('foo', 'bar')

_l("DONE ***")

// _l( __filename.dirname )