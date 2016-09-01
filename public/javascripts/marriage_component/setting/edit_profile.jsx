import React from "react";
import { browserHistory } from "react-router";
import { Spin, Input, Button, notification } from "antd";
import Subject from "../layout_component/subject.jsx";
import CropperModal from "../common_component/cropperModal.jsx";
import { fetch_data_get, fetch_data_post } from "../../../../mini_function/fetch.js";
import { checked_empty } from "../../../../mini_function/validate.js";
import { dataURItoBlob } from "../../../../mini_function/dataURItoBlob.js";

import "../../../stylesheets/marriage_component/setting/edit_profile.css";

class EditProfile extends React.Component{

	constructor( props ){
		super( props );
		this.state = {
			loading : false,
			get_user_profile_loading : false,

			user_head : "http://7xteli.com1.z0.glb.clouddn.com/011e1855ed01ce6ac7251df877053e.png",
			user_name : "",
			user_introduction : "",
			user_contacts : "",
			user_phone : "",
			user_address : ""
		}
	}

	componentDidMount(  ){
		let _this=this;
		_this.setState({ get_user_profile_loading : true });
		fetch_data_get("/marriage_api/init_user_profile_detail", { token : localStorage.marriage_app_token })
			.then((result) => {
				let user_profile = result.body.user_profile_detail;
				_this.setState({
					get_user_profile_loading : false,

					user_head : user_profile.user_head,
					user_name : user_profile.user_name,
					user_introduction : user_profile.user_introduction,
					user_contacts : user_profile.user_contacts,
					user_phone : user_profile.user_phone,
					user_address : user_profile.user_address
				})
			})
			.catch((error) => console.log(error));
	}

	// 获取头像剪裁数据
	passUrlData( result ){
		this.setState({ user_head : result })
	}
	
	handleChange( event, type ){
		switch( type ){
			case "user_name" : 
				this.setState({ user_name : event.target.value });
				break;
			case "user_introduction" : 
				this.setState({ user_introduction : event.target.value });
				break;
			case "user_contacts" : 
				this.setState({ user_contacts : event.target.value });
				break;
			case "user_phone" : 
				this.setState({ user_phone : event.target.value });
				break;
			case "user_address" : 
				this.setState({ user_address : event.target.value });
				break;
			default :
				break;
		}
	}

	handleCancel(  ){
		browserHistory.push("/marriage_app");
	}

	handleSubmit(  ){
		let _this = this;
		this.setState({ loading : true });

		let user_head = this.state.user_head;
		let user_name = this.state.user_name;
		let user_introduction = this.state.user_introduction;
		let user_contacts = this.state.user_contacts;
		let user_phone = this.state.user_phone;
		let user_address = this.state.user_address;

		// 验证表单是否填写完整
		let checked_empty_result = checked_empty([ user_name, user_introduction, user_contacts, user_phone, user_address ]);

		if( checked_empty_result == false ){
			_this.setState({ loading : false });
			return;
		};

		let user_profile_form = new FormData(  );

		user_profile_form.append( "user_name", user_name );
		user_profile_form.append( "user_introduction", user_introduction );
		user_profile_form.append( "user_contacts", user_contacts );
		user_profile_form.append( "user_phone", user_phone );
		user_profile_form.append( "user_address", user_address );

		if( user_head.length > 10000 ){
			// 如果为二进制数据字符
			user_profile_form.append( "user_head", dataURItoBlob( user_head ) );
		} else {
			user_profile_form.append( "user_head", user_head );
		};

		user_profile_form.append( "token", localStorage.marriage_app_token );

		fetch_data_post("/marriage_api/change_user_profile", user_profile_form, {    })
			.then(( result ) => {
				_this.setState({ loading : false });
				if( result.body.error ){
					notification["error"]({
		      				message: "错误",
		      				description: result.body.message
		    			});
	    				return;
				};
				// 资料修改成功
				notification["success"]({
		      			message: "成功",
		      			description: result.body.message
		    		});
				setTimeout(function(  ){
					browserHistory.push("/marriage_app");
				}, 1000)
			})
			.catch(( error ) => console.log( error ));

	}

	render(  ){
		return(
			<div className="edit_profile">
				<Subject subject_content = "修改资料" />
				<div className="edit_profile_main">
				<Spin size="large" spinning={ this.state.get_user_profile_loading } >
					<div className="user_head edit_profile_section">
						<label>修改头像：</label>
						<div className="heaer_show"><img src={ this.state.user_head }/></div>
						<CropperModal aspectRatio = { 150 / 150 } passUrlData = { ( result ) => this.passUrlData( result ) }/>
					</div>
					<div className="user_name edit_profile_section">
						<label>输入婚介所的名字：</label>
						<Input size="large" placeholder="不超过十五个字符" value={ this.state.user_name } onChange={ (event) => this.handleChange(event, "user_name") }/>
					</div>
					<div className="user_introduction edit_profile_section">
						<label>输入婚介所的简介：</label>
						<Input type="textarea" placeholder="请输入两百字以内" value={ this.state.user_introduction } onChange={ (event) => this.handleChange(event, "user_introduction") }/>
					</div>
					<div className="user_contacts edit_profile_section">
						<label>输入联系人的名字：</label>
						<Input size="large" placeholder="" value={ this.state.user_contacts } onChange={ (event) => this.handleChange(event, "user_contacts") }/>
					</div>
					<div className="user_phone edit_profile_section">
						<label>输入联系人的电话：</label>
						<Input size="large" placeholder="" value={ this.state.user_phone } onChange={ (event) => this.handleChange(event, "user_phone") }/>
					</div>
					<div className="user_address edit_profile_section">
						<label>输入婚介所的地址：</label>
						<Input size="large" placeholder="" value={ this.state.user_address } onChange={ (event) => this.handleChange(event, "user_address") }/>
					</div>
				</Spin>
					<div className="edit_profile_section">
						<Button type="primary" onClick={ (  ) => this.handleCancel(  ) }>取消</Button>							
						<Button type="primary" loading = { this.state.loading } onClick={ (  ) => this.handleSubmit(  ) }>确认</Button>
					</div>
				</div>
			</div>
		)
	}
}

export default EditProfile