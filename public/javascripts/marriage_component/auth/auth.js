module.exports={

	/* 已经登录过啦！*/
	already_login(nextState, replaceState){
		if(localStorage.token){
			alert("亲~ 你的token为：" + localStorage.token);
			if(localStorage.auth){
				switch(parseInt(localStorage.auth)){
					case 0:
						replaceState(null, '/marriage_app/authentication');
						break;
					case 1:
						replaceState(null, '/marriage_app/checking');
						break;
					case 2:
						replaceState(null, '/marriage_app');
						break;
					default:
						return;
				};
			}else{
				return;
			};
		}else{
			return;
		};
	},

	/* 返回登录界面 */
	redirect_to_login(nextState, replaceState){
		if(!localStorage.token){
			alert("亲~ 你还没登录哦！");
			replaceState(null, '/marriage_app/login');
		}else{
			if(localStorage.auth){
				// return;
				console.log("nextState" + nextState);
			}else{
				replaceState(null, '/marriage_app/login');
			};
		};
	},

	/* 注销 */
	logout(nextState, replaceState){
		delete localStorage.token;
		delete localStorage.auth;
		replaceState(null, '/marriage_app/login');
	}

}