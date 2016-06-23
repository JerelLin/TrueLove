import React from "react";
import request from "superagent";

import "../stylesheets/reset_password.css";

class Reset_password extends React.Component{

	constructor(props){
		super(props);
		this.state={
			checkedButtonState : "点击获取验证码",
			errMess : null 		//消息提醒
		};
	}

	/*发送验证码*/
	sendCheckedCode(){
		var _this=this;
		var phoneNumber=this.refs.phone_number.value;
		_this.refs.get_checked_code.disabled=true;
		if(phoneNumber.length==0){
			this.setState({ errMess : "亲~请填写手机号码~" });
			this.refs.errMess.style.display="block";
			_this.refs.get_checked_code.disabled=false;
			return false;
		};
		if(!new RegExp("^[0-9]*$").test(phoneNumber)){
			this.setState({ errMess : "亲~手机号码的格式不对哦~" });
			this.refs.errMess.style.display="block";
			_this.refs.get_checked_code.disabled=false;
			return false;
		};
		request.get("/sendCheckedCode")
			.query({ phoneNumber : phoneNumber })
			.end(function(err,res){
				if(err || !res.ok){
					console.log(err);
					_this.refs.get_checked_code.disabled=false;
					return false;
				};
				_this.setState({
					errMess : res.body.message  		//该手机号码还没注册、已经成功向该手机号码发送验证码，请注意查看
				});
				_this.refs.errMess.style.display="block";
				if(res.body.message=="该手机号码还没注册"){
					_this.refs.get_checked_code.disabled=false;
					return false;
				}else{
					var deadline=60;
					var timer=setInterval(function(){
						_this.setState({
							checkedButtonState : deadline-- + " s 后重新发送"
 						});
 						if(deadline < 0){
 							clearInterval(timer);
 							_this.setState({
								checkedButtonState : "点击获取验证码"
	 						});
	 						_this.refs.get_checked_code.disabled=false;
	 						return;
 						};
					},1000);
				};
			});
	}

	/*点击确认按钮时触发验证*/
	handleReset(event){
		var _this=this;
		event.preventDefault();
	
		var phoneNumber=this.refs.phone_number.value;
		var checkedCode=this.refs.checked_code.value;
		var password=this.refs.password.value;
		var confirmPassword=this.refs.confirm_password.value;

		if(phoneNumber.length==0 || checkedCode.length==0 || password.length==0 || confirmPassword.length==0){
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
		}else if(password!=confirmPassword){
			this.setState({ errMess : "亲~两次输入的密码不一样哦~" });
			this.refs.errMess.style.display="block";
			return false;
		}else{
			request.get("/CheckedCodeIsTure")
				.query({ 
					phoneNumber : phoneNumber,	//检测是否往该手机发送了该验证码
					checkedCode : checkedCode 
				})
				.accept('application/json')
				.end(function(err, res){
					if(res.body.message=="验证码错误"){
						_this.setState({ 
							errMess : message  	//验证码错误、验证码正确
						});
						_this.refs.errMess.style.display="block";
						return false;
					};
					request.post("/reset_password")
						.send({
							phoneNumber : phoneNumber,
							password : password
						})
						.end(function(err,res){
							if(err || !res.ok){
								console.log(err);
								return false;
							};
							_this.setState({
								errMess : res.body.message  	//重设密码失败、重设密码成功
							});
							_this.refs.errMess.style.display="block";
							if(res.body.message=="重设密码失败"){
								return false;
							};
							setTimeout(function(){
								location.href="/marriage_app";
							},2000);
						});
				});
		};
	}

	render(){
		return(
			<div className="reset_password">
				<div className="authErrMess" ref="errMess">{ this.state.errMess }</div>
				<div className="reset_password_main">
					<div className="decoration">
						<div className="appName">初恋</div>
						<div className="appSlogan">在这里，遇见最美的初恋</div>
					</div>
					<form className="reset_password_form" method="post">
						<div className="reset_password_form_title">找回密码</div>
					             <div className="phone_number_wrap" >
					             	<input className="phone_number text_input" ref="phone_number" type="text" name="phone_number" placeholder="手机号" />
					             	<input className="get_checked_code" ref="get_checked_code" type="button" name="get_checked_code" value={ this.state.checkedButtonState } onClick={ () => this.sendCheckedCode() } />
					             </div>
					             <div className="checked_code_wrap">
					             	<input className="checked_code text_input" ref="checked_code" type="text" name="checked_code" placeholder="输入验证码" />
					             </div>
					             <div className="password_wrap">
					             	<input className="password text_input" ref="password" type="password" name="password" placeholder="新密码" />
					             </div>
					             <div className="confirm_password_wrap">
					             	<input className="confirm_password text_input" ref="confirm_password" type="password" name="confirm_password" placeholder="确定密码" />
					             </div>
					             <div className="submit_wrap">
					             	<input className="submit" id="submit" type="submit" name="submit" value="确认" onClick={ (event) => this.handleReset(event) }/>
					             </div>
				          	</form>
				</div>
			</div>
		);
	};
};

export default Reset_password;

// ReactDOM.render(<Reset_password/>,document.getElementById("app"));