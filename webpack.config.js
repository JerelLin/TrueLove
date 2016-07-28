//webpack.config.js
var path=require("path");
var webpack=require("webpack");
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');

module.exports={
	entry: {
		/*移动端展示页*/
		mobile_homepge: "./public/entry/mobile_entry.js",
		/*PC端展示页*/	
		pc_homepage: "./public/entry/pc_entry.js",
		/*婚介管理*/																										
		marriage_app: "./public/entry/marriage_entry.js"
	},
	output: {
		//打包输出的路径 
		path: __dirname + '/public/out/',
		//打包后的名字
		filename: "[name].js",
		publicPath: "/out/"
	},
	//大于8KB的图片不会被打包
	//在对模块捆绑打包的过程中会对文件的后缀名进行检测，然后进行相应的预处理
	module: {
	          loaders: [	
	          	    { 
	          	    	test: /\.woff/, 
	          	    	loader : "url?prefix=font/&limit=10000&mimetype=application/font-woff"
	          	    }, 
		            { 
		            	test: /\.ttf/,
		            	loader : "file?prefix=font/"
		            }, 
		            { 
		            	test: /\.eot/, 
		            	loader : "file?prefix=font/"
		            }, 
		            { 
		            	test: /\.svg/, 
		            	loader : "file?prefix=font/"
		            },
		            { 
		            	test: /\.js$/, 
		            	loader : "babel",
		            	query: {presets: ["es2015"]} 
		            },
		            { 
		            	test: /\.css$/, 
		            	loader : "style!css" 
		            },
		            { 
		            	test: /\.(jpg|png|otf)$/, 
		            	loader : "url?limit=8192" 
		            },
		            { 
		            	test: /\.scss$/, 
		            	loader : "style!css!sass" 
		            },
		            { 
		            	test: /\.jsx$/, 
		            	loader : "babel", 
		            	query: {
		            		presets: ["react", "es2015"]
		            	} 
		            }
	          ]
    	},
    	resolve: {
    		//省略后缀
        	extensions: ["", ".js", ".jsx",".scss"]
    	},
    	plugins: [
    		//提取代码公共部分
			commonsPlugin
		]
}