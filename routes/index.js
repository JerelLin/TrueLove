var express = require('express');
var router = express.Router();
var fs=require('fs');
var path=require("path");
var request = require('superagent');
var formidable = require('formidable');

var BASE_HOST = "192.168.1.115:8000/truelove/v1/agency_admin";

/*
*********************************************************************************
*=>页面渲染
*********************************************************************************
 */

/* GET home page. */
router.get('/', function(req, res, next) {
  	res.render('index', { title: 'True Love' });
});

/* GET mobile home page. */
router.get('/mobile', function(req, res, next) {
  	res.render('mobile_index', { title: 'True Love' });
});

/* GET marriage_app. */
router.get('/marriage_app', function(req,res,next){
	res.render('marriage_app', { title: 'True Love' });
});
router.get('/marriage_app/*', function(req,res,next){
	res.render('marriage_app', { title: 'True Love' });
});

/*
*********************************************************************************
*=>页面渲染-end
*********************************************************************************
 */


/*
*********************************************************************************
*=>登录、注册、密码找回、注销
*********************************************************************************
 */

/*login
	还未注册 : { message: 0 }
	密码错误 : { message: 1 }
	登录成功 : { message: 2 }
*/
router.post("/login", function(req, res, next){
	// function login(){
	// 	return new Promise((resolve, reject) => {
	// 		request.post(BASE_HOST + "/merry_login")
	// 			.set('Content-Type', 'application/x-www-form-urlencoded')
	// 			.send(req.body)
	// 			.end((error, res) => {
	// 				error ? reject(error) : resolve(res);
	// 			});
	// 	});
	// };
	// login().then((result) => {
	// 	var return_data = {};
	// 	var text=JSON.parse(result.text);
	// 	switch(parseInt(text.message)){
	// 		case 0:
	// 			return_data = { message : "还未注册", error : true };
	// 			break;
	// 		case 1:
	// 			return_data = { message : "密码错误", error : true };
	// 			break;
	// 		case 2:
	// 			return_data = { message : "登录成功", error : false, token : text.token, auth : text.auth };
	// 			break;
	// 		default :
	// 			return_data = { message : "亲~ 好像出了点问题呢？", error : true };
	// 			break;
	// 	};
	// 	res.json(return_data);
	// });
	// var return_data = { message : "还未注册", error : true };
	// var return_data = { message : "密码错误", error : true };
	var return_data = { message : "登录成功", error : false, token : "love_token", auth : 0 };
	// var return_data = { message : "亲~ 好像出了点问题呢？", error : true };
	res.json(return_data);
});

/*register
    已被注册 : { message: 0 }
	注册成功 : { message: 1 }
*/
router.post("/register", function(req, res, next){
	// function register(){
	// 	return new Promise((resolve, reject) => {
	// 		request.post(BASE_HOST+"/merry_register")
	// 			.set('Content-Type', 'application/x-www-form-urlencoded')
	// 			.send(req.body)
	// 			.end((error, res) => {
	// 				error ? reject(error) : resolve(res);
	// 			});
	// 	});
	// };
	// register().then((result) => {
	// 	var return_data = {};
	// 	var text = JSON.parse(result.text);
	// 	switch(parseInt(text.message)){
	// 		case 0:
	// 			return_data = { message : "手机号码已被注册", error : true };
	// 			break;
	// 		case 1:
	// 			return_data = { message : "注册成功", error : false, token : text.token, auth : 0 };
	// 			break;
	// 		default :
	// 			return_data = { message : "亲~ 好像出了点问题呢？", error : true };
	// 			break;
	// 	};
	// 	res.json(return_data);
	// });
	// var return_data = { message : "手机号码已被注册", error : true };
	var return_data = { message : "注册成功", error : false, token : "love_token", auth : 0 };
	// var return_data = { message : "亲~ 好像出了点问题呢？", error : true };
	res.json(return_data);
});

/*reset_password*/
router.post("/reset_password", function(req, res, next){
	console.log(req.body);
	res.json({ message : "密码修改成功!" });
});

