import React from "react";
import { Link,IndexLink } from "react-router";

import "../../../stylesheets/marriage_component/layout_component/nav.css";
import "../../../stylesheets/marriage_component/layout_component/content.css";

class Nav extends React.Component{
	render(){
		return(
			<ul className="nav">
				<li className="nav_title">功能</li>	
				<li><Link to="/marriage_app/activity_publish" activeClassName={ "active" }>相亲活动</Link></li>
				<li><Link to="/marriage_app/material" activeClassName={ "active" }>素材库</Link></li>
				<li><Link to="/marriage_app/activity_management" activeClassName={ "active" }>相亲活动管理</Link></li>

				<li className="nav_title">统计</li>
				<li><Link to="/marriage_app/page_analysis" activeClassName={ "active" }>主页分析</Link></li>
				<li><Link to="/marriage_app/activity_analysis" activeClassName={ "active" }>活动分析</Link></li>

				<li className="nav_title">设置</li>
				<li><Link to="/marriage_app/edit_profile" activeClassName={ "active" }>修改资料</Link></li>
				<li><Link to="/marriage_app/change_password" activeClassName={ "active" }>修改密码</Link></li>
				<li><Link to="/marriage_app/feedback" activeClassName={ "active" }>意见反馈</Link></li>
				<li><Link to="/marriage_app/about_truelove" activeClassName={ "active" }>关于“初恋”</Link></li>
			</ul>
		);
	};
};

export default Nav;