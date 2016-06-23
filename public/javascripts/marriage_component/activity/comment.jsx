import React from "react";
import request from "superagent"; 
import Pager from "../common_component/pager.jsx";

class Comment extends React.Component{

	constructor(props){
		super(props);
		var activity_comment=[
			{
				head : "../../../images/xiaode.jpg",
				name : "小妖狐",
				sex : "女",
				comment : "在这里找到的心中的那个他啦，好幸运~给活动点个大大的赞在这里找到的心中的那个他啦，好幸运在这里找到的心中的那个他啦，好幸运在这里找到的心中的那个他啦，好幸运",
				date : "2016-03-08 24:00",
				photos : [ "../../../images/xiaode.jpg", "../../../images/xiaode.jpg", "../../../images/xiaode.jpg", "../../../images/xiaode.jpg", "../../../images/xiaode.jpg", "../../../images/xiaode.jpg", "../../../images/xiaode.jpg", "../../../images/xiaode.jpg"]
			},
			{
				head : "../../../images/xiaode.jpg",
				name : "小妖狐",
				sex : "女",
				comment : "在这里找到的心中的那个他啦，好幸运~给活动点个大大的赞在这里找到的心中的那个他啦，好幸运在这里找到的心中的那个他啦，好幸运在这里找到的心中的那个他啦，好幸运在这里找到的心中的那个他啦，好幸运~给活动点个大大的赞在这里找到的心中的那个他啦，好幸运在这里找到的心中的那个他啦，好幸运在这里找到的心中的那个他啦，好幸运在这里找到的心中的那个他啦，好幸运~给活动点个大大的赞在这里找到的心中的那个他啦，好幸运在这里找到的心中的那个他啦，好幸运在这里找到的心中的那个他啦，好幸运",
				date : "2016-03-08 24:00",
				photos : [ "../../../images/xiaode.jpg", "../../../images/xiaode.jpg"]
			},
			{
				head : "../../../images/xiaode.jpg",
				name : "小妖狐",
				sex : "女",
				comment : "在这里找到的心中的那个他啦，好幸运~给活动点个大大的赞在这里找到的心中的那个他啦，好幸运在这里找到的心中的那个他啦，好幸运在这里找到的心中的那个他啦，好幸运",
				date : "2016-03-08 24:00",
				photos : [ "../../../images/xiaode.jpg", "../../../images/xiaode.jpg", "../../../images/xiaode.jpg", "../../../images/xiaode.jpg", "../../../images/xiaode.jpg", "../../../images/xiaode.jpg", "../../../images/xiaode.jpg"]
			}
		];
		var pages=8;
		this.state={
			activity_comment : activity_comment,
			pages : pages
		};
	}

	queryByPage(page){
		request.get("/getPageComment")
	      		.accept('application/json')
	      		.query({ page : page })
	      		.end(function(err,res){
	      			if(err || !res.ok){
					console.log(err);
					return false;
				};
				console.log("获取第"+page+"页评论");
	      		});
	}

	render(){
		return(
			<div className="comment">
				<div className="activity_comment_main">
					{
						this.state.activity_comment	?
							this.state.activity_comment.map((element,index)=>{
								return(
									<div className="activity_comment_list" key={ index }>
										<div className="user_information">
											<img src={ element.head }/>
											<span className="name">{ element.name }</span>
											<span className="sex">{ element.sex }</span>
										</div>
										<div className="comment">
											<span>评语:</span>
											<p>{ element.comment }</p>
										</div>
										<div className="comment_photos">
											{
												element.photos.map( (element,index) => {
													return(
														<img src={ element } key={ index } />
													)
												} )
											}
										</div>
										<div className="comment_date">
											<span className="label">posted @</span>
											<span className="date">{ element.date }</span>
												</div>
									</div>
								)
							})	:	<div className="empty">暂无评论</div>
					}
				</div>
				<div className="pager">
					<Pager total={ this.state.pages } onSkipTo={ (page) => { this.queryByPage(page) } }/>
				</div>
			</div>
		)
	}
}

export default Comment;