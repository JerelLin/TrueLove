let express = require( "express" );
let upload = require( "../mini_function/upload.js" );

let router = express.Router(  );

// 虚拟数据
let data = require( "../data.js" );

// 婚恋管理应用
router.get("/marriage_app", function(req, res, next) {
	res.render("marriage_app", { title: "初恋" });
});
router.get("/marriage_app/*", function(req, res, next) {
	res.render("marriage_app", { title: "初恋" });
});

// 所有的修改删除请求 post请求返回值统一携带 message 和 error 参数

// 登录
router.post("/marriage_api/login", function(req, res, next){
	let return_data = { message : "登录成功", error : false, token : "love_token", auth : 2 };
	res.json(return_data);
});

// 注册
router.post("/marriage_api/register", function(req, res, next){
	let return_data = { message : "注册成功", error : false, token : "love_token", auth : 0 };
	res.json(return_data);
});

// 获取验证码
router.get("/marriage_api/get_checked_code", function(req, res, next){
	res.json({ message : "验证码已成功发送到您的手机，请注意查收", error : false });
});

// 重设密码
router.post("/marriage_api/reset_password", function(req, res, next){
	res.json({ message : "密码修改成功", error : false, token : "love_token", auth : 2 });
});

// 获取用户头像已及昵称
router.get("/marriage_api/init_user_profile", function(req, res, next){
	res.json({ user_profile : data.user_profile });
});

// 获取消息列表
router.get("/marriage_api/init_news", function(req, res, next){
	res.json({ news_list_data : data.news_list_data });
});

// 获取消息详情( 根据 news_id 获取消息详情 )
router.get("/marriage_api/get_news_detail", function(req, res, next){
	res.json({ news_detail : data.news_detail });
});

// 消息删除( 根据 news_id 删除消息 )
router.get("/marriage_api/delete_news", function(req, res, next){
	res.json({ message : "消息删除成功", error : false, news_list_data : [  ] });
});

// 上传图片
 router.post("/marriage_api/upload", function( req, res, next ){
 	function finish_upload(  ){
 		return new Promise(( resolve, reject ) => {
			upload( req, resolve, reject )
		})
 	}
 	finish_upload(  )
	 	.then(( result ) => {
	 		console.log( result )
	 		res.end( result.fileList[ 0 ] )
	 	})
	 	.catch(( error ) => console.log( error ))
 });

 // 保存素材
 router.post("/marriage_api/save_material", function( req, res, next ){
 	function finish_save_material(  ){
 		return new Promise(( resolve, reject ) => {
			upload( req, resolve, reject )
		})
 	}
 	finish_save_material(  )
	 	.then(( result ) => {
	 		console.log( result )
	 		res.json({ message : "素材保存成功", error : false })
	 	})
	 	.catch(( error ) => console.log( error ))
 });

 // 发布活动
 router.post("/marriage_api/publish_activity", function( req, res, next ){
 	function finish_publish_activity(  ){
 		return new Promise(( resolve, reject ) => {
			upload( req, resolve, reject )
		})
 	}
 	finish_publish_activity(  )
	 	.then(( result ) => {
	 		console.log( result )
	 		res.json({ message : "发布成功", error : false })
	 	})
	 	.catch(( error ) => console.log( error ))
 });

// 初始化素材数据
router.get("/marriage_api/init_material", function(req, res, next){
	res.json({
		material_list_total : data.material_list_total,
		material_list_data : data.material_list_data
	});
});

// 删除素材
router.get("/marriage_api/delete_material", function(req, res, next){
	res.json({ message : "素材删除成功", error : false, material_list_total : 0, material_list_data : [  ] });
});

// 初始化活动数据
router.get("/marriage_api/init_activity", function(req, res, next){
	res.json({
		activity_list_total : data.activity_list_total,
		activity_list_data : data.activity_list_data
	});
});

// 删除活动( 删除指定ID活动 返回当前页数更新后的活动数据 )
router.get("/marriage_api/delete_activity", function(req, res, next){
	// 先调用根据ID删除指定活动的借口 成功后再调用根据当前页数返回活动数据的借口
	res.json({ message : "活动删除成功", error : false, activity_list_total : 0, activity_list_data : [  ] });
});

// 获取活动详情( 根据 activity_id 获取活动详情 )
router.get("/marriage_api/get_activity_detail", function(req, res, next){
	// 活动信息和评论数据、报名数据分开获取 通过调用不同借口
	let activity_detail = data.activity_detail;
	activity_detail.activity_comment = data.activity_comment;
	res.json({ activity_detail : data.activity_detail });
});

// 主页分析数据
router.get("/marriage_api/get_page_analysis_data", function(req, res, next){
	// 累计流量统计数据和近期流量统计数据从不同接口获取
	res.json({ 
		page_analysis_data : { 
			homepage_total_flow : data.homepage_total_flow, 
			homepage_recent_flow : data.homepage_recent_flow, 
			homepage_user_property : data.homepage_user_property 
		} 
	});
});

// 活动分析数据
router.get("/marriage_api/get_activity_analysis_data", function(req, res, next){
	res.json({ 
		activity_analysis_data : { 
			activity_flow : data.activity_flow, 
			activity_brief : data.activity_brief,
			activity_user_property : data.activity_user_property 
		}
	});
});

// 修改资料 => 初始化用户信息
router.get("/marriage_api/init_user_profile_detail", function( req, res, next ){
	res.json({ user_profile_detail : data.user_profile_detail })
});

// 修改资料 => 提交（图片保存至七牛云存储 返回图片链接）
router.post("/marriage_api/change_user_profile", function( req, res, next ){
	function finish_change_user_profile(  ){
 		return new Promise(( resolve, reject ) => {
			upload( req, resolve, reject )
		})
 	}
 	finish_change_user_profile(  )
	 	.then(( result ) => {
	 		console.log( result )
	 		res.json({ message : "资料修改成功", error : false })
	 	})
	 	.catch(( error ) => console.log( error ))
});

// 修改密码
router.post("/marriage_api/change_password", function( req, res, next ){
	res.json({ message : "密码修改成功", error : false });
});

// 意见反馈
router.post("/marriage_api/feedback", function( req, res, next ){
	res.json({ message : "感谢你的反馈，我们会仔细看的！", error : false });
});

// 关于初恋
router.get("/marriage_api/about_truelove", function( req, res, next ){
	res.json({ about_truelove : data.about_truelove });
});

module.exports = router;
