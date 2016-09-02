import React from "react";
import { notification, Button } from "antd";
import { checked_empty, checked_format, checked_password } from "../../../../mini_function/validate.js"
import { fetch_data_get, fetch_data_post } from "../../../../mini_function/fetch.js";
import { auth_rank_redirect } from "../../../../mini_function/redirect.js";

import Slogan from "../user_auth/slogan.jsx";

import "../../../stylesheets/marriage_component/user_auth/user_auth_layout.css";
import "../../../stylesheets/marriage_component/user_auth/reset_password.css";

class Reset_password extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			code_loading : false,
			reset_loading : false
		};
	}

	// 获取手机验证码
	get_checked_code(){
		let _this = this;
		this.setState({ code_loading : true });
		let phoneNumber = this.refs.phone_number.value;

		let checked_empty_result = checked_empty([ phoneNumber ], "手机号码不能为空");
		let checked_format_result = checked_format([ phoneNumber ]);

		if(checked_empty_result == false || checked_format_result == false){
			_this.setState({ code_loading : false });
			return;
		};

		fetch_data_get("/marriage_api/get_checked_code", { phoneNumber : phoneNumber })
			.then((result) => {
				_this.setState({ code_loading : false });
				if(result.body.error){
					notification["error"]({
		      				message: "错误",
		      				description: result.body.message
		    			});
	    				return;
				}
				notification["success"]({
		      			message: "成功",
		      			description: result.body.message
		    		})
			})
			.catch((error) => { console.log(error) });
	}

	// 提交表单
	handleSubmit(){
		let _this = this;
		this.setState({ reset_loading : true });

		let phoneNumber = this.refs.phone_number.value;
		let checkedCode = this.refs.checked_code.value;
		let password = this.refs.password.value;
		let confirm_password = this.refs.confirm_password.value;

		let checked_empty_result = checked_empty([ phoneNumber, checkedCode, password, confirm_password ]);
		let checked_format_result = checked_format([ phoneNumber, checkedCode, password, confirm_password ]);
		let checked_password_result = checked_password(password, confirm_password);

		if(checked_empty_result == false || checked_format_result == false || checked_password_result == false){
			_this.setState({ reset_loading : false });
			return;
		};

		fetch_data_post("/marriage_api/reset_password", { phoneNumber : phoneNumber, password : password, checkedCode : checkedCode })
			.then((result) => {
				_this.setState({ reset_loading : false });
				if(result.body.error){
					notification["error"]({
	      				message: "错误",
	      				description: result.body.message
	    			});
	    			return;
				};
				// 修改密码成功
				notification["success"]({
	      			message: "成功",
	      			description: result.body.message
	    		});
				localStorage.marriage_app_token = result.body.token;
				localStorage.marriage_app_auth_rank = result.body.auth;
				localStorage.marriage_app_login_state = true;

				// 根据auth_rank进行重定向
				auth_rank_redirect(null, null, true, result.body.auth);
			})
			.catch((error) => { console.log(error) });
	}

	render(){
		return(
			<div className="reset_password user_auth_box">
				<div className="reset_password_main user_auth_box_main">
					<Slogan />
					<div className="reset_password_form user_auth_form">
						<div className="reset_password_form_title user_auth_form_title">找回密码</div>
					    <div className="phone_number_wrap text_input_wrap">
					        <input className="phone_number text_input" ref="phone_number" type="text" name="phone_number" placeholder="手机号" />
					        <Button className="checking_code_btn" type="primary" loading={ this.state.code_loading } onClick={ () => this.get_checked_code() }>获取验证码</Button>
					    </div>
					    <div className="checked_code_wrap text_input_wrap">
					       	<input className="checked_code text_input" ref="checked_code" type="text" name="checked_code" placeholder="输入验证码" />
					    </div>
					    <div className="password_wrap text_input_wrap">
					        <input className="password text_input" ref="password" type="password" name="password" placeholder="新密码" />
					    </div>
					    <div className="confirm_password_wrap text_input_wrap">
					        <input className="confirm_password text_input" ref="confirm_password" type="password" name="confirm_password" placeholder="确定密码" />
					    </div>
					    <div className="submit_wrap">
					        <Button type="primary" loading={ this.state.reset_loading } onClick={ () => this.handleSubmit() }>确认</Button>
					    </div>
				    </div>
				</div>
			</div>
		);
	};
};

export default Reset_password;