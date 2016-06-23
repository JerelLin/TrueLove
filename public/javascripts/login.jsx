import React from "react";
import request from "superagent";
import { Link } from "react-router";

import "../stylesheets/login.css";

class Login extends React.Component{

	constructor(props){
		super(props);
		this.state={
			errMess : null,
			loginState : "登录"
		};
	}

	/*点击登录按钮时触发验证*/
	handleLogin(event){
		var _this=this;
		event.preventDefault();
		var phoneNumber=this.refs.phone_number.value;
		var password=this.refs.password.value;
		if(phoneNumber==null || phoneNumber.length==0){
			if(password==null || password.length==0){
				this.setState({ errMess : "亲~请填写表单信息哦~" });
				this.refs.errMess.style.display="block";
				return false;
			}else{
				this.setState({ errMess : "手机号码不能为空哦~" });
				this.refs.errMess.style.display="block";
				return false;
			};
		}else if(password==null || password.length==0){
			this.setState({ errMess : "密码不能为空哦~" });
			this.refs.errMess.style.display="block";
			return false;
		}else if(!new RegExp("^[0-9]*$").test(phoneNumber)){
			if(new RegExp("[\\u4E00-\\u9FFF]+","g").test(password)){
				this.setState({ errMess : "亲~手机号码和密码的格式都不对哦~" });
				this.refs.errMess.style.display="block";
				return false;
			}else{
				this.setState({ errMess : "亲~手机号码的格式不对哦~" });
				this.refs.errMess.style.display="block";
				return false;
			};
		}else if(new RegExp("[\\u4E00-\\u9FFF]+","g").test(password)){
			this.setState({ errMess : "亲~密码的格式不对哦~" });
			this.refs.errMess.style.display="block";
			return false;
		};

		/*不予许同一浏览器同时登录两个账号*/
		if(localStorage.token&&localStorage.token!=""){
			alert("请退出已登录账号再重新登录!");
			return false;
		};

		this.setState({ loginState : "登录中..." });
		this.refs.submit.disabled=true;
		request.post("/login")
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
					errMess : res.body.message 				//还木有注册、密码错误、登录成功
				});
				_this.refs.errMess.style.display="block";
				if(res.body.error){
					_this.setState({ loginState : "登录" });
					_this.refs.submit.disabled=false;
					return false;
				};
				localStorage.token=res.body.token;				//存储token
				setTimeout(function(){
					alert(res.body.auth);
					localStorage.auth=res.body.auth;			//存储auth
					switch(parseInt(res.body.auth)){				//res.body.auth
						case 0:
							_this.props.history.replaceState(null, '/marriage_app/authentication'); //需认证
							break;
						case 1:
							_this.props.history.replaceState(null, '/marriage_app/checking');	        //审核中
							break;
						case 2:
							_this.props.history.replaceState(null, '/marriage_app');   		        //主页
							break;
						default :
							_this.setState({ errMess : "出了点问题，重新登录试试？" });
							break;
					};
				},1000);
			});
	}

	render(){
		return(
			<div className="login">
				<div className="authErrMess" ref="errMess">{ this.state.errMess }</div>
				<div className="login_main">
					<div className="decoration">
						<div className="appName">初恋</div>
						<div className="appSlogan">在这里，遇见最美的初恋</div>
					</div>
					<form className="login_form" method="post">
						<div className="login_form_title">婚介所平台</div>
					             <div className="phone_number_wrap" >
					             	<input className="phone_number text_input" ref="phone_number" type="text" name="phone_number" placeholder="手机号" />
					             </div>
					             <div className="password_wrap">
					             	<input className="password text_input" ref="password" type="password" name="password" placeholder="密码" />
					             </div>
					             <div className="submit_wrap">
					             	<input className="submit" id="submit" ref="submit" type="submit" name="submit" value={ this.state.loginState } onClick={ (event) => this.handleLogin(event) } />
					             </div>
					             <div className="redirect_zone">
					             	<Link to="/marriage_app/reset_password" className="find_password">找回密码</Link>
					             	<Link to="/marriage_app/register" className="free_register">免费注册</Link>
					             </div>
				          	</form>
				</div>
			</div>
		);
	};
};

export default Login;

// ReactDOM.render(<Login/>,document.getElementById("app"));