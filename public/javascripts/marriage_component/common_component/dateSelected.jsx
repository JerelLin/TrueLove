import React from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "../../../stylesheets/marriage_component/common_component/dateSelected.css";

class DateSelected extends React.Component{
	constructor(props){
		super(props);
		this.state={
			startDate : null
		}
	}

	componentWillReceiveProps(nextProps){
	      if(nextProps.init_value){
	      	this.setState({
		      	startDate : moment(nextProps.init_value)
		});
	      }
	}

	handleChange(newDate){
		this.setState({
			startDate : newDate
		});

		// var dateString=date._d.getFullYear()+"-"+(date._d.getMonth()+1)+"-"+date._d.getDate();
		// console.log(dateString);
		
		// this.forceUpdate();

		this.props.onSetDate(newDate);
	}

	render(){
		return (
			<DatePicker selected={this.state.startDate} onChange={ this.handleChange.bind(this) }/>
		);
	};
};

export default DateSelected;