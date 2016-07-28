import React from "react";
import request from "superagent";
import { Link } from "react-router";

import "../../../stylesheets/marriage_component/auth/checking.css";

class Checking extends React.Component{

	constructor(props){
		super(props);
		this.state={
			errMess : null
		};
	}

	render(){
		return(
			<div className="checking">
				<div className="authErrMess" ref="errMess">{ this.state.errMess }</div>
				<div className="checking_main">
					<div className="decoration">
						<div className="appName">初恋</div>
						<div className="appSlogan">在这里，遇见最美的初恋</div>
					</div>
					<div className="checking_form">
						提交的信息我们已经收到，将会在一个工作日内处理
					</div>
				</div>
			</div>
		);
	};
};

export default Checking;