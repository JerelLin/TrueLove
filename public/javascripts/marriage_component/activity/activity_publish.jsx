import React from "react";
import { browserHistory } from "react-router";
import { Spin, Input, Button, notification, DatePicker } from "antd";
import Subject from "../layout_component/subject.jsx";
import CropperModal from "../common_component/cropperModal.jsx";
import Editor from "../common_component/richEditor.jsx";
import { fetch_data_get, fetch_data_post } from "../../../../mini_function/fetch.js";
import { checked_empty } from "../../../../mini_function/validate.js";
import { dataURItoBlob } from "../../../../mini_function/dataURItoBlob.js";

import "../../../stylesheets/marriage_component/activity/activity_publish.css";

class ActivityPublish extends React.Component{

	constructor( props ){
		super( props )
		let query = this.props.location.query;
		this.state = {
			init_loading : false,
			save_loading : false,
			publish_loading : false,

			activity_subject : query.material_subject || "",
			activity_introduction : query.material_introduction || "",
			activity_start : query.material_start || "",
			activity_deadline : query.material_deadline || "",
			activity_site : query.material_site || "",
			activity_content : query.material_content || "",
			activity_cover : query.material_cover || "http://7xteli.com1.z0.glb.clouddn.com/011e1855ed01ce6ac7251df877053e.png",
		}
	}
	
	// 获取活动标题 简介 地点输入值
	handleChange( event, type ){
		switch( type ){
			case "activity_subject" : 
				this.setState({ activity_subject : event.target.value });
				break;
			case "activity_introduction" : 
				this.setState({ activity_introduction : event.target.value });
				break;
			case "activity_site" : 
				this.setState({ activity_site : event.target.value });
				break;
			default :
				break;
		}
	}

	// 获取时间
	set_time( value, dateString, type ){
		switch( type ){
			case "activity_start" : 
				this.setState({ activity_start : dateString });
				break;
			case "activity_deadline" : 
				this.setState({ activity_deadline : dateString });
				break;
			default :
				break;
		}
	}

	// 获取富文本编辑器内容
	set_content( content ){
		this.setState({ activity_content : content })
		console.log( content )
	}

	// 获取活动封面剪裁数据
	passUrlData( result ){
		this.setState({ activity_cover : result })
	}
	
