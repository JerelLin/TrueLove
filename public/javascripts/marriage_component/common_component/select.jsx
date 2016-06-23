import React from "react";
import "../../../stylesheets/marriage_component/common_component/select.css";

class Select extends React.Component{

	constructor(props){
		super(props);
		this.state={
			value : null,
			show : false
		};
	}

	componentDidMount(){
		this.setState({
			value : this.props.initValue
		});
	}

	handleClick(){
		this.setState({
			show : !this.state.show
		});
	} 

	handleSelect(event){
		this.setState({
			value : event.target.innerHTML,
			show : !this.state.show
		});
		this.props.onSelectOption(event.target.innerHTML);
	}

	render(){
		var display={
			display : this.state.show ? "block" : "none"
		};
		var background={
			backgroundImage : this.state.show ? "url(" + "../../../images/up.png" + ")" : "url(" + "../../../images/down.png" + ")"
		};
		return(
			<div className="select" ref="select">
				<a className="select_value" style={ background } onClick={ this.handleClick.bind(this) }>{ this.state.value }</a>
				<ul className="options" style={ display }> 
					{
						React.Children.map( this.props.children, (element,index) => {
							return(
                                                                       			<li key={ index } onClick={ this.handleSelect.bind(this) }>{ element.props.option }</li>
							);
						} )
					}
				</ul>
			</div>
		);
	}
};

export default Select;