import React from "react";
import { Tabs, Spin } from "antd";
import { fetch_data_get } from "../../../../mini_function/fetch.js";
import Subject from "../layout_component/subject.jsx";
import PageGrow from "./page_grow.jsx";
import PageProperty from "./page_property.jsx";

import "../../../stylesheets/marriage_component/statistics/page_analysis.css";

const TabPane = Tabs.TabPane;

class Page_analysis extends React.Component{

	constructor( props ){
		super( props );
		this.state={
			loading : false,
			trend_growth : [  ],
			page_analysis_data : {
				homepage_total_flow : {  },
				homepage_recent_flow : [ {  } ],
				homepage_user_property : { sex_property : [ {  } ], age_property : [ {  } ], education_property : [ {  } ], salary_property : [ {  } ] }
			}
		};
	}

	componentDidMount(){
		let _this = this;
		_this.setState({ loading : true });
		fetch_data_get("/marriage_api/get_page_analysis_data", { token : localStorage.marriage_app_token })
			.then(( result ) => {
				// 组装数据 添加 key 字段
				let trend_growth = [  ];
				let homepage_recent_flow = [  ];
				let homepage_total_flow = result.body.page_analysis_data.homepage_total_flow;
				let homepage_user_property = result.body.page_analysis_data.homepage_user_property;
				result.body.page_analysis_data.homepage_recent_flow.map((ele, key) => {
					homepage_recent_flow.push({ key : key, date : ele.date, visitor : ele.visitor, click : ele.click });
					trend_growth.push({ name : ele.date, "主页访问人数" : ele.visitor, "主页访问次数" : ele.click });
				});
				_this.setState({ loading : false, trend_growth : trend_growth, page_analysis_data : { homepage_total_flow : homepage_total_flow, homepage_recent_flow : homepage_recent_flow, homepage_user_property : homepage_user_property } });
			})
			.catch(( error ) => console.log( error ));      
	}

	// 切换选项卡
	callback( key ){
		console.log( key )
	}

	render(){
		return(
			<div className="page_analysis">
				<Subject subject_content = "主页分析" />
				<div className="page_analysis_main">
					<Spin size="large" spinning={ this.state.loading } >
						<Tabs defaultActiveKey="1" onChange={ ( key ) => this.callback( key ) }>
							<TabPane tab="用户增长" key="1">
								<PageGrow homepage_total_flow = {[ this.state.page_analysis_data.homepage_total_flow ]} homepage_recent_flow = { this.state.page_analysis_data.homepage_recent_flow } trend_growth = { this.state.trend_growth } />
							</TabPane>
							<TabPane tab="用户属性" key="2">
								<PageProperty homepage_user_property = { this.state.page_analysis_data.homepage_user_property }/>
							</TabPane>
						</Tabs>
					</Spin>
				</div>
			</div>
		);
	}
};

export default Page_analysis;