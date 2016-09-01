import React from "react";
import { browserHistory } from "react-router";
import { Input, Button, notification } from "antd";
import Subject from "../layout_component/subject.jsx";
import { fetch_data_post } from "../../../../mini_function/fetch.js";
import { checked_empty, checked_format, checked_password } from "../../../../mini_function/validate.js";

import "../../../stylesheets/marriage_component/setting/change_password.css";

class ChangePassword extends React.Component{

	constructor( props ){
		super( props );
		this.state = {
			loading : false,
			current_password : "",
			new_password : "",
			new_password_again : ""
		}
	}

	handleCancel(  ){
		browserHistory.push("/marriage_app")
	}

	handleChange( event, type ){
		switch( type ){
			case "current_password" : 
				this.setState({ current_password : event.target.value });
				break;
			case "new_password" : 
				this.setState({ new_password : event.target.value });
				break;
			case "new_password_again" : 
				this.setState({ new_password_again : event.target.value });
				break;
			default :
				break;
		}
	}

	handleSubmit(  ){
		let _this = this;
		this.setState({ loading : true });

		let current_password = this.state.current_password;
		let new_password = this.state.new_password;
		let new_password_again = this.state.new_password_again;

		// 数据检测
		let checked_empty_result = checked_empty([ current_password, new_password, new_password_again ]);
		let checked_format_result = checked_format([ current_password, new_password, new_password_again ]);
		let checked_password_result = checked_password(new_password, new_password_again);

		if(checked_empty_result == false || checked_format_result == false || checked_password_result == false){
			_this.setState({ loading : false });
			return;
		};

		let submit_data = { current_password : current_password, new_password : new_password };
		fetch_data_post("/marriage_api/change_password", { token : localStorage.marriage_app_token, submit_data : submit_data })
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
			<div className="change_password">
				<Subject subject_content = "修改密码" />
				<div className="change_password_main">
					<div className="change_password_section current_password">
						<label>当前密码：</label>
						<Input size="large" placeholder="" onChange={ (event) => this.handleChange(event, "current_password") }/>
					</div>
					<div className="change_password_section new_password">
						<label>新密码：</label>
						<Input size="large" placeholder="" onChange={ (event) => this.handleChange(event, "new_password") }/>
					</div>
					<div className="change_password_section new_password_again">
						<label>确认密码：</label>
						<Input size="large" placeholder="" onChange={ (event) => this.handleChange(event, "new_password_again") }/>
					</div>
					<div className="change_password_section">
						<Button type="primary" onClick={ (  ) => this.handleCancel(  ) }>取消</Button>							
						<Button type="primary" loading = { this.state.loading } onClick={ (  ) => this.handleSubmit(  ) }>确认</Button>
					</div>
				</div>
			</div>
		);
	}
}

export default ChangePassword