var request = require( "superagent" );
module.exports = {
	fetch_data_get : function( url, query_params ){
		return new Promise(( resolve, reject ) => {
			request .get( url )
					.set( "Accept", "application/json" )
					.query( query_params )
					.end(( error, result ) => {
						error ? reject( error ) : resolve( result );
					})
		})
	},
	fetch_data_post : function( url, post_data, content_type ){
		// content_type如果为false 则不需要显式的设置Content-Type
		var content_type = typeof( content_type ) != "undefined" ? content_type : { "Content-Type" : "application/x-www-form-urlencoded" }
		return new Promise(( resolve, reject ) => {
			request .post( url )
					.set( content_type )
					.send( post_data )
					.end(( error, result ) => {
						error ? reject( error ) : resolve( result );
					})
		})
	}
}