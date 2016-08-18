import { auth_rank_redirect } from "../../../mini_function/redirect.js";

module.exports = {

	// 渲染登录、注册、找回密码界面时的钩子
	already_login(nextState, replace){
		if(localStorage.marriage_app_login_state){
			auth_rank_redirect(nextState, replace, false, localStorage.marriage_app_auth_rank);
		}else{
			return;
		}
	},

	// 渲染认证界面时的钩子
	authentication_enter(nextState, replace){
		if(localStorage.marriage_app_login_state && parseInt(localStorage.marriage_app_auth_rank) == 0){
			return;
		}else{
			replace("/marriage_app/login");
		};
	},

	// 渲染认证中界面时的钩子
	checking_enter(nextState, replace){
		if(localStorage.marriage_app_login_state && parseInt(localStorage.marriage_app_auth_rank) == 1){
			return;
		}else{
			replace("/marriage_app/login");
		};
	},

	// 渲染主应用时的钩子
	marriage_app_enter(nextState, replace){
		if(localStorage.marriage_app_login_state && parseInt(localStorage.marriage_app_auth_rank) == 2){
			return;
		}else{
			replace("/marriage_app/login");
		};
	}

}