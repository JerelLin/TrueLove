import React from 'react';
import PagerControl from 'rc-pager';
import "rc-pager/assets/bootstrap.css";
import "../../../stylesheets/marriage_component/common_component/page.css";

class Pager extends React.Component{
	constructor(props){
		super(props);
		this.state={
			current : 0
		};
	}

	handleSkip(page){
		this.setState({
			current : page
		});
		if (this.props.onSkipTo){
			this.props.onSkipTo(page+1);
		};
	}

	render(){
		return (
			<div>
        				<PagerControl total={this.props.total} current={this.state.current} onSkipTo={this.handleSkip.bind(this)}/>
      			</div>
		);
	};
};

export default Pager;