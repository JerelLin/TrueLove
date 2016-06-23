import React from "react";
import request from "superagent"; 
import Modal from "boron/DropModal";	 						/*遮罩层组件*/
import Input from "../common_component/input.jsx";
import Textarea from "../common_component/textarea.jsx";
import Cancel from "../common_component/cancel_button.jsx";
import Submit from "../common_component/submit_button.jsx";
import Upload_head from "../setting/upload_head.jsx";
import "../../../stylesheets/marriage_component/setting/edit_profile.css";

class Edit_profile extends React.Component{

	constructor(props){
		super(props);
		window.scrollTo(0,0);
		this.state={
			/*用户资料数据*/
			img : null,
			name : "",
			introduction : "",
			contacts : "",
			phone : "",
			address : "",

			/*error message*/
			nameErr : null,
			introductionErr : null,
			contactsErr : null,
			phoneErr : null,
			addressErr : null,

			forbidClose : false,	/*遮罩层的关闭按钮是否禁止？false为不禁止，true为禁止*/

			errMess : null 		/*错误提示*/
		};
	}

	componentDidMount(){
		var _this=this;
	      	request.get("/initProfile")		/*加载用户资料信息*/
	      		.accept('application/json')
	      		.end(function(err,res){
	      			if(err || !res.ok){
					console.log(err);
					return false;
				};
				console.log("用户资料初始化");
				_this.setState({
					img : "../../../images/1462587959000.jpg",
					name : "初恋婚介所",
					introduction : "秉着诚信，负责任的原则，初恋婚介所一直在尽自己十分的努力为年轻的男女们寻找心目中的她（他）.",
					contacts : "夏天",
					phone : "13531957084",
					address : "深圳高新科技园..."
				});
	      		});
	}

	/*checked*/
	handleBlur(event,type){
		var { value }=event.currentTarget;
		switch(type){
			case "name":
				if(value.length==0){
					this.setState({
						nameErr : "婚介所名字不能为空"
					});
					this.refs.nameErr.style.display="inline-block";
					break;
				};
				if(value.length>15){
					this.setState({
						nameErr : "婚介所名字不能超过十五个字符"
					});
					this.refs.nameErr.style.display="inline-block";
					break;
				};
				this.setState({
					nameErr : null
				});
				this.refs.nameErr.style.display="none";
				break;
			case "introduction":
				if(value.length==0){
					this.setState({
						introductionErr : "婚介所介绍不能为空"
					});
					this.refs.introductionErr.style.display="inline-block";
					break;
				};
				if(value.length>200){
					this.setState({
						introductionErr : "婚介所介绍不能超过200个字符"
					});
					this.refs.introductionErr.style.display="inline-block";
					break;
				};
				this.setState({
					introductionErr : null
				});
				this.refs.introductionErr.style.display="none";
				break;
			case "contacts":
				if(value.length==0){
					this.setState({
						contactsErr : "联系人不能为空"
					});
					this.refs.contactsErr.style.display="inline-block";
					break;
				};
				this.setState({
					contactsErr : null
				});
				this.refs.contactsErr.style.display="none";
				break;
			case "phone":
				if(value.length==0){
					this.setState({
						phoneErr : "联系电话不能为空"
					});
					this.refs.phoneErr.style.display="inline-block";
					break;
				}else if(isNaN(value)){
					this.setState({
						phoneErr : "电话格式错误"
					});
					this.refs.phoneErr.style.display="inline-block";
					break;
				};
				this.setState({
					phoneErr : null
				});
				this.refs.phoneErr.style.display="none";
				break;
			case "address":
				if(value.length==0){
					this.setState({
						addressErr : "地址不能为空"
					});
					this.refs.addressErr.style.display="inline-block";
					break;
				};
				this.setState({
					addressErr : null
				});
				this.refs.addressErr.style.display="none";
				break;
		};
	}