/*发送验证码*/
router.get("/sendCheckedCode", function(req, res, next){
	res.end("发送验证码");
});

/*检测验证码*/
router.get("/CheckedCodeIsTure", function(req, res, next){
	res.end("检测验证码");
});

/*
*********************************************************************************
*=>登录、注册、密码找回-end
*********************************************************************************
 */


/*
*********************************************************************************
*=>功能api
*********************************************************************************
 */

/*头部组件数据初始化*/
router.get('/initUserProfile', function(req,res,next){
	function initUserProfile(){
		return new Promise((resolve, reject) => {
			request.get(BASE_HOST +"/initUserProfile")
				.query(req.query)
				.end((error, res) => {
					error ? reject(error) : resolve(res);
				});
			});
	};
	initUserProfile().then((result) => {
		var text=JSON.parse(result.text);
		if(text.message&&parseInt(text.message)==0){
			res.json({ 
				user_profile : {
					header : null,
					user_name : null
				}
			 });
		};
		res.json({user_profile : text.user_profile});
	});
});

/*消息列表初始化 、消息分页*/
router.get('/initNews', function(req,res,next){
	function initNews(){
		return new Promise((resolve, reject) => {
			request.get(BASE_HOST+"/initNews")
				.query(req.query)
				.end((error, res) => {
					error ? reject(error) : resolve(res);
				});
			});
	};
	initNews().then((result) => {
		var text=JSON.parse(result.text);
		if(text.message&&parseInt(text.message)==0){
			res.json({ 
				newsList : {
					news : null,
					pages : 0
				}
			 });
		};
		console.log(text.newsList);
		res.json({newsList : text.newsList});
	});
});

/*消息删除*/
router.get("/deleteNews", function(req,res,next){
	function deleteNews(){
		return new Promise((resolve, reject) => {
			request.get(BASE_HOST+"/deleteNews")
				.query(req.query)
				.end((error, res) => {
					error ? reject(error) : resolve(res);
				});
			});
	};
	deleteNews().then((result) => { 
		var text=JSON.parse(result.text);
		if(text.message&&parseInt(text.message)==0){
			res.json({ 
				newsList : {
					news : null,
					pages : 0
				}
			 });
		};
		res.json({newsList : text.newsList});
	});
});

/*活动发布*/
router.post('/publish', function(req, res, next){
	var fields = [ ];
	var files   = [ ];
	var form  = new formidable.IncomingForm();
	form.encoding = 'utf-8';
	form.maxFieldsSize = 2 * 1024 * 1024;
	form.keepExtensions= true;             							//保留后缀格式
	form.uploadDir = 'public/uploads/';
	form
		.on('error', function(err) {
		        	console.log(err); 								//各种错误
		})
		.on('field', function(field,value){
			console.log(field,value);
			fields.push({field,value});
		})
		.on('file', function(field,file){
			console.log( field,file );
			files.push( { field,file } );
		})
		.on('end', function(){
			console.log('=> upload done');
			console.log(fields);
			console.log(files);
			files.map(function(file){								//重命名文件
				fs.rename(file.file.path,form.uploadDir+file.file.name,function(err){
					if(err){
						throw err;
					};
				});
			});
			request.post("127.0.0.1:8000/publish")
				.send({
					fields : fields,
					files   : files
				})
				.end(function(err,res){
					if(err || !res.ok){
						console.log(err);
						return false;
					}
					console.log("数据已转发");
				});
		});
	form.parse(req);
	res.end();
});

