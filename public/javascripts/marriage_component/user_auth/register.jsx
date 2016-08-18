import React from "react";
import { Link, browserHistory } from "react-router";
import { notification, Radio, Button } from "antd";
import { checked_empty, checked_format, checked_password } from "../../../../mini_function/validate.js"
import { fetch_data_post } from "../../../../mini_function/fetch.js";

import Slogan from "../user_auth/slogan.jsx";

import "../../../stylesheets/marriage_component/user_auth/user_auth_layout.css";
import "../../../stylesheets/marriage_component/user_auth/register.css";

class Register extends React.Component{

	constructor(props){
		super(props);
		this.state={
			checked : false,
			register_loading : false
		};
	}

	onChange(){
		this.setState({ checked : true });
	}

	handleSubmit(){
		let _this = this;
		this.setState({ register_loading : true });
		let phoneNumber = this.refs.phone_number.value;
		let password = this.refs.password.value;
		let confirm_password = this.refs.confirm_password.value;

		if(this.state.checked == false){
			return;
		};

		// 数据检测
		let checked_empty_result = checked_empty([ phoneNumber, password ]);
		let checked_format_result = checked_format([ phoneNumber, password ]);
		let checked_password_result = checked_password(password, confirm_password);

		if(checked_empty_result == false || checked_format_result == false || checked_password_result == false){
			_this.setState({ register_loading : false });
			return;
		};

		fetch_data_post("/marriage_api/register", { phoneNumber : phoneNumber, password : password })
			.then((result) => {
				_this.setState({ register_loading : false });
				if(result.body.error){
					notification["error"]({
	      				message: "错误",
	      				description: result.body.message
	    			});
	    			return;
				};
				// 注册成功
				localStorage.marriage_app_token = result.body.token;
				localStorage.marriage_app_auth_rank = result.body.auth;
				localStorage.marriage_app_login_state = true;

				browserHistory.push("/marriage_app/authentication");
			})
			.catch((error) => { console.log(error) });

	}

	render(){
		return(
			<div className="register user_auth_box">
				<div className="register_main user_auth_box_main">
					<Slogan />
					<div className="register_form user_auth_form">
							<div className="register_form_title user_auth_form_title">免费注册</div>
					        <div className="phone_number_wrap text_input_wrap" >
					           	<input className="phone_number text_input" ref="phone_number" type="text" name="phone_number" placeholder="手机号" />
					        </div>
					        <div className="password_wrap text_input_wrap">
					            <input className="password text_input" ref="password" type="password" name="password" placeholder="密码" />
					        </div>
					        <div className="confirm_password_wrap text_input_wrap">
					            <input className="confirm_password text_input" ref="confirm_password" type="password" name="confirm_password" placeholder="确定密码" />
					        </div>
					        <div className="agree">
					            <Radio onClick={ () => this.onChange() }>我已同意"初恋"的注册协议</Radio>
					        </div>
					        <div className="submit_wrap">
					            <Button type="primary" loading={ this.state.login_loading } onClick={ () => this.handleSubmit() }>注册</Button>
					        </div>
				    </div>
				</div>
			</div>
		);
	};
};

export default Register;