	/*获取头像*/
	get_header(head){
		this.setState({
			img : head
		});
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

	/*将一段二进制数据流封装为一个数据流对象*/
	//**dataURL to blob**
	dataURLtoBlob(dataurl){
		var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
		while(n--){
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new Blob([u8arr], {type:mime});
	}

	/*封装formdata对象*/
	toFormData(form){
		// 封装formdata对象，formdata对象可以包含json
		form.append("name",this.state.name);			/*婚介所的名字*/
		form.append("introduction",this.state.introduction);	/*婚介所的简介*/
		form.append("contacts",this.state.contacts);		/*婚介所的联系人*/
		form.append("phone",this.state.phone);			/*婚介所的联系电话*/
		form.append("address",this.state.address);		/*婚介所的地址*/

		/*检测为base64字符串时*/
		if( this.state.img.indexOf("base64")>0 ){
			form.append('image', this.dataURLtoBlob(this.state.img),Date.parse( new Date() )+".jpg");
		}else{
			/*若检测到图片不是base64数据流，则说明头像并没有修改，返回null*/
			form.append('image', null);
		};
		return form; 
	}

	handleCancel(){
		this.props.history.replaceState(null, '/marriage_app');
	}

	handleEdit(){
		var _this=this;
		var form=new FormData();
		/*检测表单错误信息是否存在，若存在则禁止修改*/
		if(this.state.nameErr||this.state.introductionErr||this.state.contactsErr||this.state.phoneErr||this.state.addressErr){
			return false;
		};
		this.setState({
			errMess : "请稍等一下~"
		});
		this.showModal(true);				/*禁止关闭按钮*/
		this.toFormData(form);
		request.post("/editProfile")			/*保险起见替换为jquery的ajax？*/
			.send(form)
			.end(function(err,res){
				if(err || !res.ok){
					console.log(err);
					_this.setState({
						errMess : "修改失败"
					});
					_this.showModal(false);
					return false;
				};
				_this.setState({
					errMess : "修改成功"
				});
				_this.showModal(true);
				setTimeout(function(){
					_this.props.history.replaceState(null, '/marriage_app');
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
			<div className="edit_profile">
				<Modal ref="modal">
					<div className="errMessCloseBox">
						{
							this.state.forbidClose==true ? "" : <span className="errMessClose" onClick={ () => this.hideModal() }></span>
						}
					</div>
					<div className="errMess">{ this.state.errMess }</div>
				</Modal>
				<div className="edit_profile_header"><span>修改资料</span></div>
				<form className="edit_profile_main" ref="edit_profile_main" action="#" method="post">
					{/*头像*/}
					<div className="head edit_profile_main_list">
						<span className="title">头像</span>
						<div className="list_main">
							<div className="list_main_content">
								{/*头像上传组件,分离出去*/}
								<Upload_head get_header={ (head) => this.get_header(head) } img={ this.state.img } />
							</div>
						</div>
					</div>
					{/*名称*/}
					<div className="name edit_profile_main_list">
						<span className="title">名称</span>
						<div className="list_main">
							<div className="list_main_content">
								<label htmlFor="name_input">输入婚介所的名字：</label>
								<Input ref="name"
									placeholder="不超过十五个字符"
									onValue={ (event) => this.collect_value(event,"name") }
									onBlur={ (event) => this.handleBlur(event,"name") }
									init_value={ this.state.name }/>
								<span className="checkedErr" ref="nameErr">{ this.state.nameErr }</span>
							</div>
						</div>
					</div>
					{/*简介*/}
					<div className=" Introduction edit_profile_main_list">
						<span className="title">简介</span>
						<div className="list_main">
							<div className="list_main_content">
								<label htmlFor="introduction_input">输入婚介所的简介：</label>
								<Textarea ref="introduction" 
									placeholder="请输入两百字以内" 
									onValue={ (event) => this.collect_value(event,"introduction") }
									onBlur={ (event) => this.handleBlur(event,"introduction") }
									init_value={ this.state.introduction }/>
								<span className="checkedErr" ref="introductionErr">{ this.state.introductionErr }</span>
							</div>
						</div>
					</div>
					{/*联系人*/}
					<div className="contacts edit_profile_main_list">
						<span className="title">联系人</span>
						<div className="list_main">
							<div className="list_main_content">
								<label htmlFor="contacts_input">输入联系人的名字：</label>
								<Input ref="contacts"
									placeholder=""
									onValue={ (event) => this.collect_value(event,"contacts") }
									onBlur={ (event) => this.handleBlur(event,"contacts") }
									init_value={ this.state.contacts }/>
								<span className="checkedErr" ref="contactsErr">{ this.state.contactsErr }</span>
							</div>
						</div>
					</div>
					{/*联系电话*/}
					<div className="phone_num edit_profile_main_list">
						<span className="title">联系电话</span>
						<div className="list_main">
							<div className="list_main_content">
								<label htmlFor="phone_num_input">输入联系人的电话：</label>
								<Input ref="phone"
									placeholder=""
									onValue={ (event) => this.collect_value(event,"phone") }
									onBlur={ (event) => this.handleBlur(event,"phone") }
									init_value={ this.state.phone }/>
								<span className="checkedErr" ref="phoneErr">{ this.state.phoneErr }</span>
							</div>
						</div>
					</div>
					{/*地址*/}
					<div className="address edit_profile_main_list">
						<span className="title">地址</span>
						<div className="list_main">
							<div className="list_main_content">
								<label htmlFor="address_input">输入婚介所的地址：</label>
								<Input ref="address"
									placeholder=""
									onValue={ (event) => this.collect_value(event,"address") }
									onBlur={ (event) => this.handleBlur(event,"address") }
									init_value={ this.state.address }/>
								<span className="checkedErr" ref="addressErr">{ this.state.addressErr }</span>
							</div>
						</div>
					</div>
					{/*按钮区域*/}
					<div className="button_zone edit_profile_main_list">
						<div className="button_zone_mian">
							<Cancel onClick={ () => this.handleCancel() }/>
							<Submit onClick={ () => this.handleEdit() }/>
						</div>
					</div>
				</form>
			</div>
		);
	};
};

export default Edit_profile;