/*upload*/
router.post('/upload', function(req,res,next){
	var url  = " ";
	var fields =[ ];
	var files   =[ ];
	var form  = new formidable.IncomingForm();
	form.encoding = 'utf-8';
	form.maxFieldsSize   = 2 * 1024 * 1024;
	form.keepExtensions = true;             							//保留后缀格式
	form.uploadDir = 'public/uploads/';
	form
		.on('error', function(err) {
		        	console.log(err); 								//各种错误
		})
		.on('field', function(field,value){
			// console.log( field,value );
			fields.push( { field,value } );
		})
		.on('file', function(field,file){
			files.push( { field,file } );
		})
		.on('end', function(){
			console.log('显示上传时的参数 begin');
			console.log( req );
			console.log('显示上传时的参数 end');
			// console.log( fields );
			// console.log( files );
			files.map(function(file){								//重命名文件
				fs.rename(file.file.path,form.uploadDir+file.file.name,function(err){
					url=" http://127.0.0.1:3000/uploads/" + file.file.name;''
					res.end(url);
					if(err){
						throw err;
					};
				});
			});
		});
	form.parse(req);
});

/*活动保存*/
router.post('/save', function(req,res,next){
	request.post("127.0.0.1:8000/save")
		.send(req.body)
		.end(function(err,res){
			console.log("保存请求已经转发");
		});
	res.end();
});

/*初始化素材列表*/
router.get("/initMaterial", function(req,res,next){
	request.get("127.0.0.1:8000/initMaterial")
		.accept('application/json')
		.end(function(err,res){
			console.log("初始化素材列表请求已经转发");
		});
	res.end();
});

/*活动素材删除*/
router.post("/deleteMaterial", function(req,res,next){
	request.post("127.0.0.1:8000/deleteMaterial")
		.type('application/json')
		.send(req.body)
		.end(function(err,res){
			console.log("活动素材删除请求已经转发");
		});
	res.end();
});

/*获取素材内容（不是初始化加载所有素材）*/
router.get("/getMaterial", function(req,res,next){
	request.get("127.0.0.1:8000/getMaterial")
		.accept('application/json')
		.query(req.query)	/*转发查询参数*/
		.end(function(err,res){
			console.log("获取素材内容请求已经转发");
		});
	res.end();
});

/*初始化活动列表*/
router.get("/initActivity", function(req,res,next){
	request.get("127.0.0.1:8000/initActivity")
		.accept('application/json')
		.end(function(err,res){
			console.log("初始化活动列表请求已经转发");
		});
	res.end();
});

/*活动删除*/
router.post("/deleteActivity", function(req,res,next){
	request.post("127.0.0.1:8000/deleteActivity")
		.type('application/json')
		.send(req.body)
		.end(function(err,res){
			console.log("活动删除请求已经转发");
		});
	res.end();
});

/*获取活动详情内容（不是初始化加载所有活动）*/
router.get("/getActivityDetail", function(req,res,next){
	request.get("127.0.0.1:8000/getActivityDetail")
		.accept('application/json')
		.query(req.query)	/*转发查询参数*/
		.end(function(err,res){
			console.log("获取活动详情内容请求已经转发");
		});
	res.end();
});

/*
*********************************************************************************
*=>功能api-end
*********************************************************************************
 */


/*
*********************************************************************************
*=>统计api
*********************************************************************************
 */

/*初始化主页增长数据(默认获取近七天数据)*/
router.get("/initPageGrow", function(req,res,next){
	request.get("127.0.0.1:8000/initPageGrow")
		.accept('application/json')
		.end(function(err,res){
			console.log("初始化主页增长数据的请求已经转发");
		});
	res.end();
});

/*主页增长 : 根据天数获取相应数据*/
router.get("/getFlowByDate", function(req,res,next){
	request.get("127.0.0.1:8000/getFlowByDate")
		.accept('application/json')
		.query(req.query)
		.end(function(err,res){
			console.log("根据天数获取相应数据的请求已经转发");
			console.log(req.body);
		});
	res.end();
});

/*初始化主页用户属性数据(默认都是获取主页访问次数的数据)*/
router.get("/initPageProperty", function(req,res,next){
	request.get("127.0.0.1:8000/initPageProperty")
		.accept('application/json')
		.end(function(err,res){
			console.log("初始化主页用户属性数据的请求已经转发");
		});
	res.end();
});

