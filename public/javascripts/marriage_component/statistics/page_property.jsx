import React from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "Recharts";

import "../../../stylesheets/marriage_component/statistics/page_property.css";

class PageProperty extends React.Component{

	constructor( props ){
		super( props );
	}

	// 对近七天主页访问人数的数据做用户属性统计
	render(){
		return(
			<div className="homepage_user_property">
				<div className="label">近七天用户属性分析</div>
				<div className="homepage_user_property_section sex">
					<div className="title">性别</div>
					<div className="homepage_user_property_chart">
					   	<LineChart width = { 862 } height = { 400 } data = { this.props.homepage_user_property.h_sex_property } margin={{ top: 20, right: 50, left: 0, bottom: 40 }}>
					    		<XAxis dataKey="date"/>
					       		<YAxis/>
					       		<CartesianGrid strokeDasharray="3 3"/>
					       		<Tooltip/>
					       		<Legend />
					       		<Line type="monotone" dataKey="boy" stroke="#8884d8" activeDot={{ r: 8 }}/>
					       		<Line type="monotone" dataKey="girl" stroke="#82ca9d" />
					   	</LineChart>
					</div>
				</div>
				<div className="homepage_user_property_section age">
					<div className="title">年龄</div>
					<div className="homepage_user_property_chart">
						<BarChart width={ 862 } height={ 400 } data={ this.props.homepage_user_property.h_age_property } margin={{ top: 20, right: 50, left: 0, bottom: 40 }}>
						    	<XAxis dataKey="age"/>
						       	<YAxis/>
						       	<CartesianGrid strokeDasharray="3 3"/>
						       	<Tooltip/>
						       	<Legend />
						       	<Bar dataKey="boy" fill="#8884d8" />
						       	<Bar dataKey="girl" fill="#82ca9d" />
						</BarChart>
					</div>
				</div>
				<div className="homepage_user_property_section education">
					<div className="title">学历</div>
					<div className="homepage_user_property_chart">
						<BarChart width={ 862 } height={ 400 } data={ this.props.homepage_user_property.h_education_property } margin={{ top: 20, right: 50, left: 0, bottom: 40 }}>
					    		<XAxis dataKey="education"/>
					       		<YAxis/>
					       		<CartesianGrid strokeDasharray="3 3"/>
					       		<Tooltip/>
					       		<Legend />
					       		<Bar dataKey="boy" fill="#8884d8" />
					       		<Bar dataKey="girl" fill="#82ca9d" />
					    	</BarChart>
					</div>
				</div>
				<div className="homepage_user_property_section salary">
					<div className="title">月薪</div>
					<div className="homepage_user_property_chart">
						<BarChart width={ 862 } height={ 400 } data={ this.props.homepage_user_property.h_salary_property } margin={{ top: 20, right: 50, left: 0, bottom: 40 }}>
					    		<XAxis dataKey="salary"/>
					       		<YAxis/>
					       		<CartesianGrid strokeDasharray="3 3"/>
					       		<Tooltip/>
					       		<Legend />
					       		<Bar dataKey="boy" fill="#8884d8" />
					       		<Bar dataKey="girl" fill="#82ca9d" />
					    	</BarChart>
					</div>
				</div>
			</div>
		);
	}
};

export default PageProperty;