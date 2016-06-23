import React from "react";
import request from "superagent"; 
import Modal from "boron/DropModal";
import Input from "../common_component/input.jsx";
import Cancel from "../common_component/cancel_button.jsx";
import Submit from "../common_component/submit_button.jsx";
import "../../../stylesheets/marriage_component/setting/change_password.css";

class Change_password extends React.Component{

	constructor(props){
		super(props);
		window.scrollTo(0,0);
		this.state={
			old_password: null,
			new_password : null,
			comfirm_password : null,

			/*Error message*/
			old_passwordErr : null,
			new_passwordErr : null,
			comfirm_passwordErr : null,

			forbidClose : false,	/*遮罩层的关闭按钮是否禁止？false为不禁止，true为禁止*/
		};
	}

	/*提取各输入框的输入值*/
	collect_value(event,type){
		var { value } = event.currentTarget;
		this.setState({
			[ type ] : value
		});
		//console.log( typeof( type ) ); => string
		//console.log( typeof( [ type ] ) ); => object
	}

	/*checked*/
	handleBlur(event,type){
		var { value }=event.currentTarget;
		var newPassword=null;
		var _this=this;
		switch(type){
			case "old_password":
				if(value==null || value.length==0){
					this.setState({
						old_passwordErr : "密码不能为空哦~"
					});
					this.refs.old_passwordErr.style.display="inline-block";
				}else if(new RegExp("[\\u4E00-\\u9FFF]+","g").test(value)){	/*密码格式错误时(混入汉字)*/
					_this.setState({
						old_passwordErr : "密码格式有误哦!"
					});
					_this.refs.old_passwordErr.style.display="inline-block";
				}else{
					request.get("/checkPassword")
						.accept('application/json')
						.query({
							password : value
						})
						.end(function(err,res){
							if(err || !res.ok){
								console.log(err);
								return false;
							}else if(res.body.message&&res.body.message=="密码错啦"){	/*服务端返回的密码检测错误的消息*/
								_this.setState({
									old_passwordErr : res.body.message
								});
								_this.refs.old_passwordErr.style.display="inline-block";
							}else{								/*密码检测正确时*/
								_this.setState({
									old_passwordErr : null
								});
								_this.refs.old_passwordErr.style.display="none";
							};
						});
				};
				break;
			case "new_password":
				if(value==null || value.length==0){
					this.setState({
						new_passwordErr : "新密码不能为空哦~"
					});
					this.refs.new_passwordErr.style.display="inline-block";
				}else if(new RegExp("[\\u4E00-\\u9FFF]+","g").test(value)){
					_this.setState({
						new_passwordErr : "密码格式有误哦!"
					});
					_this.refs.new_passwordErr.style.display="inline-block";
				}else{
					_this.setState({
						new_passwordErr : null
					});
					_this.refs.new_passwordErr.style.display="none";
				};
				break;
			case "comfirm_password":
				if(value==null || value.length==0){
					this.setState({
						comfirm_passwordErr : "确认密码不能为空哦~"
					});
					this.refs.comfirm_passwordErr.style.display="inline-block";
				}else if(value!=this.state.new_password){
					this.setState({
						comfirm_passwordErr : "两次密码不一致哦~"
					});
					this.refs.comfirm_passwordErr.style.display="inline-block";
				}else{
					_this.setState({
						comfirm_passwordErr : null
					});
					_this.refs.comfirm_passwordErr.style.display="none";
				};
				break;
		};
	}

	handleCancel(){
		location.href="/marriage_app";
	}

	handleChange(){
		var _this=this;
		/*检测表单错误信息是否存在，若存在则禁止提交表单*/
		if(this.state.old_passwordErr||this.state.new_passwordErr||this.state.comfirm_passwordErr){
			return false;
		};
		if(this.state.old_password==null || this.state.new_password==null || this.state.comfirm_password==null){
			_this.setState({
				errMess : "请全都填写完哦！"
			});
			_this.showModal(false);
			return false;
		};
		this.setState({
			errMess : "请稍等一下~"
		});
		this.showModal(true);			/*禁止关闭按钮*/
		request.post("/changePassword")
			.send({
				old_password : this.state.old_password,
				new_password : this.state.new_password
			})
			.end(function(err,res){
				if(err || !res.ok){
					console.log(err);
					_this.setState({
						errMess : "修改失败"		//服务端错误
					});
					_this.showModal(false);
					return false;
				};
				if(res.body.message=="修改失败"){
					_this.setState({
						errMess : res.body.message
					});
					_this.showModal(false);
					return false;
				};
				_this.setState({
					errMess : res.body.message		//修改成功
				});
				_this.showModal(true);
				setTimeout(function(){
					location.href="/marriage_app"; 	/*弹出"修改成功"提示，2秒后跳转到主页*/
				},2000);
			});
	}

	/*提示遮罩层出现*/
	showModal(forbidState){
		this.setState({
			forbidClose : forbidState
		});
        		this.refs.modal.show();
    	}

    	/*提示遮罩层消失*/
    	hideModal(){
        		this.refs.modal.hide();
    	}

	render(){
		return(
			<div className="change_password">
				<Modal ref="modal">
					<div className="errMessCloseBox">
						{
							this.state.forbidClose==true ? "" : <span className="errMessClose" onClick={ () => this.hideModal() }></span>
						}
					</div>
					<div className="errMess">{ this.state.errMess }</div>
				</Modal>
				<div className="change_password_header"><span>修改密码</span></div>
				<div className="change_password_main">
					<form action="#" method="post">
						<div className="form_list">
							<label>当前密码：</label>
							<Input type="password" 
								onValue={ (event) => this.collect_value(event,"old_password") } 
								onBlur={ (event) => this.handleBlur(event,"old_password") } />
						</div>
						<span className="checkedErr" ref="old_passwordErr">{ this.state.old_passwordErr }</span>
						<div className="form_list">
							<label>新密码：</label>
							<Input type="password" 
								onValue={ (event) => this.collect_value(event,"new_password") } 
								onBlur={ (event) => this.handleBlur(event,"new_password") } />
						</div>
						<span className="checkedErr" ref="new_passwordErr">{ this.state.new_passwordErr }</span>
						<div className="form_list">
							<label>确认密码：</label>
							<Input type="password" 
								onValue={ (event) => this.collect_value(event,"comfirm_password") } 
								onBlur={ (event) => this.handleBlur(event,"comfirm_password") } />
						</div>
						<span className="checkedErr" ref="comfirm_passwordErr">{ this.state.comfirm_passwordErr }</span>
					</form>
					<div className="button_zone">
						<div className="button_zone_mian">
							<Cancel onClick={ () => this.handleCancel() }/>
							<Submit onClick={ () => this.handleChange() }/>
						</div>
					</div>
				</div>
			</div>
		);
	}
};

export default Change_password;