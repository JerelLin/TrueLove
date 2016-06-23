//webpack.config.js
var path=require("path");
var webpack=require("webpack");
// var ExtractTextPlugin = require("extract-text-webpack-plugin");
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');

module.exports={
	entry: {
		mobile_homepge: "./public/entry/mobile_entry.js",			/*移动端展示页*/
		pc_homepage: "./public/entry/pc_entry.js",				/*PC端展示页*/																												
		login_page:  "./public/entry/login_entry.js",				/*登录页*/
		register_page:  "./public/entry/register_entry.js",				/*注册页*/
		reset_password_page:  "./public/entry/reset_password_entry.js",	/*找回密码*/
		marriage_app: "./public/entry/marriage_entry.js"				/*婚介管理*/
	},
	output: {
		path: __dirname + '/public/out/',   					//打包输出的路径 
		filename: "[name].js",                   					//打包后的名字
		publicPath: "/out/"
	},
	//大于8KB的图片不会被打包，所以一般会被打包的都是一些icon图标或者logo什么的
	//在对模块捆绑打包的过程中会对文件的后缀名进行检测，然后进行相应的预处理
	module: {
	          loaders: [	
	          	            { test: /\.woff/,loader : 'url?prefix=font/&limit=10000&mimetype=application/font-woff' }, 
		            { test: /\.ttf/,loader : 'file?prefix=font/' }, 
		            { test: /\.eot/,loader : 'file?prefix=font/' }, 
		            { test: /\.svg/,loader : 'file?prefix=font/' },
		            { test: /\.js$/, loader : "babel",query: {presets: ['es2015']} },
		            { test: /\.css$/, loader : "style!css" },
		            { test: /\.(jpg|png|otf)$/, loader : "url?limit=8192" },
		            { test: /\.scss$/, loader : "style!css!sass" },
		            { test: /\.jsx$/,loader : 'babel', query: {presets: ['react', 'es2015']} }
	          ]
    	},
    	resolve: {
        		extensions: ['', '.js', '.jsx','.scss']    					//省略后缀
    	},
    	plugins: [
		commonsPlugin,							//提取代码公共部分
	]
};