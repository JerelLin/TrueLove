import React from "react";
import Select from "../common_component/select.jsx";
import ButtonControl from "../common_component/buttonControl.jsx";
import { BarChart } from "react-d3-components";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "Recharts";
import request from "superagent";
import "../../../stylesheets/marriage_component/statistics/activity_property.css";

class Activity_Property extends React.Component{

	constructor(props){
		super(props);
		window.scrollTo(0,0);
		var sex_data = [
			{ 
				name: '活动A', 
				"男": 1000, 
				"女":  800,
			},
		      	{ 
		      		name: '活动B', 
		      		"男": 800,   
		      		"女": 600, 
		      	},
		      	{ 
		      		name: '活动C', 
		      		"男": 850,   
		      		"女": 550, 
		      	},
		      	{ 
		      		name: '活动D', 
		      		"男": 400,   
		      		"女": 600, 
		      	},
		      	{ 
		      		name: '活动E', 
		      		"男": 450,   
		      		"女": 800, 
		      	},
		      	{ 
		      		name: '活动F',   
		      		"男": 500,   
		      		"女": 850,  
		      	},
		      	{ 
		      		name: '活动G',   
		      		"男": 600,   
		      		"女": 700, 
		      	},
		      	{ 
				name: '活动H', 
				"男": 1000, 
				"女": 800, 
			},
		      	{ 
		      		name: '活动I', 
		      		"男": 800,   
		      		"女": 600, 
		      	},
		      	{ 
		      		name: '活动J', 
		      		"男": 850,   
		      		"女": 550, 
		      	},
		      	{ 
		      		name: '活动K', 
		      		"男": 400,   
		      		"女": 600, 
		      	},
		      	{ 
		      		name: '活动L', 
		      		"男": 450,   
		      		"女": 800, 
		      	},
		      	{ 
		      		name: '活动M',   
		      		"男": 500,   
		      		"女": 850, 
		      	},
		      	{ 
		      		name: '活动N',   
		      		"男": 600,   
		      		"女": 700, 
		      	}
		];
		var age_data = [
		    	{
			    label: 'man',
			    values: [{x: "18~25岁", y: 1000}, {x: "25~30岁", y: 800}, {x: "30~35岁", y: 850}, {x: "35~40岁", y: 1100}, {x: "40~45岁", y: 1150}, {x: "45岁~50岁", y: 1400}, {x: "50岁以上", y: 700}]
		    	},
		    	{
			    label: 'woman',
			    values: [{x: "18~25岁", y: 500}, {x: "25~30岁", y: 600}, {x: "30~35岁", y: 1050}, {x: "35~40岁", y: 700}, {x: "40~45岁", y: 1300}, {x: "45岁~50岁", y: 1500}, {x: "50岁以上", y: 900}]
		    	}
		];
		var education_data = [
		    	{
			    label: 'man',
			    values: [{x: "初中及以下", y: 1000}, {x: "中专", y: 800}, {x: "高中", y: 850}, {x: "大专", y: 1100}, {x: "本科", y: 1150}, {x: "硕士", y: 1400}, {x: "博士", y: 700},{x: "博士后", y: 500}]
		    	},
		    	{
			    label: 'woman',
			    values: [{x: "初中及以下", y: 500}, {x: "中专", y: 600}, {x: "高中", y: 1050}, {x: "大专", y: 700}, {x: "本科", y: 1300}, {x: "硕士", y: 1500}, {x: "博士", y: 900},{x: "博士后", y: 700}]
		    	}
		];
		var salary_data = [
		    	{
			    label: 'man',
			    values: [{x: "2000以下", y: 1000}, {x: "2000~5000", y: 800}, {x: "5000~8000", y: 850}, {x: "8000~10000", y: 1100}, {x: "10000~20000", y: 1150}, {x: "20000~50000", y: 1400}, {x: "50000以上", y: 700}]
		    	},
		    	{
			    label: 'woman',
			    values: [{x: "2000以下", y: 500}, {x: "2000~5000", y: 600}, {x: "5000~8000", y: 1050}, {x: "8000~10000", y: 700}, {x: "10000~20000", y: 1300}, {x: "20000~50000", y: 1500}, {x: "50000以上", y: 900}]
		    	}
		];
		this.state={
			/*UI状态*/
			sex_select : "最近七个活动",
			age_select : "A活动",
			education_select : "A活动",
			salary_select : "A活动",
			sex_tag : "阅读次数",
			age_tag : "阅读次数",
			education_tag : "阅读次数",
			salary_tag : "阅读次数",

			/*数据状态*/
			sex_data : sex_data,
			age_data : age_data,
			education_data : education_data,
			salary_data : salary_data
		};
	}

