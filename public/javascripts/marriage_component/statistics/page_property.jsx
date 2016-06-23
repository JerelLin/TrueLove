import React from "react";
import Select from "../common_component/select.jsx";
import ButtonControl from "../common_component/buttonControl.jsx";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "Recharts";
import { BarChart } from "react-d3-components";
import request from "superagent"; 
import "../../../stylesheets/marriage_component/statistics/page_property.css";

class Page_Property extends React.Component{

	constructor(props){
		super(props);
		window.scrollTo(0,0);
		var sex_data = [
			{ 
				name: '2-14', 
				"男": 1000, 
				"女":  800,
			},
		      	{ 
		      		name: '2-13', 
		      		"男": 800,   
		      		"女": 600, 
		      	},
		      	{ 
		      		name: '2-12', 
		      		"男": 850,   
		      		"女": 550, 
		      	},
		      	{ 
		      		name: '2-11', 
		      		"男": 400,   
		      		"女": 600, 
		      	},
		      	{ 
		      		name: '2-10', 
		      		"男": 450,   
		      		"女": 800, 
		      	},
		      	{ 
		      		name: '2-9',   
		      		"男": 500,   
		      		"女": 850,  
		      	},
		      	{ 
		      		name: '2-8',   
		      		"男": 600,   
		      		"女": 700, 
		      	},
		      	{ 
				name: '2-7', 
				"男": 1000, 
				"女": 800, 
			},
		      	{ 
		      		name: '2-6', 
		      		"男": 800,   
		      		"女": 600, 
		      	},
		      	{ 
		      		name: '2-5', 
		      		"男": 850,   
		      		"女": 550, 
		      	},
		      	{ 
		      		name: '2-4', 
		      		"男": 400,   
		      		"女": 600, 
		      	},
		      	{ 
		      		name: '2-3', 
		      		"男": 450,   
		      		"女": 800, 
		      	},
		      	{ 
		      		name: '2-2',   
		      		"男": 500,   
		      		"女": 850, 
		      	},
		      	{ 
		      		name: '2-1',   
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
		this.state = {
			sexdate : "最近七天",			/*性别区域通过state记录下所需日期及选项,这里保存所需日期*/
			sexoption : "主页访问次数",		/*这里保存选项状态*/

			sex_data : sex_data,
			age_data : age_data,
			education_data : education_data,
			salary_data : salary_data
		};
	}

	/*折线图提示*/
	tooltipLine(label, data){
        		return data.y;
	}

	/*柱状图提示*/
	tooltip(x, y0, y, total){
		return y.toString();
	}

	componentDidMount(){
	      	/*初始化主页用户属性数据(默认都是获取主页访问次数的数据)*/
	      	request.get("/initPageProperty")
	      		.end(function(err,res){
	      			if(err || !res.ok){
					console.log(err);
					console.log(res);
					return false;
				};
				console.log("初始化主页用户属性数据");
	      		});
	}

	/*select选择时间段时执行此回调*/
	onSelectDate(value){
		var _this=this;
		this.setState({
			sexdate : value
		});
		request.get("/PagePropertyFlow")
			.accept('application/json')		/*接收什么类型的数据*/
			.query({
				type : "sex",			/*性别类型*/
				selectDate : value,		/*日期选择*/
				option : this.state.sexoption        /*访问流量类型选项*/
			})
			.end(function(err,res){
				if(err || !res.ok){
					console.log(err);
					console.log(res);
					return false;
				};
				console.log("发送"+ "sex" + value + _this.state.sexoption);
			});
	}

	/*相应的tag被选择时从服务端获取相应数据(sex区域有option选项以及日期选项)*/
	requestPageStatistic(type,option){
		var _this=this;
		if(type=="sex"){
			this.setState({
				sexoption : option
			});
			request.get("/PagePropertyFlow")
				.accept('application/json')
				.query({
					type : type,
					selectDate : this.state.sexdate,
					option : option
				})
				.end(function(err,res){
					if(err || !res.ok){
						console.log(err);
						return false;
					}
					console.log("发送"+ type +option + _this.state.sexdate);
				});
		}else{
			request.get("/PagePropertyFlow")
				.accept('application/json')
				.query({
					type : type,
					selectDate : null,	//除了性别域其他的没有时间段选项
					option : option
				})
				.end(function(err,res){
					if(err || !res.ok){
						console.log(err);
						return false;
					}
					console.log("发送"+ type +option);
				});
		};
	}

	render(){
		return(
			<div className="page_userProperty">
				{/*性别分布*/}
				<div className="userProperty_section sex">
					<div className="title">性别</div>
					<div className="visitedSelect">
						<ButtonControl onSelectType={ (option) => this.requestPageStatistic("sex",option) }>
							<input type="button" value="主页访问次数"/>
							<input type="button" value="主页访问人数"/>
						</ButtonControl>
					</div>
					<div className="date_option">
						<label>选择日期</label>
						<Select initValue={ "最近七天" } onSelectOption={ (value) => this.onSelectDate(value) }>
							<div option="最近七天"></div>
							<div option="最近十四天"></div>
						</Select>
					</div>
					<div className="note">
					
					</div>
					<div className="userProperty_d3">
					                <LineChart width={862} height={400} data={this.state.sex_data}
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
					<div className="visitedSelect">
						<ButtonControl onSelectType={ (option) => this.requestPageStatistic("age",option) }>
							<input type="button" value="主页访问次数"/>
							<input type="button" value="主页访问人数"/>
						</ButtonControl>
					</div>
					<div className="note">
						<div className="man">男</div>
						<div className="woman">女</div>
					</div>
					<div className="userProperty_d3">
					                <BarChart
						        groupedBars
						        data={ this.state.age_data }
						        width={ 862 }
						        height={400}
						        margin={{top: 20, bottom: 40, left: 85, right: 20}}
						        tooltipHtml={ this.tooltip.bind(this) }
        						        tooltipContained/>
					</div>
				</div>
				{/*学历分布*/}
				<div className="userProperty_section education">
					<div className="title">学历</div>
					<div className="visitedSelect">
						<ButtonControl onSelectType={ (option) => this.requestPageStatistic("education",option) }>
							<input type="button" value="主页访问次数"/>
							<input type="button" value="主页访问人数"/>
						</ButtonControl>
					</div>
					<div className="note">
						<div className="man">男</div>
						<div className="woman">女</div>
					</div>
					<div className="userProperty_d3">
						<BarChart
						        groupedBars
						        data={ this.state.education_data }
						        width={ 862 }
						        height={400}
						        margin={{top: 20, bottom: 40, left: 85, right: 20}}
						        tooltipHtml={ this.tooltip.bind(this) }
        						        tooltipContained/>
					</div>
				</div>
				{/*月薪分布*/}
				<div className="userProperty_section salary">
					<div className="title">月薪</div>
					<div className="visitedSelect">
						<ButtonControl onSelectType={ (option) => this.requestPageStatistic("salary",option) }>
							<input type="button" value="主页访问次数"/>
							<input type="button" value="主页访问人数"/>
						</ButtonControl>
					</div>
					<div className="note">
						<div className="man">男</div>
						<div className="woman">女</div>
					</div>
					<div className="userProperty_d3">
						<BarChart
						        groupedBars
						        data={ this.state.salary_data }
						        width={ 862 }
						        height={400}
						        margin={{top: 20, bottom: 40, left: 85, right: 20}}
						        tooltipHtml={ this.tooltip.bind(this) }
        						        tooltipContained/>
					</div>
				</div>
			</div>
		);
	}
};

export default Page_Property;