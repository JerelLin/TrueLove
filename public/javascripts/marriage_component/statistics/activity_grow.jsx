import React from "react";
import Select from "../common_component/select.jsx";
import request from "superagent";
import "../../../stylesheets/marriage_component/statistics/activity_grow.css";

class Activity_Grow extends React.Component{

	constructor(props){
		super(props);
		window.scrollTo(0,0);
		var data=[
			{
				img : "../../../images/xiaode.jpg",
				title : "冬日恋歌",
				visited : 45,
				visitor : 45,
				visited_average : 45,
				signed : 45,
				rate : "60%",
				comment : 45,
				commenter : 45,
				comment_average : 45,
				agree : 45
			},
			{
				img : "../../../images/xiaode.jpg",
				title : "冬日恋歌",
				visited : 45,
				visitor : 45,
				visited_average : 45,
				signed : 45,
				rate : "60%",
				comment : 45,
				commenter : 45,
				comment_average : 45,
				agree : 45
			},
			{
				img : "../../../images/xiaode.jpg",
				title : "冬日恋歌",
				visited : 45,
				visitor : 45,
				visited_average : 45,
				signed : 45,
				rate : "60%",
				comment : 45,
				commenter : 45,
				comment_average : 45,
				agree : 45
			},
			{
				img : "../../../images/xiaode.jpg",
				title : "冬日恋歌",
				visited : 45,
				visitor : 45,
				visited_average : 45,
				signed : 45,
				rate : "60%",
				comment : 45,
				commenter : 45,
				comment_average : 45,
				agree : 45
			}
		];
		this.state={
			activity_data : data
		};
	}

	componentDidMount(){
	      	/*初始化活动增长数据(默认获取近七天)*/
	      	request.get("/initActivityGrow")
	      		.end(function(err,res){
	      			if(err || !res.ok){
					console.log(err);
					console.log(res);
					return false;
				};
				console.log("初始化活动增长数据");
	      		});
	}

	/*select选择日期时的执行此回调*/
	onSelectDate(value){
		request.get("/getActivityByDate")
			.accept('application/json')		/*接收什么类型的数据*/
			.query({ SelectDate : value })
			.end(function(err,res){
				if(err || !res.ok){
					console.log(err);
					console.log(res);
					return false;
				};
				console.log("选择加载:  "+value+"  的数据");
			});
	}
	

	render(){
		return(
			<div className="activity_flow">
				<div className="activity_flow_title">流量统计</div>
				<div className="date_option">
					<label>活动发布时间</label>
					<Select initValue={"最近七天"} onSelectOption={ (value) => this.onSelectDate(value) }>
						<div option="最近七天"></div>
						<div option="最近十四天"></div>
					</Select>
					<div className="note">注:转化率=报名人数/阅读人数</div>
				</div>
				<div className="activities">
					{
						this.state.activity_data.map( (element,index) => {
							return(
								<div className="activities_item" key={ index }>
									<div className="activities_item_title_and_img">
										<div className="activities_item_img">
											<img src={ element.img }/>
										</div>
										<div className="activities_item_title">
											<h2>{ element.title }</h2>
										</div>
									</div>
									<div className="activities_item_flow">
										{/*统计数值*/}
										<div className="flow_stats">
											<div className="flow_stats_left">
												<div>
													<label>阅读次数</label>
													<span>{ element.visited }</span>
												</div>
												<div>
													<label>阅读人数</label>
													<span>{ element.visitor }</span>
												</div>
												<div>
													<label>人均阅读次数</label>
													<span>{ element.visited_average }</span>
												</div>
												<div>
													<label>报名人数</label>
													<span>{ element.signed }</span>
												</div>
												<div>
													<label>转化率</label>
													<span>{ element.rate }</span>
												</div>
											</div>
											<div className="flow_stats_right">
												<div>
													<label>评论次数</label>
													<span>{ element.comment }</span>
												</div>
												<div>
													<label>评论人数</label>
													<span>{ element.commenter }</span>
												</div>
												<div>
													<label>人均评论次数</label>
													<span>{ element.comment_average }</span>
												</div>
												<div>
													<label>点赞人数</label>
													<span>{ element.agree }</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							);
						} )	
					}
				</div>
			</div>
		);
	};
};

export default Activity_Grow;