import React from "react";
import "../../../stylesheets/marriage_component/common_component/cancel_button.css";

class Cancel extends React.Component{

	constructor(props){
		super(props);
	}

	handleClick(){
		this.props.onClick();
	}

	render(){
		return(
			<input type="button" className="cancel" value={ this.props.value } onClick={ () => this.handleClick() }/>
		);
	};
};

Cancel.defaultProps={
	value : "取消"
};

export default Cancel;