	// 保存( 活动标题 和 活动简介 不能为空 )
	handleSave(  ){
		let _this = this;
		this.setState({ save_loading : true });

		let activity_subject = this.state.activity_subject;
		let activity_introduction = this.state.activity_introduction;

		let activity_content = this.state.activity_content;
		let activity_site = this.state.activity_site;
		let activity_start = this.state.activity_start;
		let activity_deadline = this.state.activity_deadline;
		let activity_cover = this.state.activity_cover;

		// 验证 活动标题 和 活动简介 是否为空
		let checked_empty_result = checked_empty([ activity_subject, activity_introduction ], "活动标题和活动简介不可以为空");

		if( checked_empty_result == false ){
			_this.setState({ save_loading : false });
			return;
		};

		let material_form = new FormData(  );

		material_form.append( "material_subject", activity_subject );
		material_form.append( "material_introduction", activity_introduction );
		material_form.append( "material_content", activity_content );
		material_form.append( "material_site", activity_site );
		material_form.append( "material_start", activity_start );
		material_form.append( "material_deadline", activity_deadline );

		if( activity_cover.length > 10000 ){
			// 如果为二进制数据字符
			material_form.append( "material_cover", dataURItoBlob( activity_cover ) );
		} else {
			material_form.append( "material_cover", activity_cover );
		};

		material_form.append( "token", localStorage.marriage_app_token );

		console.log( material_form );

		fetch_data_post("/marriage_api/save_material", material_form, {    } )
			.then(( result ) => {
				_this.setState({ save_loading : false });
				if( result.body.error ){
					notification["error"]({
		      				message: "错误",
		      				description: result.body.message
		    			});
	    				return;
				};
				// 保存成功
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

	// 发布( 必须全部填写完成 )
	handlePublish(  ){
		let _this = this;
		this.setState({ publish_loading : true });

		let activity_subject = this.state.activity_subject;
		let activity_introduction = this.state.activity_introduction;
		let activity_content = this.state.activity_content;
		let activity_site = this.state.activity_site;
		let activity_start = this.state.activity_start;
		let activity_deadline = this.state.activity_deadline;
		let activity_cover = this.state.activity_cover;

		// 验证表单是否填写完整
		let checked_empty_result = checked_empty([ activity_subject, activity_introduction, activity_content, activity_site, activity_start, activity_deadline, activity_cover ]);

		if( checked_empty_result == false ){
			_this.setState({ publish_loading : false });
			return;
		};

		let publish_form = new FormData(  );

		publish_form.append( "activity_subject", activity_subject );
		publish_form.append( "activity_introduction", activity_introduction );
		publish_form.append( "activity_content", activity_content );
		publish_form.append( "activity_site", activity_site );
		publish_form.append( "activity_start", activity_start );
		publish_form.append( "activity_deadline", activity_deadline );

		if( activity_cover.length > 10000 ){
			// 如果为二进制数据字符
			publish_form.append( "activity_cover", dataURItoBlob( activity_cover ) );
		} else {
			publish_form.append( "activity_cover", activity_cover );
		};

		publish_form.append( "token", localStorage.marriage_app_token );

		console.log( publish_form );

		fetch_data_post("/marriage_api/publish_activity", publish_form, {    } )
			.then(( result ) => {
				_this.setState({ publish_loading : false });
				if( result.body.error ){
					notification["error"]({
		      				message: "错误",
		      				description: result.body.message
		    			});
	    				return
				};
				// 发布成功
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
			<div className="activity_publish">
				<Subject subject_content = "发布相亲活动" />
				<div className="activity_publish_main">
					<div className="activity_publish_section activity_subject">
						<label>活动标题：</label>
						<Input size="large" defaultValue={ this.state.activity_subject } placeholder="不超过三十个字符" onChange={ (event) => this.handleChange(event, "activity_subject") }/>
					</div>
					<div className="activity_publish_section activity_introduction">
						<label>活动简介：</label>
						<Input type="textarea" defaultValue={ this.state.activity_introduction } placeholder="请输入一百字以内" onChange={ (event) => this.handleChange(event, "activity_introduction") }/>
					</div>
					<div className="activity_publish_section activity_start">
						<label>选择活动时间：</label>
						<DatePicker showTime format="yyyy-MM-dd HH:mm:ss" defaultValue={ this.state.activity_start } placeholder="请选择时间" onChange = { (value, dateString) => this.set_time(value, dateString, "activity_start") } />
					</div>
					<div className="activity_publish_section activity_deadline">
						<label>报名截止时间：</label>
						<DatePicker showTime format="yyyy-MM-dd HH:mm:ss" defaultValue={ this.state.activity_deadline } placeholder="请选择时间" onChange = { (value, dateString) => this.set_time(value, dateString, "activity_deadline") } />
					</div>
					<div className="activity_publish_section activity_site">
						<label>输入活动地点：</label>
						<Input size="large" defaultValue={ this.state.activity_site } placeholder="不超过三十个字符" onChange={ (event) => this.handleChange(event, "activity_site") }/>
					</div>
					<div className="activity_publish_section activity_content">
						<label>添加活动图文详情：</label>
						<Editor id="editor" init_value={ this.state.activity_content } onValue={ ( value ) => this.set_content( value ) } />
					</div>
					<div className="activity_publish_section activity_cover_show">
						<label>上传活动封面：</label>
						<div className="activity_cover"><img src={ this.state.activity_cover }/></div>
						<CropperModal aspectRatio = { 900 / 500 } passUrlData = { ( result ) => this.passUrlData( result ) }/>
					</div>
					<div className="activity_publish_section">
						<Button type="primary" loading ={ this.state.save_loading } onClick={ (  ) => this.handleSave(  ) }>保存</Button>							
						<Button type="primary" loading = { this.state.publish_loading } onClick={ (  ) => this.handlePublish(  ) }>发布</Button>
					</div>
				</div>
			</div>
		)
	}
}

export default ActivityPublish