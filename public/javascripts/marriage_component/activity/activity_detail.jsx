import React from "react";
import { IndexLink,Link } from "react-router";
import request from "superagent"; 
import "../../../stylesheets/marriage_component/activity/activity_detail.css";

class Activity_detail extends React.Component{

	constructor(props){
		super(props);
		window.scrollTo(0,0);
		var activity_detail_data={
			activity_img_show : "../../../images/../../../images/1462587959000.jpg",
			activity_name : "遭遇触动!",
			activity_deadline : "2016-03-06 12:30",
			activity_date : "2016-03-08",
			commentSum : 30,
			signSum : 120,

			timestamp : null 				/*时间戳*/
		};
		this.state={
			activity_detail_data : activity_detail_data
		};
	}

	componentDidMount(){
	      	var _this=this;
	      	var { timestamp } = this.props.params;
	      	this.setState({ timestamp : this.props.params.activity_id });
	      	console.log(this.props.params);
		if(timestamp){
			this.setState({ timestamp : timestamp });
			console.log("时间戳为:  " + timestamp + "  =>将会根据此时间戳获取到相应的活动详情数据");
			request.get("/getActivityDetail")
				.accept('application/json')		/*接收什么类型的数据*/
				.query({
					timestamp : timestamp
				})
				.end(function(err,res){
					if(err || !res.ok){
						console.log(err);
						console.log(res);
						return false;
					};
					console.log("已经初始化时间戳为 "+timestamp+" 的活动");
				});
		}
	}

	render(){
		return(
			<div className="activity_detail">
				<div className="activity_detail_header"><span>活动详情</span></div>
				<div className="activity_detail_main">
				{/*返回活动管理*/}
					<div className="back_to_activity_management">
						<Link to="/marriage_app/Activity_management"><span>活动总览</span></Link>
					</div>
				{/*活动信息*/}
					<div className="activity_information">
						<div className="activity_img_show"><img src={ this.state.activity_detail_data.activity_img_show }/></div>
						<div className="activity">
							<div className="activity_name">
								<span className="label">活动名称:</span>
								<span className="label_value">{ this.state.activity_detail_data.activity_name }</span>
							</div>
							<div className="activity_deadline">
								<span className="label">报名截止:</span>
								<span className="label_value">{ this.state.activity_detail_data.activity_deadline }</span>
							</div>
							<div className="activity_date">
								<span className="label">活动时间:</span>
								<span className="label_value">{ this.state.activity_detail_data.activity_date }</span>
							</div>
						</div>
					</div>
				{/*活动评价*/}
					<div className="activity_comment">
						<div className="activity_comment_header">
							<IndexLink to={`/marriage_app/Activity_management/Activity_detail/${ this.state.timestamp }`}  activeClassName={ "active" } className="activity_comment_nav">
								<div className="header_item">
									<span className="label">评论</span>
									<span className="comment_data">{ this.state.activity_detail_data.commentSum }</span>
								</div>
							</IndexLink>
							<Link to={`/marriage_app/Activity_management/Activity_detail/${ this.state.timestamp }/Sign`} activeClassName={ "active" } className="activity_comment_nav">
								<div className="header_item">
									<span className="label">报名</span>
									<span className="comment_data">{ this.state.activity_detail_data.signSum }</span>
								</div>
							</Link>
						</div>
						<div className="comment_or_sign">
							{ this.props.children }
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Activity_detail;