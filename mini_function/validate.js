import { notification } from "antd";

module.exports = {
	// 检查是否有数据为空，user_defined为自定义提示消息
	checked_empty : function(data_arr, user_defined){
		for(let i=0; i<data_arr.length; i++){
			if(data_arr[i].length == 0 || typeof(data_arr[i]) == "undefined"){
				notification["warning"]({
      				message: "提示",
      				description: user_defined == undefined ? "全部填完吧" : user_defined
    			});
				return false;
			}
		};
	},

	// 检查数据格式是否正确
	checked_format : function(data_arr, user_defined){
		// 不能为汉字
		for(let i=0; i<data_arr.length; i++){
			if(new RegExp("[\\u4E00-\\u9FFF]+","g").test(data_arr[i])){
				notification["warning"]({
      				message: "提示",
      				description: user_defined == undefined ? "输入格式有误" : user_defined
    			});
				return false;
			}
		};
	},

	// 检查两次输入密码是否相同
	checked_password(password, confirm_password){
		if(password != confirm_password){
			notification["warning"]({
      			message: "提示",
      			description: "两次输入密码不一致",
    		});
			return false;
		}
	}
}