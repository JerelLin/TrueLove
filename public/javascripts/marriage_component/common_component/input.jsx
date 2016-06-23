import React from "react";
import "../../../stylesheets/marriage_component/common_component/input.css";

class Input extends React.Component{

	constructor(props){
		super(props);
		this.state={
			value : null
		};
	}

	/*当有props传递过来的时候，重新更新state*/
	componentWillReceiveProps(nextProps){
		if(nextProps.init_value){
			this.setState({
				value : nextProps.init_value
			});
		}
	}

	handleChange(event){
		// console.log("event传递过去啦");
		this.setState({
			value : event.target.value
		});
		if(this.props.onValue){
			this.props.onValue(event);
		};
	}

	handleBlur(event){
		if(this.props.onBlur){
			this.props.onBlur(event);
		};
	}

	render(){ 
		return(
			<input name={ this.props.name }
				type={ this.props.type }
				className="input_component" 
				placeholder={ this.props.placeholder } 
				onChange={ this.handleChange.bind(this) }
				onBlur={ this.handleBlur.bind(this) }
				value={ this.state.value }/>
		);
	};
};

Input.defaultProps={
	type : "text"
};

export default Input;