/*主页用户属性访问流量*/
router.get("/PagePropertyFlow", function(req,res,next){
	request.get("127.0.0.1:8000/PagePropertyFlow")
		.accept('application/json')
		.query(req.query)
		.end(function(err,res){
			console.log("主页用户属性访问流量");
		});
	res.end();
});

/*初始化活动增长数据(默认获取近七天数据)*/
router.get("/initActivityGrow", function(req,res,next){
	request.get("127.0.0.1:8000/initActivityGrow")
		.accept('application/json')
		.end(function(err,res){
			console.log("初始化活动增长数据的请求已经转发");
		});
	res.end();
});

/*活动增长 : 根据天数获取相应数据(近七天活动or近十四天活动)*/
router.get("/getActivityByDate", function(req,res,next){
	request.get("127.0.0.1:8000/getActivityByDate")
		.accept('application/json')
		.query(req.query)
		.end(function(err,res){
			console.log("根据天数获取相应活动的请求已经转发");
		});
	res.end();
});

/*初始化活动用户属性数据(默认都是获取活动阅读次数的数据)*/
router.get("/initActivityProperty", function(req,res,next){
	request.get("127.0.0.1:8000/initActivityProperty")
		.accept('application/json')
		.end(function(err,res){
			console.log("初始化活动用户属性数据的请求已经转发");
		});
	res.end();
});

/*活动属性 : 根据用户选项返回相应流量数据*/
router.get("/ActivityPropertyFlow", function(req,res,next){
	request.get("127.0.0.1:8000/ActivityPropertyFlow")
		.accept('application/json')
		.query(req.query)
		.end(function(err,res){
			console.log("根据用户选项返回相应流量数据的请求已经转发");
		});
	res.end();
});

/*
*********************************************************************************
*=>统计api-end
*********************************************************************************
 */


/*
*********************************************************************************
*=>设置api
*********************************************************************************
 */
/*修改资料：初始化用户资料*/
router.get("/initProfile", function(req,res,next){
	request.get("127.0.0.1:8000/initProfile")
		.accept('application/json')
		.end(function(err,res){
			console.log("初始化用户资料的请求已经转发");
		});
	res.end();
});

/*修改资料：提交修改信息*/
router.post("/editProfile", function(req,res,next){
	console.log(req.body);
	request.post("127.0.0.1:8000/editProfile")
		.send(req.body)
		.end(function(err,res){
			console.log("修改请求已经转发");
		});
	res.end();
});

/*修改密码：检测原密码是否正确*/
router.get("/checkPassword", function(req,res,next){
	var checked=null;
	function checkPassword(){
		return new Promise((resolve, reject) => {
			request.get("127.0.0.1:8000/checkPassword")
				.accept('application/json')
				.query(req.query)
				.end((error, res) => {
					error ? reject(error) : resolve(res);
				});
		});
	};
	checkPassword().then((result) => {
		checked=result.body.checked;
		res.json({checked : checked});
	});
});

/*修改密码：提交修改信息*/
router.post("/changePassword", function(req,res,next){
	console.log(req.body);
	request.post("127.0.0.1:8000/changePassword")
		.send(req.body)
		.end(function(err,res){
			console.log("修改请求已经转发");
		});
	res.end();
});

/*反馈：提交反馈信息*/
router.post("/feedback", function(req,res,next){
	console.log(req.body);
	request.post("127.0.0.1:8000/feedback")
		.send(req.body)
		.end(function(err,res){
			console.log("反馈：提交反馈信息请求已经转发");
		});
	res.end();
});

/*
*********************************************************************************
*=>设置api-end
*********************************************************************************
 */


/*分页*/

router.get("/getPageMaterial", function(req,res,next){
	console.log(req.query);
	res.end();
});

router.get("/getPageActivity", function(req,res,next){
	console.log(req.query);
	res.end();
});

router.get("/getPageComment", function(req,res,next){
	console.log(req.query);
	res.end();
});

module.exports = router;
