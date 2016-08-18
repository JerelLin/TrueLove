import React from "react";
import { Link } from "react-router";
import { notification, Button } from "antd";
import { checked_empty, checked_format } from "../../../../mini_function/validate.js"
import { fetch_data_post } from "../../../../mini_function/fetch.js";
import { auth_rank_redirect } from "../../../../mini_function/redirect.js";

import Slogan from "../user_auth/slogan.jsx";

import "../../../stylesheets/marriage_component/user_auth/user_auth_layout.css";
import "../../../stylesheets/marriage_component/user_auth/login.css";

class Login extends React.Component{

	constructor(props){
		super(props);
		this.state={
			login_loading : false
		};
	}

	handleSubmit(){
		let _this = this;
		this.setState({ login_loading : true });
		let phoneNumber = this.refs.phone_number.value;
		let password = this.refs.password.value;

		let checked_empty_result = checked_empty([ phoneNumber, password ]);
		let checked_format_result = checked_format([ phoneNumber, password ]);

		if(checked_empty_result == false || checked_format_result == false){
			_this.setState({ login_loading : false });
			return;
		};

		fetch_data_post("/marriage_api/login", { phoneNumber : phoneNumber, password : password })
			.then((result) => {
				_this.setState({ login_loading : false });
				if(result.body.error){
					notification["error"]({
	      				message: "错误",
	      				description: result.body.message
	    			});
	    			return;
				};
				// 登录成功
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
			<div className="login user_auth_box">
				<div className="login_main user_auth_box_main">
					<Slogan />
					<div className="login_form user_auth_form">
						<div className="login_form_title user_auth_form_title">婚介所平台</div>
					    <div className="phone_number_wrap text_input_wrap" >
					    	<input className="phone_number text_input" ref="phone_number" type="text" name="phone_number" placeholder="手机号" />
					    </div>
					    <div className="password_wrap text_input_wrap">
					    	<input className="password text_input" ref="password" type="password" name="password" placeholder="密码" />
					    </div>
					    <div className="submit_wrap">
					    	<Button type="primary" loading={ this.state.login_loading } onClick={ () => this.handleSubmit() }>登录</Button>
					    </div>
					    <div className="redirect_zone">
					    	<Link to="/marriage_app/reset_password" className="find_password">找回密码</Link>
					       	<Link to="/marriage_app/register" className="free_register">免费注册</Link>
					    </div>
				    </div>
				</div>
			</div>
		);
	};
};

export default Login;