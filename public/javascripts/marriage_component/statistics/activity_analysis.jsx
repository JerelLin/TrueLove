import React from "react";
import { Tabs, Spin } from "antd";
import { fetch_data_get } from "../../../../mini_function/fetch.js";
import Subject from "../layout_component/subject.jsx";
import ActivityGrow from "./activity_grow.jsx";

import "../../../stylesheets/marriage_component/statistics/activity_analysis.css";

const TabPane = Tabs.TabPane;

class Activity_analysis extends React.Component{

	constructor( props ){
		super( props );
		this.state={
			loading : false,
			activity_analysis_data : {
				activity_flow : [ {  } ]
			}
		};
	}

	componentDidMount(){
		let _this = this;
		_this.setState({ loading : true });
		fetch_data_get("/marriage_api/get_activity_analysis_data", { token : localStorage.marriage_app_token })
			.then(( result ) => {
				let activity_flow = result.body.activity_analysis_data.activity_flow;
				_this.setState({ loading : false, activity_analysis_data : { activity_flow : activity_flow } });
			})
			.catch(( error ) => console.log( error ));      
	}

	// 切换选项卡
	callback( key ){
		console.log( key )
	}

	render(){
		return(
			<div className="activity_analysis">
				<Subject subject_content = "活动分析" />
				<div className="activity_analysis_main">
					<Spin size="large" spinning={ this.state.loading } >
						<Tabs defaultActiveKey="1" onChange={ ( key ) => this.callback( key ) }>
							<TabPane tab="用户增长" key="1">
								<ActivityGrow activity_flow = { this.state.activity_analysis_data.activity_flow }/>
							</TabPane>
							<TabPane tab="用户属性" key="2">
								用户属性
							</TabPane>
						</Tabs>
					</Spin>
				</div>
			</div>
		);
	};
};

export default Activity_analysis;