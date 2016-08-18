import React from "react";
import { IndexLink, Link } from "react-router";
import { Icon, Tabs, Spin } from "antd";
import { fetch_data_get } from "../../../../mini_function/fetch.js";
import Subject from "../layout_component/subject.jsx";
import Comment from "./comment.jsx";

import "../../../stylesheets/marriage_component/activity/activity_detail.css";

const TabPane = Tabs.TabPane;

class Activity_detail extends React.Component{

	constructor( props ){
		super( props );
		window.scrollTo(0, 0);
		this.state = {
			activity_detail_loading : false,
			comment_page : 1,
			activity_detail : {
				activity_cover : "", 
				activity_name : "", 
				activity_deadline : "", 
				activity_start : "",
				comment_total : 0,
				activity_comment : [{ user_head : "", user_name : "", user_sex : "", comment_content : "", comment_date : "", comment_photos : [  ] }]
			}
		};
	}

	componentDidMount(){
		let _this = this;
		let { query } = this.props.location;
		let activity_id = query.activity_id;
		_this.setState({ activity_detail_loading : true });
		fetch_data_get("/marriage_api/get_activity_detail", { token : localStorage.marriage_app_token, activity_id : activity_id })
			.then((result) => {
				_this.setState({ activity_detail_loading : false, activity_detail : result.body.activity_detail });
			})
			.catch((error) => { console.log(error) });
	}

	// 切换选项卡时触发此函数
	callback( key ){
		console.log(key);
	}

	// 评论区域分页
	renew_comment( page ){
		console.log( page );
		this.setState({ comment_page : page });
	}

	render(){
		return(
			<div className="activity_detail">
				<Subject subject_content = "活动详情" />
				<div className="activity_detail_main">

					<div className="back">
						<Link to="/marriage_app/activity_management"><Icon type="left" /><span>返回</span></Link>
					</div>
					<Spin size="large" spinning={ this.state.activity_detail_loading } >
						<div className="activity_information">
							<div className="activity_cover"><img src={ this.state.activity_detail.activity_cover }/></div>
							<div className="activity_about">
								<div className="activity_name">
									<span className="label">活动名称 :</span>
									<span className="label_value">{ this.state.activity_detail.activity_name }</span>
								</div>
								<div className="activity_deadline">
									<span className="label">报名截止 :</span>
									<span className="label_value">{ this.state.activity_detail.activity_deadline }</span>
								</div>
								<div className="activity_start">
									<span className="label">活动时间 :</span>
									<span className="label_value">{ this.state.activity_detail.activity_start }</span>
								</div>
							</div>
						</div>

						<div className="activity_influence">
							<Tabs defaultActiveKey="1" onChange={ ( key ) => this.callback( key ) }>
								<TabPane tab="评论" key="1">
									<Comment activity_comment = { this.state.activity_detail.activity_comment } renew_comment = { ( page ) => this.renew_comment( page ) } comment_page = { this.state.comment_page } comment_total = { this.state.activity_detail.comment_total } />
								</TabPane>
								<TabPane tab="报名" key="2">报名</TabPane>
							</Tabs>
						</div>
					</Spin>

				</div>
			</div>
		);
	}
}

export default Activity_detail;