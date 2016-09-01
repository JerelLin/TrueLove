import React from "react";
import { Spin, Pagination } from "antd";

import "../../../stylesheets/marriage_component/activity/comment.css";

class Comment extends React.Component{

	constructor( props ){
		super( props )
	}

	render(){
		return(
			<div className="activity_comment">
				<div className="activity_comment_main">
					{
						( this.props.activity_comment ).length != 0 ? this.props.activity_comment.map((element, index) => {
							return(
								<div className="activity_comment_list" key={ index }>
									<div className="user_information">
										<img src={ element.user_head }/>
										<span className="user_name">{ element.user_name }</span>
										<span className="user_sex">{ element.user_sex }</span>
									</div>
									<div className="comment_content">
										<span>评语:</span>
										<p>{ element.comment_content }</p>
									</div>
									<div className="comment_photos">
										{
											element.comment_photos.map( (element, index) => {
												return(
													<img src={ element } key={ index } />
												)
											} )
										}
									</div>
									<div className="comment_date">
										<span className="label">posted @</span>
										<span className="comment_date">{ element.comment_date }</span>
									</div>
								</div>
							)
						}) : <div className="comment_empty">暂无评论</div>
					}
				</div>
				<div className="comment_pagination">
					<Pagination onChange={ ( page ) => this.props.renew_comment( page ) } current={ this.props.comment_page } total = { this.props.comment_total } pageSize = { 5 } />					
				</div>
			</div>
		)
	}
}

export default Comment;