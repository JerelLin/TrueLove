import React from "react";
import { logout } from "../../../../mini_function/redirect.js";

import Slogan from "../user_auth/slogan.jsx";

import "../../../stylesheets/marriage_component/user_auth/user_auth_layout.css";
import "../../../stylesheets/marriage_component/user_auth/authentication.css";

class Authentication extends React.Component{

	constructor(props){
		super(props);
		this.state={  };
	}

	render(){
		return(
			<div className="authentication user_auth_box">
				<div className="authentication_main">
					<Slogan />
					<div className="authentication_form">
						<div className="authentication_form_box">
							<div className="authentication_form_header">
								<p>亲爱的，我们需要你先进行婚介所认证，</p>
								<p>在审核通过后，才予以使用，望你谅解。</p>
							</div>
							<div className="authentication_form_main">
								<div className="authentication_form_main_left"></div>
								<div className="authentication_form_main_right"></div>
							</div>
							<div className="authentication_form_footer">
								<p>上传照片要求：</p>
								<ol>
									<li>要求上传四张图片，分别为营业执照的照片、身份证正面、背面，手持身份证正面的半身照</li>
									<li>上传每张图片的大小不得超过500k</li>
								</ol>
							</div>
							<div className="authentication_form_submit"></div>
							<span className="logout"><a href="#" onClick={ () => logout() }>退出</a></span>
						</div>
					</div>
				</div>
			</div>
		);
	};
};

export default Authentication;