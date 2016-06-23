import React from "react";
import "../../../stylesheets/marriage_component/common_component/submit_button.css";

class Submit extends React.Component{

	constructor(props){
		super(props);
	}

	handleClick(){
		this.props.onClick();
	}

	render(){
		return(
			<input type="button" className="submit" value={ this.props.value } onClick={ () => this.handleClick() }/>
		);
	};
};

Submit.defaultProps={
	value : "确认"
};

export default Submit;