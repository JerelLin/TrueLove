import React from "react";
import { logout } from "../../../../mini_function/redirect.js";

import Slogan from "../user_auth/slogan.jsx";

import "../../../stylesheets/marriage_component/user_auth/user_auth_layout.css";
import "../../../stylesheets/marriage_component/user_auth/checking.css";

class Checking extends React.Component{
	render(){
		return(
			<div className="checking user_auth_box">
				<div className="checking_main">
					<Slogan />
					<div className="checking_form">
						<p>提交的信息我们已经收到，将会在一个工作日内处理</p>
						<span className="logout"><a href="#" onClick={ () => logout() }>退出</a></span>
					</div>
				</div>
			</div>
		);
	};
};

export default Checking;