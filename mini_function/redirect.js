import { browserHistory } from "react-router";
import { notification } from "antd";

module.exports = {

	// 退出登录
	logout: function(){
		delete localStorage.marriage_app_token;
		delete localStorage.marriage_app_auth_rank;
		delete localStorage.marriage_app_login_state;
		notification["success"]({
			message: "消息",
			description: "退出成功"
		});
		browserHistory.push("/marriage_app/login");
	},

	// 根据认证状态码重定向
	auth_rank_redirect : function(nextState, replace, use_browserHistory , auth_rank){
		switch( parseInt(auth_rank) ){
			case 2:
				use_browserHistory == false ? replace("/marriage_app") : browserHistory.push("/marriage_app");
				break;
			case 1:
				use_browserHistory == false ? replace("/marriage_app/checking") : browserHistory.push("/marriage_app/checking");
				break;
			case 0:
				use_browserHistory == false ? replace("/marriage_app/authentication") : browserHistory.push("/marriage_app/authentication");
				break;
			default:
				return;
		}
	}
}