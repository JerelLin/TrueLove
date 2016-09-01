import React from "react";
import { Spin, Pagination } from "antd";

import "../../../stylesheets/marriage_component/statistics/activity_grow.css";

class ActivityGrow extends React.Component{

	constructor( props ){
		super( props );
	}

	onChange( page ){
		console.log( page );
	}
	
	render(  ){
		return(
			<div className="activity_flow">
				<div className="label">注 : 转化率 = 报名人数 / 阅读人数</div>
				<div className="activity_lsit">
				{
					( this.props.activity_flow ).length != 0 ? this.props.activity_flow.map( (element, index) => {
						return(
							<div className="activity_item" key={ index }>
								<div className="activity_item_left">
									<img src = { element.activity_cover }/>
								</div>
								<div className="activity_item_right">
									<div className="activity_name">{ element.activity_name }</div>
									<div className="flow_stats">
										<span>阅读次数 { element.read }</span>
										<span>阅读人数 { element.visitor }</span>
										<span>报名人数 { element.sign_up }</span>
										<span>转化率   { element.percent_conversion }</span>
										<span>评论次数 { element.comment }</span>
										<span>评论人数 { element.reviewer }</span>
										<span>点赞人数 { element.number_of_points_like }</span>
									</div>
								</div>
							</div>
						)
					} ) : <div className="activity_empty">暂无活动分析数据</div>
				}
				</div>
				<div className="activity_pagination">
					<Pagination onChange={ ( page ) => this.onChange( page ) } total = { 50 } pageSize = { 5 } />
				</div>
			</div>
		)
	}
};

export default ActivityGrow;