import React from "react";
import { Link,IndexLink } from "react-router";
import "../../../stylesheets/marriage_component/statistics/page_analysis.css";
import "../../../stylesheets/marriage_component/common_component/d3.css";

class Page_analysis extends React.Component{
	render(){
		return(
			<div className="page_analysis">
				<div className="page_analysis_header"><span>主页分析</span></div>
				<div className="page_analysis_main">
					<div className="page_analysis_main_nav">
						<IndexLink to="/marriage_app/Page_analysis" activeClassName={ "active" }>用户增长</IndexLink>
						<Link to="/marriage_app/Page_analysis/Page_Property" activeClassName={ "active" }>用户属性</Link>
					</div>
					<div className="page_analysis_main_content">
						{ this.props.children }
					</div>
				</div>
			</div>
		);
	}
};

export default Page_analysis;