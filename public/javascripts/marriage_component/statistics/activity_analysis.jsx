import React from "react";
import { Link,IndexLink } from "react-router";
import "../../../stylesheets/marriage_component/statistics/activity_analysis.css";
import "../../../stylesheets/marriage_component/common_component/d3.css";

class Activity_analysis extends React.Component{
	render(){
		return(
			<div className="activity_analysis">
				<div className="activity_analysis_header"><span>活动分析</span></div>
				<div className="activity_analysis_main">
					<div className="activity_analysis_main_nav">
						<IndexLink to="/marriage_app/Activity_analysis" activeClassName={ "active" }>用户增长</IndexLink>
						<Link to="/marriage_app/Activity_analysis/Activity_Property" activeClassName={ "active" }>用户属性</Link>
					</div>
					<div className="activity_analysis_main_content">
						{ this.props.children }
					</div>
				</div>
			</div>
		);
	};
};

export default Activity_analysis;