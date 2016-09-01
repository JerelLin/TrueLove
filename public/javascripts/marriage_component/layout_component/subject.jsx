import React from "react";

import "../../../stylesheets/marriage_component/layout_component/subject.css";

class Subject extends React.Component{
	render(){
		return(
			<div className="subject_content"><span>{ this.props.subject_content }</span></div>
		);
	}
};

export default Subject;