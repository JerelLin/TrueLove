import React from "react";
import { Select } from "antd";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "Recharts";

import "../../../stylesheets/marriage_component/statistics/activity_property.css";

const Option = Select.Option;

class ActivityProperty extends React.Component{

	constructor( props ){
		super( props )
	}

	render(  ){
		return(
			<div className="activity_user_property_wrap">
				<div className="activity_user_property sex">
					<div className="title">性别</div>
					<div className="typeSelect">
						<label>选择活动统计属性</label>
						<Select labelInValue defaultValue = {{ key: "read" }} style = {{ width: 150 }} onChange = { ( value ) => this.props.typeSelect( value ) }>
					    		<Option value = "read"> 阅读次数 </Option>
					      		<Option value = "visitor"> 阅读人数 </Option>
					      		<Option value = "sign_up"> 报名人数 </Option>
					      		<Option value = "percent_conversion"> 转化率 </Option>
					      		<Option value = "comment"> 评论次数 </Option>
					      		<Option value = "reviewer"> 评论人数 </Option>
					      		<Option value = "number_of_points_like"> 点赞人数 </Option>
					    	</Select>
					</div>
					<div className="activitySelect">
						<label>选择需要统计活动</label>
						<Select labelInValue defaultValue = {{ key : "7" }} style = {{ width: 180 }} onChange = { ( value ) => this.props.activitySelect( value ) }>
					    		<Option value = "7"> 最近7天内的所有活动 </Option>
					      		<Option value = "30"> 最近30天内的所有活动 </Option>
					    	</Select>
					</div>
					<div className="activity_user_property_chart">
						<LineChart width = { 862 } height = { 400 } data = { this.props.activity_user_property.a_sex_property } margin={{ top: 20, right: 100, left: 0, bottom: 40 }}>
					    		<XAxis dataKey="activity_name"/>
					       		<YAxis/>
					       		<CartesianGrid strokeDasharray="3 3"/>
					       		<Tooltip/>
					       		<Legend />
					       		<Line type="monotone" dataKey="boy" stroke="#8884d8" activeDot={{ r: 8 }}/>
					       		<Line type="monotone" dataKey="girl" stroke="#82ca9d" />
					   	</LineChart>
					</div>
				</div>
				<div className="activity_user_property age">
					<div className="title">年龄</div>
					<ActivitySelect property = "age" activity_brief = { this.props.activity_brief } typeSelect = { ( value ) => this.props.typeSelect( value ) } activitySelect = { ( value ) => this.props.activitySelect( value ) }/>
					<div className="activity_user_property_chart">
					           <BarChart width={ 862 } height={ 400 } data={ this.props.activity_user_property.a_age_property } margin={{ top: 20, right: 100, left: 0, bottom: 40 }}>
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
				<div className="activity_user_property education">
					<div className="title">学历</div>
					<ActivitySelect property = "education" activity_brief = { this.props.activity_brief } typeSelect = { ( value ) => this.props.typeSelect( value ) } activitySelect = { ( value ) => this.props.activitySelect( value ) }/>
					<div className="activity_user_property_chart">
						<BarChart width={ 862 } height={ 400 } data={ this.props.activity_user_property.a_education_property } margin={{ top: 20, right: 100, left: 0, bottom: 40 }}>
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
				<div className="activity_user_property salary">
					<div className="title">月薪</div>
					<ActivitySelect property = "salary" activity_brief = { this.props.activity_brief } typeSelect = { ( value ) => this.props.typeSelect( value ) } activitySelect = { ( value ) => this.props.activitySelect( value ) }/>
					<div className="activity_user_property_chart">
						<BarChart width={ 862 } height={ 400 } data={ this.props.activity_user_property.a_salary_property } margin={{ top: 20, right: 100, left: 0, bottom: 40 }}>
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
		)
	}
};

class ActivitySelect extends React.Component{

	constructor( props ){
		super( props )
	}

	render(  ){
		return(
			<div className="activitySelect_box">
				<div className="typeSelect">
					<label>选择活动统计属性</label>
					<Select labelInValue defaultValue = {{ key: "read" }} style = {{ width: 150 }} onChange = { ( value ) => this.props.typeSelect( value ) }>
						<Option value = "read"> 阅读次数 </Option>
						<Option value = "visitor"> 阅读人数 </Option>
						<Option value = "sign_up"> 报名人数 </Option>
						<Option value = "percent_conversion"> 转化率 </Option>
						<Option value = "comment"> 评论次数 </Option>
						<Option value = "reviewer"> 评论人数 </Option>
						<Option value = "number_of_points_like"> 点赞人数 </Option>
					</Select>
				</div>
				<div className="activitySelect">
					<label>选择需要统计活动</label>
					<Select labelInValue defaultValue = {{ label : this.props.activity_brief[ 0 ].activity_name }} style = {{ width: 250 }} onChange = { ( value ) => this.props.activitySelect( value ) }>
						{
							this.props.activity_brief.map(( ele, key ) => {
								return(
									<Option key = { ele.activity_id }>{ ele.activity_name }</Option>
								)
							})
						}
					</Select>
				</div>
			</div>
		)
	}
}

export default ActivityProperty;