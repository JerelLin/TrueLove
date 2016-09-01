import React from "react";
import { Link } from "react-router";
import { notification, Spin, Pagination } from "antd";
import Subject from "../layout_component/subject.jsx";
import { fetch_data_get } from "../../../../mini_function/fetch.js";

import "../../../stylesheets/marriage_component/activity/activity_management.css";

class Activity_management extends React.Component{

	constructor( props ){
		super( props );
		window.scrollTo(0, 0);
		this.state = {
			activity_list_loading : false,
			activity_detail_loading : false,
			preview_visible : false,
			page_number : 1,
			activity_list_total : 0,
			activity_list_data : [{
				activity_statistics : { read : "", sign_up : "", comment : "" },
				activity_cover : "http://7xteli.com1.z0.glb.clouddn.com/011e1855ed01ce6ac7251df877053e.png",
				activity_subject : "",
				activity_content : "",
				activity_date : "",
				activity_id : ""
			}],
			activity_detail : ""
		};
	}

	componentDidMount(){
	    let _this = this;
		_this.setState({ activity_list_loading : true });
		_this.init_activity( 1 )
			.then((result) => {
				_this.setState({
					activity_list_loading : false,
					activity_list_total : result.body.activity_list_total,
					activity_list_data : result.body.activity_list_data
				})
			})
			.catch((error) => { console.log(error) });
	}

	// 根据activity_id删除指定活动 根据page_number返回当前页数更新后的活动数据
	activity_delete( activity_id ){
		let _this = this;
		fetch_data_get("/marriage_api/delete_activity", { token : localStorage.marriage_app_token, activity_id : activity_id, page_number : this.state.page_number })
			.then((result) => {
				notification["success"]({
			      	message: "消息",
			      	description: result.body.message
			    });
				_this.setState({
					activity_list_total : result.body.activity_list_total,
					activity_list_data : result.body.activity_list_data
				});
			})
			.catch((error) => { console.log(error) });
	}

	// 记录当前页数 更新当前页数活动数据
	onChange( page ){
		window.scrollTo(0, 0);
		let _this = this;
		this.setState({ activity_list_loading : true, page_number : page });
		_this.init_activity( page )
			.then((result) => {
				_this.setState({
					activity_list_loading : false,
					activity_list_total : result.body.activity_list_total,
					activity_list_data : result.body.activity_list_data
				});
				console.log( page );
				console.log( result.body.activity_list_data );
			})
			.catch((error) => { console.log(error) });
	}

	// 获取指定页数活动数据
	init_activity( page_number ){
		return new Promise((resolve, reject) => {
			fetch_data_get("/marriage_api/init_activity", { token : localStorage.marriage_app_token, page_number : page_number })
				.then((result) => {
					resolve(result)
				})
				.catch((error) => { reject(error) });
		});
	}

	render(){
		return(
			<div className="activity_management">
				<Subject subject_content = "相亲活动管理" />
				<div className="activity_management_main">
					<Spin size="large" spinning={ this.state.activity_list_loading } >
						{
							(this.state.activity_list_data).length != 0	?	

								this.state.activity_list_data.map( (element, index) => {
									return(
										<div key={ index } className="activity_data">
											<div className="activity_left"><img src={ element.activity_cover } /></div>
											<div className="activity_right">
												<div className="activity_text">
													<div className="activity_subject">{ element.activity_subject }</div>
													<div className="activity_content">{ element.activity_content }</div>
												</div>
												<div className="activity_action">
													<span className="activity_delete" onClick = { (  ) => this.activity_delete( element.activity_id ) }><a href="#">删除</a></span>
													<span className="ant-divider"></span>
													<span className="activity_preview"><Link to="/marriage_app/activity_management/activity_detail" query={{ activity_id : element.activity_id }} >查看</Link></span>
													<span className="activity_statistics">
														<span>阅读 { element.activity_statistics.read }</span>
														<span>报名 { element.activity_statistics.sign_up }</span>
														<span>评论 { element.activity_statistics.comment }</span>
													</span>
													<span className="activity_date">{ element.activity_date }</span>
												</div>
											</div>
										</div>
									)
								} )	: <div className="activity_empty">这里是空的哦 ~ </div>
						}
					</Spin>
					<div className="activity_pagination">
						<Pagination onChange={ ( page ) => this.onChange( page ) } current={ this.state.page_number } total = { this.state.activity_list_total } pageSize = { 5 } />
					</div>
				</div>
			</div>
		);
	};
};

export default Activity_management;