	/*折线图提示*/
	tooltipLine(label, data) {
        		return " x: " + data.x + " y: " + data.y;
	}

	/*柱状图提示*/
	tooltip(x, y0, y, total){
		return y.toString();
	}

	componentDidMount(){
	      	/*初始化活动用户属性数据(默认都是获取活动阅读次数的数据)*/
	      	request.get("/initActivityProperty")
	      		.accept('application/json')
	      		.end(function(err,res){
	      			if(err || !res.ok){
					console.log(err);
					return false;
				};
				console.log("初始化活动用户属性数据");
	      		});
	}


	/*select选择近期活动数量时执行此回调*/
	onSelectActivity(type,value){
		var flowTag=null;					/*访问流量类型选项*/
		switch(type){
			case "sex" :
				this.setState({
					sex_select : value
				});
				flowTag=this.state.sex_tag;
				break;
			case "age" :
				this.setState({
					age_select : value
				});
				flowTag=this.state.age_tag;
				break;
			case "education" :
				this.setState({
					education_select : value 
				});
				flowTag=this.state.education_tag;
				break;
			case "salary" : 
				this.setState({
					salary_select : value
				});
				flowTag=this.state.salary_tag;
				break;

		};
		request.get("/ActivityPropertyFlow")
			.accept('application/json')
			.query({
				type : type,				/*性别等类型*/
				selectValue : value,			/*近期活动数量或具体活动选择*/
				flowTag : flowTag        			/*访问流量类型选项*/
			})
			.end(function(err,res){
				if(err || !res.ok){
					console.log(err);
					console.log(res);
					return false;
				};
				console.log("发送"+ type + value + flowTag);
			});
	}

	/*相应的tag被选择时从服务端获取相应数据*/
	requestActivityStatistic(type,option){
		var _this=this;
		var selectValue=null;					/*访问流量类型选项*/
		switch(type){
			case "sex" :
				this.setState({
					sex_tag : option
				});
				selectValue=this.state.sex_select;
				break;
			case "age" :
				this.setState({
					age_tag : option
				});
				selectValue=this.state.age_select;
				break;
			case "education" :
				this.setState({
					education_tag : option 
				});
				selectValue=this.state.education_select;
				break;
			case "salary" : 
				this.setState({
					salary_tag : option
				});
				selectValue=this.state.salary_select;
				break;

		};
		request.get("/ActivityPropertyFlow")
			.accept('application/json')
			.query({
				type : type,				/*性别等类型*/
				selectValue : selectValue,		/*近期活动数量或具体活动选择*/
				flowTag : option        			/*访问流量类型选项*/
			})
			.end(function(err,res){
				if(err || !res.ok){
					console.log(err);
					return false;
				};
				console.log("发送"+ type + selectValue + option);
			});
	}


