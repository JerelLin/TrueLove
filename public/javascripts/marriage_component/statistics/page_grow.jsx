import React from "react";
// import { LineChart } from "react-d3-components";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "Recharts";
import Select from "../common_component/select.jsx";
import request from "superagent";
import "../../../stylesheets/marriage_component/statistics/page_grow.css";

class Page_Grow extends React.Component{

	constructor(props){
		super(props);
		window.scrollTo(0,0);
		var flow_sum={
			click_sum : 1000000,
			visitor_sum : 1000,
			click_average : 1000
		};
		var flow_recent={
			data : [
				{
					date : "2016 2 20",
					visitor : 1000,
					click : 1000
				},
				{
					date : "2016 2 19",
					visitor : 1000,
					click : 1000
				},
				{
					date : "2016 2 18",
					visitor : 1000,
					click : 1000
				},
				{
					date : "2016 2 17",
					visitor : 1000,
					click : 1000
				},
				{
					date : "2016 2 16",
					visitor : 1000,
					click : 1000
				},
				{
					date : "2016 2 15",
					visitor : 1000,
					click : 1000
				},
				{
					date : "2016 2 14",
					visitor : 1000,
					click : 1000
				}
			]
		};
		/*grow_data在nodejs层组装后返回，因为grow_data源于flow_recent*/
		var grow_data = [

			{ 
				name: '2-14', 
				"主页访问人数": 1000, 
				"主页访问次数": 800, 
				amt: 2400 
			},
		      	{ 
		      		name: '2-13', 
		      		"主页访问人数": 800,   
		      		"主页访问次数": 600, 
		      		amt: 2210 
		      	},
		      	{ 
		      		name: '2-12', 
		      		"主页访问人数": 850,   
		      		"主页访问次数": 550, 
		      		amt: 2290 
		      	},
		      	{ 
		      		name: '2-11', 
		      		"主页访问人数": 400,   
		      		"主页访问次数": 600, 
		      		amt: 2000 
		      	},
		      	{ 
		      		name: '2-10', 
		      		"主页访问人数": 450,   
		      		"主页访问次数": 800, 
		      		amt: 2181 
		      	},
		      	{ 
		      		name: '2-9',   
		      		"主页访问人数": 500,   
		      		"主页访问次数": 850, 
		      		amt: 2500 },
		      	{ 
		      		name: '2-8',   
		      		"主页访问人数": 600,   
		      		"主页访问次数": 700, 
		      		amt: 2100 
		      	}
		  
		];
		this.state={
			flow_sum : flow_sum,
			flow_recent : flow_recent,
			grow_data : grow_data,
		};
	}

	componentDidMount(){
	      	/*初始化主页增长数据(默认获取近七天数据)*/
	      	request.get("/initPageGrow")
	      		.end(function(err,res){
	      			if(err || !res.ok){
					console.log(err);
					console.log(res);
					return false;
				};
				console.log("初始化主页增长数据");
	      		});
	}

	/*select选择日期时的执行此回调*/
	onSelectDate(value){
		request.get("/getFlowByDate")
			.accept('application/json')		/*接收什么类型的数据*/
			.query({ SelectDate : value })
			.end(function(err,res){
				if(err || !res.ok){
					console.log(err);
					return false;
				};
				console.log("选择加载:  "+value+"  的数据");
			});
	}

	render(){
		return(
			<div className="page_flow">
				<div className="flow_sum">
					<div className="flow_title">累计流量统计</div>
					<div className="flow_sum_table">
						<table className="table">
							<tbody>
								<tr className="table_header">
									<td>主页累计访问次数</td>
									<td>主页累计访问人数</td>
									<td>人均主页累计访问次数</td>
								</tr>
								<tr>
									<td>{ this.state.flow_sum.click_sum }</td>
									<td>{ this.state.flow_sum.visitor_sum }</td>
									<td>{ this.state.flow_sum.click_average }</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<div className="flow_recent">
					<div className="flow_title">近期流量统计</div>
					<div className="date_option">
						<label>选择日期</label>
						<Select initValue={ "最近七天" } onSelectOption={ (value) => this.onSelectDate(value) }>
							<div option="最近七天"></div>
							<div option="最近十四天"></div>
						</Select>
					</div>
					<div className="flow_table_show">
						<table className="table">
							<tbody>
								<tr className="table_header">
									<td>时间</td>
									<td>主页访问人数</td>
									<td>主页访问次数</td>
								</tr>
								{
									this.state.flow_recent.data.map( (element,index) => {
										return(
											<tr key={ index }>
												<td>{ element.date }</td>
												<td>{ element.visitor }</td>
												<td>{ element.click }</td>
											</tr>
										);
									})
								}
							</tbody>
						</table>
					</div>
					<div className="flow_d3_show">
						<div className="flow_d3_show_title"> 增长趋势</div>
						<div className="note">
							
						</div>
						<LineChart width={862} height={400} data={this.state.grow_data}
					            		      margin={{top: 20, right: 10, left: 10, bottom: 40}}>
					       		<XAxis dataKey="name"/>
					       		<YAxis/>
					       		<CartesianGrid strokeDasharray="3 3"/>
					       		<Tooltip/>
					       		<Legend />
					       		<Line type="monotone" dataKey="主页访问人数" stroke="#8884d8" activeDot={{r: 8}}/>
					       		<Line type="monotone" dataKey="主页访问次数" stroke="#82ca9d" />
					      	</LineChart>
					</div>
				</div>
			</div>
		);
	}
};

export default Page_Grow;