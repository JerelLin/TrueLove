import React from "react";
import { Link } from "react-router";
import { Table, notification, Spin, Modal } from "antd";
import Subject from "../layout_component/subject.jsx";
import { fetch_data_get } from "../../../../mini_function/fetch.js";

import "../../../stylesheets/marriage_component/activity/news.css";

class News extends React.Component{

	constructor(props){
		super(props);
		window.scrollTo(0,0);
		this.state={
			news_loading : false,
			news_detail_loading : false,
			preview_visible : false,
			news_list_data : [{  }],
			news_detail : ""
		};
	}

	componentDidMount(){
		var _this=this;
		_this.setState({ news_loading : true });
		fetch_data_get("/marriage_api/init_news", { token : localStorage.marriage_app_token })
			.then((result) => {
				let news_list_data = [];
				result.body.news_list_data.map((ele, key) => {
					news_list_data.push({
						key: key,
						news_id : ele.news_id,
	  					subject: ele.subject,
	  					date: ele.date
					});
				});
				_this.setState({
					news_loading : false,
					news_list_data : news_list_data
				});
			})
			.catch((error) => console.log(error));
	}

	// 查看消息
	preview(news_id){
		this.setState({ preview_visible : true, news_detail_loading : true });
		fetch_data_get("/marriage_api/get_news_detail", { token : localStorage.marriage_app_token, news_id : news_id })
			.then((result) => {
				this.setState({ news_detail_loading : false, news_detail : result.body.news_detail });
			})
			.catch((error) => { console.log(error) });
	}

	preview_close(){
		this.setState({ preview_visible : false });
	}

	// 根据消息发布日期删除消息
	delete_news(news_id){
		var _this=this;
		fetch_data_get("/marriage_api/delete_news", { token : localStorage.marriage_app_token, news_id : news_id })
			.then((result) => {
				notification["success"]({
			      	message: "消息",
			      	description: result.body.message
			    });
			    let news_list_data = [];
				result.body.news_list_data.map((ele, key) => {
					news_list_data.push({
						key: key,
						news_id : ele.news_id,
	  					subject: ele.subject,
	  					date: ele.date
					});
				});
				_this.setState({ news_list_data : news_list_data });
			})
			.catch((error) => console.log(error));
	}

	render(){
		const columns = [
			{ title: "消息ID", dataIndex: "news_id", key: "news_id", render: (text) => <span>{ text }</span> },
			{ title: "消息主题", dataIndex: "subject", key: "subject" }, 
			{ title: "发布时间", dataIndex: "date", key: "date" },
			{ title: "操作", key: "operation", render: (text, record) => (
			  	<span className="operation">
			      	<a href="#" onClick = { () => this.preview( record.news_id ) }>查看</a>
			      	<span className="ant-divider"></span>
			      	<a href="#" onClick={ () => this.delete_news(record.news_id) }>删除</a>
			    </span>
			  )
			}
		];
		return(
			<div className="news">
				<Subject subject_content = "消息中心" />
				<div className="news_main">
					<Spin size="large" spinning={ this.state.news_loading } >
						<Table columns={ columns } dataSource={ this.state.news_list_data } />
					</Spin>
				</div>
				<Modal wrapClassName="news_preview_box"
					width = "680"
					title = "消息查看"
				          	visible = { this.state.preview_visible }
				          	onOk = { (  ) => this.preview_close() }
				          	onCancel = { (  ) => this.preview_close() }
				        >
				        	<Spin spinning={ this.state.news_detail_loading } >
				        		<iframe srcDoc={ this.state.news_detail } frameBorder="0" width="100%" height="350px">{ this.state.news_detail }</iframe>
				        	</Spin>
		        		</Modal>
			</div>
		);
	}
}

export default News;