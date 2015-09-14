var path = require( 'path' )
function _l( msg ){
  console.log( msg );
}

_l( path.dirname( path.dirname( __filename ) ) )

// _l( __filename.dirname )