	render(){
		return(
			<div className="activity_userProperty">
				{/*性别分布*/}
				<div className="userProperty_section sex">
					<div className="title">性别</div>
					<div className="typeSelect">
						<ButtonControl onSelectType={ (option) => this.requestActivityStatistic("sex",option) }>
							<input type="button" value="阅读次数"/>
							<input type="button" value="阅读人数"/>
							<input type="button" value="人均阅读次数"/>
							<input type="button" value="报名人数"/>
							<input type="button" value="转化率"/>
							<input type="button" value="评论次数"/>
							<input type="button" value="评论人数"/>
							<input type="button" value="人均评论次数"/>
							<input type="button" value="点赞人数"/>
						</ButtonControl>
					</div>
					<div className="option">
						<label>选择</label>
						<Select initValue={"最近七个活动"} onSelectOption={ (value) => this.onSelectActivity("sex",value) }>
							<div option="最近七个活动"></div>
							<div option="最近十四个活动"></div>
						</Select>
					</div>
					<div className="note">
						
					</div>
					<div className="userProperty_d3">
					                <LineChart width={882} height={400} data={this.state.sex_data}
					            		      margin={{top: 20, right: 10, left: 10, bottom: 40}}>
					       		<XAxis dataKey="name"/>
					       		<YAxis/>
					       		<CartesianGrid strokeDasharray="3 3"/>
					       		<Tooltip/>
					       		<Legend />
					       		<Line type="monotone" dataKey="男" stroke="#8884d8" activeDot={{r: 8}}/>
					       		<Line type="monotone" dataKey="女" stroke="#82ca9d" />
					      	</LineChart>
					</div>
				</div>
				{/*年龄分布*/}
				<div className="userProperty_section age">
					<div className="title">年龄</div>
					<div className="typeSelect">
						<ButtonControl onSelectType={ (option) => this.requestActivityStatistic("age",option) }>
							<input type="button" value="阅读次数"/>
							<input type="button" value="阅读人数"/>
							<input type="button" value="人均阅读次数"/>
							<input type="button" value="报名人数"/>
							<input type="button" value="转化率"/>
							<input type="button" value="评论次数"/>
							<input type="button" value="评论人数"/>
							<input type="button" value="人均评论次数"/>
							<input type="button" value="点赞人数"/>
						</ButtonControl>
					</div>
					<div className="option">
						<label>选择活动</label>
						<Select initValue={"A活动"} onSelectOption={ (value) => this.onSelectActivity("age",value) }>
							<div option="A活动"></div>
							<div option="B活动"></div>
							<div option="C活动"></div>
						</Select>
					</div>
					<div className="note">
						<div className="man">男</div>
						<div className="woman">女</div>
					</div>
					<div className="userProperty_d3">
					           <BarChart
						        groupedBars
						        data={ this.state.age_data }
						        width={ 882 }
						        height={400}
						        margin={{top: 20, bottom: 40, left: 85, right: 20}}
						        tooltipHtml={ this.tooltip.bind(this) }
        						        tooltipContained/>
					</div>
				</div>
				{/*学历分布*/}
				<div className="userProperty_section education">
					<div className="title">学历</div>
					<div className="typeSelect">
						<ButtonControl onSelectType={ (option) => this.requestActivityStatistic("education",option) }>
							<input type="button" value="阅读次数"/>
							<input type="button" value="阅读人数"/>
							<input type="button" value="人均阅读次数"/>
							<input type="button" value="报名人数"/>
							<input type="button" value="转化率"/>
							<input type="button" value="评论次数"/>
							<input type="button" value="评论人数"/>
							<input type="button" value="人均评论次数"/>
							<input type="button" value="点赞人数"/>
						</ButtonControl>
					</div>
					<div className="option">
						<label>选择活动</label>
						<Select initValue={"A活动"} onSelectOption={ (value) => this.onSelectActivity("education",value) }>
							<div option="A活动"></div>
							<div option="B活动"></div>
							<div option="C活动"></div>
						</Select>
					</div>
					<div className="note">
						<div className="man">男</div>
						<div className="woman">女</div>
					</div>
					<div className="userProperty_d3">
						<BarChart
						        groupedBars
						        data={ this.state.education_data }
						        width={ 882 }
						        height={400}
						        margin={{top: 20, bottom: 40, left: 85, right: 20}}
						        tooltipHtml={ this.tooltip.bind(this) }
        						        tooltipContained/>
					</div>
				</div>
				{/*月薪分布*/}
				<div className="userProperty_section salary">
					<div className="title">月薪</div>
					<div className="typeSelect">
						<ButtonControl onSelectType={ (option) => this.requestActivityStatistic("salary",option) }>
							<input type="button" value="阅读次数"/>
							<input type="button" value="阅读人数"/>
							<input type="button" value="人均阅读次数"/>
							<input type="button" value="报名人数"/>
							<input type="button" value="转化率"/>
							<input type="button" value="评论次数"/>
							<input type="button" value="评论人数"/>
							<input type="button" value="人均评论次数"/>
							<input type="button" value="点赞人数"/>
						</ButtonControl>
					</div>
					<div className="option">
						<label>选择活动</label>
						<Select initValue={"A活动"} onSelectOption={ (value) => this.onSelectActivity("salary",value) }>
							<div option="A活动"></div>
							<div option="B活动"></div>
							<div option="C活动"></div>
						</Select>
					</div>
					<div className="note">
						<div className="man">男</div>
						<div className="woman">女</div>
					</div>
					<div className="userProperty_d3">
						<BarChart
						        groupedBars
						        data={ this.state.salary_data }
						        width={ 882 }
						        height={ 400 }
						        margin={{top: 20, bottom: 40, left: 85, right: 20}}
						        tooltipHtml={ this.tooltip.bind(this) }
        						        tooltipContained/>
					</div>
				</div>
			</div>
		);
	}
};

export default Activity_Property;