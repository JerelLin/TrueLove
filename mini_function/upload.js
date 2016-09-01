let fs = require( "fs" );
let path = require( "path" );
let formidable = require( "formidable" );

let server = "localhost";
let port = 3000;

function upload( req, resolve, reject ){
	// 图片文件将要上传到哪个文件夹下面
	let uploadfoldername = "uploadfiles";
	let uploadfolderpath = path.resolve( __dirname, "../asset/", uploadfoldername );
	console.log( uploadfolderpath )

	let form = new formidable.IncomingForm({
		encoding : "utf-8",
	        	uploadDir : uploadfolderpath,
	        	keepExtensions : true
	});

	let fieldList = {

	}
	let fileList = [  ]

	form.parse( req )
		.on( "field", function( name, value ) { 
			fieldList[ name ] = value;
		} )
		.on( "file", function( name, file ) {
			let filename = path.basename( file.path );
			let filepath = "http://" + server + ":" + port + "/" + uploadfoldername + "/" + filename;
			fileList.push( filepath )
		} )
		.on( "end", function(  ){
			let result = { fieldList : fieldList, fileList : fileList }
			resolve( result ) 
		} )
	        	.on( "error", function( err ) { reject( err ) } )
}

module.exports = upload