import React from "react";
import { Table, Select } from "antd";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "Recharts";

import "../../../stylesheets/marriage_component/statistics/page_grow.css";

const Option = Select.Option;

class PageGrow extends React.Component{

	constructor( props ){
		super( props )
	}

	render(  ){
		const homepage_total_flow_columns = [
			{ title: "主页累计访问次数", dataIndex: "click_total", key: "click_total" },
			{ title: "主页累计访问人数", dataIndex: "visitor_total", key: "visitor_total" }, 
			{ title: "人均主页累计访问次数", dataIndex: "click_average", key: "click_average" }
		];
		const homepage_recent_flow_columns = [
			{ title: "日期", dataIndex: "date", key: "date" },
			{ title: "主页访问人数", dataIndex: "visitor", key: "visitor" }, 
			{ title: "主页访问次数", dataIndex: "click", key: "click" }
		];
		return(
			<div className="page_grow">
				<div className="homepage_total_flow">
					<div className="homepage_total_flow_title title">累计流量统计</div>
					<div className="homepage_total_flow_table">
						<Table columns = { homepage_total_flow_columns } dataSource = { this.props.homepage_total_flow } pagination = { false } />
					</div>
				</div>
				<div className="homepage_recent_flow">
					<div className="homepage_recent_flow_title title">近期流量统计</div>
					<div className="date_select">
						<label>选择日期</label>
						<Select labelInValue defaultValue = {{ key: "7" }} style = {{ width: 150 }} onChange = { ( value ) => this.props.date_select( value ) }>
					    		<Option value = "7">最近一个星期</Option>
					      		<Option value = "30">最近一个月</Option>
					    	</Select>
					</div>
					<div className="homepage_recent_flow_table">
						<Table columns = { homepage_recent_flow_columns } dataSource = { this.props.homepage_recent_flow } />
					</div>
					<div className="homepage_recent_flow_Chart">
						<div className="homepage_recent_flow_Chart_title title"> 增长趋势</div>
						<LineChart width = { 862 } height = { 400 } data = { this.props.trend_growth } margin={{ top: 20, right: 20, left: 0, bottom: 40 }}>
					    	<XAxis dataKey="name"/>
					       	<YAxis/>
					       	<CartesianGrid strokeDasharray="3 3"/>
					       	<Tooltip/>
					       	<Legend />
					       	<Line type="monotone" dataKey="主页访问人数" stroke="#8884d8" activeDot={{ r: 8 }}/>
					       	<Line type="monotone" dataKey="主页访问次数" stroke="#82ca9d" />
					    </LineChart>
					</div>
				</div>
			</div>
		)
	}
};

export default PageGrow;