module.exports={

	/*token为空！请登录！请认证！*/
	redirectToLogin(nextState, replaceState){
		alert(localStorage.token);
		if(!localStorage.token || localStorage.token==""){
			alert(" 请登录! ");
			replaceState(null, '/marriage_app/login');
		}else if(parseInt(localStorage.auth)==0){
			replaceState(null, '/marriage_app/authentication');
		}else if(parseInt(localStorage.auth)==1){
			replaceState(null, '/marriage_app/checking');
		}else{
			return;
		};
	},

	/*token不为空！已经登录过啦！*/
	redirectToApp(nextState, replaceState){
		if(localStorage.token && localStorage.token!=""){
			replaceState(null, '/marriage_app');
		}else{
			return;
		};
	},

	/*注销！清空 token！*/
	logout(nextState, replaceState){
		alert("logout");
		delete localStorage.token;
		replaceState(null, '/marriage_app/login');
	}
}