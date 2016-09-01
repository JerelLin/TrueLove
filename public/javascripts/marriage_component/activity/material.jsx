import React from "react";
import { Link } from "react-router";
import { notification, Spin, Pagination } from "antd";
import Subject from "../layout_component/subject.jsx";
import { fetch_data_get } from "../../../../mini_function/fetch.js";

import "../../../stylesheets/marriage_component/activity/material.css";

class Material extends React.Component{

	constructor(props){
		super(props);
		window.scrollTo(0, 0);
		this.state = {
			material_list_data_loading : false,
			page_number : 1,
			material_list_total : 0,
			material_list_data : [{
				material_cover : "http://7xteli.com1.z0.glb.clouddn.com/011e1855ed01ce6ac7251df877053e.png",
				material_subject : "",
				material_content : "",
				material_date : "",
				material_id : ""
			}]
		}
	}

	componentDidMount(){
		let _this = this;
		_this.setState({ material_list_data_loading : true });
		_this.init_material( 1 )
			.then((result) => {
				_this.setState({
					material_list_data_loading : false,
					material_list_total : result.body.material_list_total,
					material_list_data : result.body.material_list_data
				})
			})
			.catch((error) => { console.log(error) })
	}

	material_delete( material_id ){
		let _this = this;
		fetch_data_get("/marriage_api/delete_material", { token : localStorage.marriage_app_token, material_id : material_id })
			.then((result) => {
				notification["success"]({
				      	message: "消息",
				      	description: result.body.message
				});
				_this.setState({
					material_list_total : result.body.material_list_total,
					material_list_data : result.body.material_list_data
				})
			})
			.catch((error) => { console.log(error) })
	}

	// 记录当前页数 更新当前页数素材数据
	onChange( page ){
		window.scrollTo( 0, 0 );
		let _this = this;
		this.setState({ material_list_data_loading : true, page_number : page });
		_this.init_material( page )
			.then((result) => {
				_this.setState({
					material_list_data_loading : false,
					material_list_total : result.body.material_list_total,
					material_list_data : result.body.material_list_data
				});
				console.log( page );
				console.log( result.body.material_list_data );
			})
			.catch((error) => { console.log(error) })
	}

	// 获取指定页数素材数据
	init_material( page_number ){
		return new Promise((resolve, reject) => {
			fetch_data_get("/marriage_api/init_material", { token : localStorage.marriage_app_token, page_number : page_number })
				.then((result) => {
					resolve(result)
				})
				.catch((error) => { reject(error) })
		})
	}

	render(  ){
		return(
			<div className="material">
				<Subject subject_content = "素材库" />
				<Spin size="large" spinning={ this.state.material_list_data_loading } >
					<div className="material_main">
					{
						( this.state.material_list_data ).length != 0 ? this.state.material_list_data.map( (element, index) => {
							return(
								<div key={ index } className="material_data">
									<div className="material_left"><img src={ element.material_cover } /></div>
									<div className="material_right">
										<div className="material_text">
											<div className="material_subject">{ element.material_subject }</div>
											<div className="material_content">{ element.material_content }</div>
										</div>
										<div className="material_action">
											<span className="material_edit">
												<Link to="/marriage_app/activity_publish" query={ { 
													material_cover : element.material_cover, 
													material_subject :  element.material_subject, 
													material_content :  element.material_content, 
													material_introduction :  element.material_introduction, 
													material_site :  element.material_site, 
													material_start :  element.material_start, 
													material_deadline :  element.material_deadline
												} }>编辑</Link>
											</span>
											<span className="ant-divider"></span>
											<span className="material_delete" onClick = { (  ) => this.material_delete( element.material_id ) }><a href="#">删除</a></span>
											<span className="material_date">{ element.material_date }</span>
										</div>
									</div>
								</div>
							)
						} ) : <div className="material_empty">这里是空的哦 ~ </div>
					}
						<div className="material_pagination">
							<Pagination onChange={ ( page ) => this.onChange( page ) } current={ this.state.page_number } total = { this.state.material_list_total } pageSize = { 5 } />
						</div>
					</div>
				</Spin>
			</div>
		);
	};
};

export default Material;