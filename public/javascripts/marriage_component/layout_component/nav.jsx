import React from "react";
import { Link,IndexLink } from "react-router";

class Nav extends React.Component{
	render(){
		return(
			<ul className="nav">
				{/*默认一开始被点击*/}
				<li className="nav_title">功能</li>	
				<li><Link to="/marriage_app/Activity_publish" activeClassName={ "active" }>相亲活动</Link></li>
				<li><Link to="/marriage_app/Material" activeClassName={ "active" }>素材库</Link></li>
				<li><Link to="/marriage_app/Activity_management" activeClassName={ "active" }>相亲活动管理</Link></li>

				<li className="nav_title">统计</li>
				<li><Link to="/marriage_app/Page_analysis" activeClassName={ "active" }>主页分析</Link></li>
				<li><Link to="/marriage_app/Activity_analysis" activeClassName={ "active" }>活动分析</Link></li>

				<li className="nav_title">设置</li>
				<li><Link to="/marriage_app/Edit_profile" activeClassName={ "active" }>修改资料</Link></li>
				<li><Link to="/marriage_app/Change_password" activeClassName={ "active" }>修改密码</Link></li>
				<li><Link to="/marriage_app/Feedback" activeClassName={ "active" }>意见反馈</Link></li>
				<li><Link to="/marriage_app/About_turelove" activeClassName={ "active" }>关于“初恋”</Link></li>
			</ul>
		);
	};
};

export default Nav;