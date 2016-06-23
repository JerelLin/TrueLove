import React from "react";
import "../../../stylesheets/marriage_component/common_component/upload.css";

class Upload extends React.Component{
	render(){
		return(
			<a href="javascript:;" className="file">{ this.props.value }<input type="file" onChange={ this.props.onChange }/></a>
		);
	}
};

Upload.defaultProps={
	value : "上传"
};

export default Upload;