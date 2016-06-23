import React from "react";
import { Link } from "react-router";
import request from "superagent"; 
import Pager from "../common_component/pager.jsx";
import "../../../stylesheets/marriage_component/activity/news.css";

class News extends React.Component{

	constructor(props){
		super(props);
		window.scrollTo(0,0);
		this.state={
			news : null,
			pages : 0
		};
	}

	componentDidMount(){
		var _this=this;
		request.get("/initNews")
	      		.accept('application/json')
	      		.query({ 
	      			token : localStorage.token,
	      			page : 1
	      		})
	      		.end(function(err,res){
	      			if(err || !res.ok){
					console.log(err);
					return false;
				};
				_this.setState({
					news : res.body.newsList.news,
					pages : res.body.newsList.pages
				});
	      		});
	}

	/*消息分页*/
	queryByPage(page){

		var _this=this;
		this.setState({ page : page });

		request.get("/initNews")
	      		.accept('application/json')
	      		.query({ 
	      			token : localStorage.token,
	      			page : page 
	      		})
	      		.end(function(err,res){
	      			if(err || !res.ok){
					console.log(err);
					return false;
				};
				window.scrollTo(0,0);
				console.log(res.body.newsList.news);
				_this.setState({
					news : res.body.newsList.news,
					pages : res.body.newsList.pages
				});
	      		});
	}

	/*删除消息 根据消息时间戳定位*/
	news_delete(timestamp){
		var _this=this;
		request.get("/deleteNews")
			.accept('application/json')
			.query({
				token : localStorage.token,
				timestamp : timestamp
			})
			.end(function(err,res){
				if(err || !res.ok){
					console.log(err);
					return false;
				};
				console.log(res.body.newsList.news);
				_this.setState({
					news : res.body.newsList.news,
					pages : res.body.newsList.pages
				});
			});
	}

	render(){
		return(
			<div className="news">
				<div className="news_header"><span>消息中心</span></div>
				<div className="news_banner">
					<span className="news_content">内容</span>
					<span className="news_date">时间</span>
					<span className="news_operation">操作</span>
				</div>
				<div className="news_main">
					{
						this.state.news&&this.state.news.length!=0    ?    this.state.news.map( (element,index) => {
										return(
											<div className="news_list" key={ index }>
												<Link to={ `/marriage_app/News_detail` } state={ { news_detail : element } } >
													<span className="news_content_data">{ element.news }</span>
												</Link>
												<span className="news_date_right">
													<span className="news_date_data">{ element.date }</span>
													<span className="news_operation_data" onClick={ () => this.news_delete(element.timestamp) }>删除</span>
												</span>
											</div>
										)
									} )     :     <div className="empty">暂无消息</div>
					}
					<div className="pager">
						{
							this.state.news&&this.state.news.length!=0    ?	<Pager total={ this.state.pages } onSkipTo={ (page) => { this.queryByPage(page) } }/>	: 	<div></div>
						}
					</div>
				</div>
			</div>
		);
	}
}

export default News;