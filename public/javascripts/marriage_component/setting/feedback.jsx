import React from "react";
import { browserHistory } from "react-router";
import { Input, Button, notification } from "antd";
import Subject from "../layout_component/subject.jsx";
import { fetch_data_post } from "../../../../mini_function/fetch.js";
import { checked_empty } from "../../../../mini_function/validate.js";

import "../../../stylesheets/marriage_component/setting/feedback.css";

class Feedback extends React.Component{

	constructor( props ){
		super( props );
		this.state = {
			loading : false,
			feedback : ""
		}
	}

	handleChange( event ){
		this.setState({ feedback : event.target.value })
	}

	handleCancel(  ){
		browserHistory.push("/marriage_app")
	}

	handleSubmit(  ){
		this.setState({ loading : true });

		let _this = this;
		let feedback = this.state.feedback;
		let checked_empty_result = checked_empty([ feedback ], "写点什么吧！");
		if( checked_empty_result == false ){
			_this.setState({ loading : false });
			return;
		};

		fetch_data_post("/marriage_api/feedback", { token : localStorage.marriage_app_token, feedback : feedback })
			.then(( result ) => {
				_this.setState({ loading : false });
				if( result.body.error ){
					notification["error"]({
		      				message: "错误",
		      				description: result.body.message
		    			});
	    				return;
				};
				// 密码修改成功
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
			<div className="feedback">
				<Subject subject_content = "意见反馈" />
				<div className="feedback_main">
					<div className="feedback_section">
						<p className="words">亲爱的，如果你不开心，小初也不开心</p>
						<p className="words">你对小初有什么想吐槽的，说给小初听吧，小初会好好改正的。</p>
					</div>
					<div className="feedback_section">
						<Input type="textarea" placeholder="写下你想对小初说的话" onChange={ (event) => this.handleChange(event) }/>
					</div>
					<div className="feedback_section">
						<Button type="primary" onClick={ (  ) => this.handleCancel(  ) }>取消</Button>							
						<Button type="primary" loading = { this.state.loading } onClick={ (  ) => this.handleSubmit(  ) }>确认</Button>
					</div>
				</div>
			</div>
		);
	}
};

export default Feedback;