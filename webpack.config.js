var webpack=require("webpack");

module.exports={
	entry: {																								
		marriage_app: "./public/javascripts/marriage_router/marriage_app.jsx",
		vendor: ['react', 'react-dom', 'react-router']
	},
	output: {
		path: __dirname + "/asset/src/",
		filename: "[name].js",
		publicPath: "/src/"
	},
	module: {
		loaders: [	
		    	{ test: /\.js$/, loader : "babel", query: { presets: ["es2015"] } },
			{ test: /\.css$/, loader: "style!css" },
			{ test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/, loader: "url-loader?limit=50000&name=[path][name].[ext]" },
			{ test: /\.scss$/, loader : "style!css!sass" },
			{ test: /\.jsx$/, loader: "babel", query: { presets: ["react", "es2015"] } }
	   	]
    },
    resolve: {
        extensions: ["", ".js", ".jsx",".scss"]
    },
    plugins: [
		new webpack.optimize.CommonsChunkPlugin({
		    names: ['vendor', 'manifest']
		}),
		/*
		new webpack.DefinePlugin({
	    	'process.env' : {
	        	'NODE_ENV' : JSON.stringify('production')
	      	}
	    }),
	    new webpack.optimize.UglifyJsPlugin({
      		compress : {
        		warnings: false
      		}
    	})
    	*/
	]
}