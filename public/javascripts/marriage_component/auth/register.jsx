import React from "react";
import ReactDOM from "react-dom";
import request from "superagent";

import "../../../stylesheets/marriage_component/auth/register.css";

class Register extends React.Component{

	constructor(props){
		super(props);
		this.state={
			errMess : null,
			registerState : "确定"
		};
	}

	/*点击注册按钮时触发验证*/
	handleRegister(event){
		var _this=this;
		event.preventDefault();
		var phoneNumber=this.refs.phone_number.value;
		var password=this.refs.password.value;
		var confirm_password=this.refs.confirm_password.value;
		var checkbox=this.refs.checkbox;

		if(checkbox.checked == false){
			return false;
		};
		if(phoneNumber.length == 0 || password.length == 0 || confirm_password.length == 0){
			this.setState({ errMess : "亲~表单信息请填写完整哦~" });
			this.refs.errMess.style.display="block";
			return false;
		}else if(!new RegExp("^[0-9]*$").test(phoneNumber)){
			this.setState({ errMess : "亲~手机号码的格式不对哦~" });
			this.refs.errMess.style.display="block";
			return false;
		}else if(new RegExp("[\\u4E00-\\u9FFF]+","g").test(password)){
			this.setState({ errMess : "亲~密码的格式不对哦~" });
			this.refs.errMess.style.display="block";
			return false;
		}else if(password != confirm_password){
			this.setState({ errMess : "亲~两次输入的密码不一样哦~" });
			this.refs.errMess.style.display="block";
			return false;
		};

		this.setState({ registerState : "请等一下~ " });
		this.refs.submit.disabled=true;

		request.post("/register")
			.send({
				phoneNumber : phoneNumber,
				password : password
			})
			.end(function(err,res){
				if(err || !res.ok){
					console.log(err);
					return false;
				};
				//已经注册过了、注册成功
				_this.setState({
					errMess : res.body.message
				});
				_this.refs.errMess.style.display="block";
				//注册失败
				if(res.body.error){
					_this.setState({ registerState : "确定" });
					_this.refs.submit.disabled=false;
					return false;
				};
				//存储token
				localStorage.token = res.body.token;
				//存储auth
				localStorage.auth = res.body.auth;
				setTimeout(function(){
					_this.props.history.replaceState(null, '/marriage_app/authentication');
				},2000);
			});
	}

	render(){
		return(
			<div className="register">
				<div className="authErrMess" ref="errMess">{ this.state.errMess }</div>
				<div className="register_main">
					<div className="decoration">
						<div className="appName">初恋</div>
						<div className="appSlogan">在这里，遇见最美的初恋</div>
					</div>
					<form className="register_form" method="post">
						<div className="register_form_title">免费注册</div>
					             <div className="phone_number_wrap" >
					             	<input className="phone_number text_input" ref="phone_number" type="text" name="phone_number" placeholder="手机号" />
					             </div>
					             <div className="password_wrap">
					             	<input className="password text_input" ref="password" type="password" name="password" placeholder="密码" />
					             </div>
					             <div className="confirm_password_wrap">
					             	<input className="confirm_password text_input" ref="confirm_password" type="password" name="confirm_password" placeholder="确定密码" />
					             </div>
					             <div className="agree">
					             	<input type="checkbox" className="checkbox" id="checkbox" ref="checkbox"/>
				                		<label htmlFor="checkbox" className="checkbox_label">我已同意"初恋"的注册协议</label>
					             </div>
					             <div className="submit_wrap">
					             	<input className="submit" id="submit" ref="submit" type="submit" name="submit" value={ this.state.registerState } onClick={ (event) => this.handleRegister(event) }/>
					             </div>
				          	</form>
				</div>
			</div>
		);
	};
};

export default Register;