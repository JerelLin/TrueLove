let express = require('express');
let router = express.Router();

// 虚拟数据
let data = require("../data.js");

// 婚恋管理应用
router.get("/marriage_app", function(req, res, next) {
  res.render("marriage_app", { title: "初恋" });
});
router.get("/marriage_app/*", function(req, res, next) {
  res.render("marriage_app", { title: "初恋" });
});

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
	res.json({
		user_profile : data.user_profile
	});
});

// 获取消息列表
router.get("/marriage_api/init_news", function(req, res, next){
	res.json({ 
		news_list_data : data.news_list_data
	});
});

// 获取消息详情( 根据 news_id 获取消息详情 )
router.get("/marriage_api/get_news_detail", function(req, res, next){
	res.json({ news_detail : data.news_detail });
});

// 消息删除( 根据 news_id 删除消息 )
router.get("/marriage_api/delete_news", function(req, res, next){
	res.json({ message : "消息删除成功", news_list_data : [  ] });
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
	res.json({ message : "素材删除成功", material_list_total : 0, material_list_data : [  ] });
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
	res.json({ message : "活动删除成功", activity_list_total : 0, activity_list_data : [  ] });
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
	res.json({ page_analysis_data : { homepage_total_flow : data.homepage_total_flow, homepage_recent_flow : data.homepage_recent_flow, homepage_user_property : data.homepage_user_property } });
});

// 活动分析数据
router.get("/marriage_api/get_activity_analysis_data", function(req, res, next){
	res.json({ activity_analysis_data : { activity_flow : data.activity_flow } });
});

module.exports = router;
