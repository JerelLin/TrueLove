import React from "react";
import request from "superagent"; 
import "../../../stylesheets/marriage_component/activity/news_detail.css";

class News_detail extends React.Component{

	constructor(props){
		super(props);
		window.scrollTo(0,0);
		this.state={
			news_detail : this.props.location.state.news_detail
		};
	}

	render(){
		return(
			<div className="news_detail">
				<div className="news_detail_header"><span>消息详情</span></div>
				<div className="news_detail_main">
					<div className="news_detail_content">
						<div className="news_detail_news">{ this.state.news_detail.news }</div>
						<div className="news_detail_date">{ this.state.news_detail.date }</div>
					</div>
				</div>
			</div>
		);
	}
};

export default News_detail;