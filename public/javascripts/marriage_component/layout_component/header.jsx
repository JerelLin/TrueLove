import React from "react";
import { Link, browserHistory } from "react-router";
import { fetch_data_get } from "../../../../mini_function/fetch.js";
import { logout } from "../../../../mini_function/redirect.js";

import "../../../stylesheets/marriage_component/layout_component/header.css";

class Header extends React.Component{

	constructor(props){
		super(props);
		this.state={
			header : "",
			user_name : ""
		};
	}

	componentDidMount(){
		var _this=this;
		fetch_data_get("/marriage_api/init_user_profile", { token : localStorage.marriage_app_token })
			.then((result) => {
				_this.setState({
					header : result.body.user_profile.header,
					user_name : result.body.user_profile.user_name
				});
			})
			.catch((error) => console.log(error));
	}

	render(){
		return(
			<div className="header">
				<div className="header_main">
					<div className="header_main_left">
						<Link className="logo" to="/marriage_app"><span>初恋</span></Link>
						<div className="subject">婚介管理平台</div>
					</div>
					<div className="header_main_right">
						<div className="user">
							<span className="user_img"><img src={ this.state.header } /></span>
							<span className="user_name">{ this.state.user_name }</span>
						</div>
						<div className="logout" onClick={ () => logout() }><span>退出</span></div>
					</div>
				</div>
			</div>
		);
	}
};

export default Header;