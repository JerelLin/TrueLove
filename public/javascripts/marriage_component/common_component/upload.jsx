import React from "react";

import "../../../stylesheets/marriage_component/common_component/upload.css";

class Upload extends React.Component{
	render(){
		return(
			<a href="javascript:;" className="file">上传<input type="file" onChange={ this.props.onChange }/></a>
		)
	}
}

export default Upload