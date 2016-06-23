import React from "react";
import { Link } from "react-router";
import request from "superagent"; 
import Pager from "../common_component/pager.jsx";
import "../../../stylesheets/marriage_component/activity/activity_management.css";

class Activity_management extends React.Component{

	constructor(props){
		super(props);
		window.scrollTo(0,0);
		var activity_data_list=[
			{
				img : "../../../images/xiaode.jpg",
				title : "寻找最美的她—大型相亲活动",
				brief : "想知道你的TA在哪里吗？通过这个活动你就能找到你心爱的那个TA哦想知道你的TA在哪里吗？通过这个活动你就能找到你心爱的那个TA哦",
				read : 168,
				sign_up : 32,
				comment : 64,
				timestamp : 1459782264000
			},
			{
				img : "../../../images/xiaode.jpg",
				title : "寻找最美的她—大型相亲活动",
				brief : "想知道你的TA在哪里吗？通过这个活动你就能找到你心爱的那个TA哦",
				read : 168,
				sign_up : 32,
				comment : 64,
				timestamp : 1459782264000
			},
			{
				img : "../../../images/xiaode.jpg",
				title : "寻找最美的她—大型相亲活动",
				brief : "想知道你的TA在哪里吗？通过这个活动你就能找到你心爱的那个TA哦",
				read : 168,
				sign_up : 32,
				comment : 64,
				timestamp : 1459782264000
			}
		];
		var pages=10;
		this.state={
			activity_data_list : activity_data_list,
			pages : pages
		};
	}

	componentDidMount(){
	      	request.get("/initActivity")
	      		.accept('application/json')		/*接收什么类型的数据*/
	      		.end(function(err,res){
	      			if(err || !res.ok){
					console.log(err);
					console.log(res);
					return false;
				};
				console.log("活动列表初始化");
	      		});
	}

	/*删除活动*/
	handle_delete(timestamp){
		request.post("/deleteActivity")
			.send({
				timestamp : timestamp
			})
			.end(function(err,res){
				if(err || !res.ok){
					console.log(err);
					console.log(res);
					return false;
				};
				console.log("已经删除时间戳为 "+timestamp+" 的活动");
			});
	}

	queryByPage(page){
		request.get("/getPageActivity")
	      		.accept('application/json')
	      		.query({ page : page })
	      		.end(function(err,res){
	      			if(err || !res.ok){
					console.log(err);
					return false;
				};
				console.log("获取第"+page+"页活动");
	      		});
	}

	render(){
		return(
			<div className="activity_management">
				<div className="activity_management_header"><span>相亲活动管理</span></div>
				<div className="activity_management_main">
					{
						this.state.activity_data_list	?	

							this.state.activity_data_list.map( (element,index) => {
								return(
									<div key={ index } className="activity_list">
										<div className="activity_img_and_title_and_brief">
											<div className="activity_img"><img src={ element.img }/></div>
											<div className="activity_title_and_brief">
												<Link to={ `/marriage_app/Activity_management/Activity_detail/${ element.timestamp }` } >
													<div className="activity_title">{ element.title }</div>
												</Link>
												<div className="activity_brief">{ element.brief }</div>
											</div>
										</div>
										<div className="activity_statistics">
											{/*删除*/}
											<input type="button" ref="delete_btn" className="delete_btn" value="删除" onClick={ () => { this.handle_delete(element.timestamp) } }/>

											{/*统计数据*/}
											<div className="activity_statistics_detail">
												<div className="activity_statistics_item read">
													<span className="label">阅读</span>
													<span className="activity_statistics_data">{ element.read }</span>
												</div>
												<div className="activity_statistics_item sign_up">
													<span className="label">报名</span>
													<span className="activity_statistics_data">{ element.sign_up }</span>
												</div>
												<div className="activity_statistics_item comment">
													<span className="label">评论</span>
													<span className="activity_statistics_data">{ element.comment }</span>
												</div>
											</div>
										</div>
									</div>
								)
							} )	:	<div className="empty">暂无活动</div>
					}
					<div className="pager">
						<Pager total={ this.state.pages } onSkipTo={ (page) => { this.queryByPage(page) } }/>
					</div>
				</div>
			</div>
		);
	};
};

export default Activity_management;

