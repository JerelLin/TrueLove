import React from "react";
import "../../../stylesheets/marriage_component/common_component/textarea.css";

class Textarea extends React.Component{

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
			<textarea name={ this.props.name }
				className="textarea_component"
				placeholder={ this.props.placeholder } 
				onChange={ this.handleChange.bind(this) }
				onBlur={ this.handleBlur.bind(this) }
				value={ this.state.value }/>
		);
	};
};

export default Textarea;