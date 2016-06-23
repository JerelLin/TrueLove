import React from "react";
import "../../../stylesheets/marriage_component/common_component/buttonControl.css";

class ButtonControl extends React.Component{

	constructor(){
		super();
		this.state={
			currentIndex : 0 
			/*被点击按钮的index值,初始默认为第一个*/
		};
	}

	handleClick(index,option){
		this.setState({
			currentIndex : index
		});
		this.props.onSelectType(option);
	}

	checkClassName(index){
	/*检测一下：当前的按钮的index是被点击的那个按钮的index吗，是给它active*/
		return index===this.state.currentIndex ? "active button" : "button"
	}

	render(){
		return(
			<div className="ExampleControl">
				{
					React.Children.map( this.props.children, (element,index) => {
						return(
							/*箭头函数没有自己的this，这里的this继承自外围作用域，即组件本身*/
							<div onClick={ () => { this.handleClick(index,element.props.value) } } className={ this.checkClassName(index) }>{ element.props.value }</div>
						);
					} )
				}
			</div>
		);
	}
};

export default ButtonControl;
