import React from "react";
import { Spin, Carousel } from "antd";
import Subject from "../layout_component/subject.jsx";
import { fetch_data_get } from "../../../../mini_function/fetch.js";

import "../../../stylesheets/marriage_component/setting/about_truelove.css";

class About_truelove extends React.Component{

	constructor( props ){
		super( props );
		this.state = {
			loading : false,
			about_truelove : [ {  } ]
		}
	}

	componentDidMount(  ){
		this.setState({ loading : true });

		let _this =this;
		fetch_data_get("/marriage_api/about_truelove", { token : localStorage.marriage_app_token })
			.then(( result ) => {
				let about_truelove = [  ];
				result.body.about_truelove.map(( ele, key ) => {
					about_truelove.push({
						key : key,
						truelove_img : ele.truelove_img,
						truelove_link : ele.truelove_link
					})
				})
				_this.setState({ loading : false, about_truelove : about_truelove })
			})
			.catch(( error ) => console.log( error ));
	}

	render(  ){
		return(
			<div className="about_truelove">
				<Subject subject_content = "关于初恋" />
				<Spin size="large" spinning={ this.state.loading }>
					<Carousel autoplay>
						{
							this.state.about_truelove.map(( ele, key ) => {
								return(
									<div key = { key }><a href = { ele.truelove_link }><img src = { ele.truelove_img }/></a></div>
								)
							})
						}
					</Carousel>
				</Spin>
			</div>
		);
	}
};

export default About_truelove;