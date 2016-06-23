import React from "react";
import { Link } from "react-router";
import request from "superagent"; 
import Pager from "../common_component/pager.jsx";
import "../../../stylesheets/marriage_component/activity/material.css";

class Material extends React.Component{

	constructor(props){
		super(props);
		var material_list_data=[
			{
				img : "../../../images/xiaode.jpg",
				title : "寻找最美的她",
				date : "2016-06-02 22:30",
				timestamp : 1459782264000			/*素材保存时间,时间戳*/
			},
			{
				img : "../../../images/xiaode.jpg",
				title : "遇见遇见遇见",
				date : "2016-06-02 22:30",
				timestamp : 1459782264000
			},
			{
				img : "../../../images/xiaode.jpg",
				title : "寻爱遇见遇见",
				date : "2016-06-02 22:30",
				timestamp : 1459782264000
			}
		];
		var pages=8;
		this.state={
			material_list_data : material_list_data,
			pages : pages
		};
	}

	componentDidMount(){
	      	request.get("/initMaterial")
	      		.accept('application/json')				/*接收什么类型的数据*/
	      		.end(function(err,res){
	      			if(err || !res.ok){
					console.log(err);
					console.log(res);
					return false;
				};
				console.log("素材列表初始化");
	      		});
	}

	/*删除素材 根据素材的时间戳定位*/
	material_delete(timestamp){
		request.post("/deleteMaterial")
			.type('application/json')			/*发送什么类型的数据*/
			.send({
				timestamp : timestamp
			})
			.end(function(err,res){
				if(err || !res.ok){
					console.log(err);
					return false;
				};
				console.log("已经删除时间戳为 "+timestamp+" 的素材");
			});
	}

	queryByPage(page){
		request.get("/getPageMaterial")
	      		.accept('application/json')
	      		.query({ page : page })
	      		.end(function(err,res){
	      			if(err || !res.ok){
					console.log(err);
					return false;
				};
				console.log("获取第"+page+"页素材");
	      		});
	}

	render(){
		return(
			<div className="material">
				<div className="material_header"><span>素材库</span></div>
				<div className="material_main">
					{
						this.state.material_list_data	?	

							this.state.material_list_data.map( (element,index) => {
								return(
									<div key={ index } className="material_list">
										<div className="material_img_and_title">
											<div className="material_img"><img src={ element.img }/></div>
											<div className="material_title">{ element.title }</div>
										</div>
										<div className="material_date_and_operation">
											<div className="material_date">
												<span>最后保存时间</span>
												<span>{ element.date }</span>
											</div>
											<div className="material_rewrite_or_delete">
												<Link to="/marriage_app/Activity_Publish" query={{ timestamp : element.timestamp }}><div className="material_rewrite">编辑</div></Link>
												<div className="material_delete" onClick={ () => this.material_delete(element.timestamp) }>删除</div>
											</div>
										</div>
									</div>
								)
							} )	:	<div className="empty">暂无素材</div>	
					}
					<div className="pager">
						<Pager total={ this.state.pages } onSkipTo={ (page) => { this.queryByPage(page) } }/>
					</div>
				</div>
			</div>
		);
	};
};

export default Material;