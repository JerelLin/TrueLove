import React from "react";
import { Link } from "react-router";
import request from "superagent"; 

class Header extends React.Component{

	constructor(props){
		super(props);
		this.state={
			header : null,
			user_name : null
		};
	}

	componentDidMount(){
		var _this=this;
		request.get("/initUserProfile")
	      		.accept('application/json')
	      		.query({ token : localStorage.token })
	      		.end(function(err,res){
	      			if(err || !res.ok){
					console.log(err);
					return false;
				};
				_this.setState({
					header : res.body.user_profile.header,
					user_name : res.body.user_profile.user_name
				});
	      		});
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
						<div className="logout"><Link to="/marriage_app/logout">退出</Link></div>
					</div>
				</div>
			</div>
		);
	}
};

export default Header;