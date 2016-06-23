import React from "react";
import request from "superagent"; 
import Modal from "boron/DropModal";
import Textarea from "../common_component/textarea.jsx";
import Cancel from "../common_component/cancel_button.jsx";
import Submit from "../common_component/submit_button.jsx";
import "../../../stylesheets/marriage_component/setting/feedback.css";

class Feedback extends React.Component{

	constructor(props){
		super(props);
		window.scrollTo(0,0);
		this.state={
			feedback : null,
			errMess : null
		};
	}

	/*提取各输入框的输入值*/
	collect_value(event,type){
		var { value } = event.currentTarget;
		this.setState({
			[ type ] : value
		});
		//console.log( typeof( type ) ); => string
		//console.log( typeof( [ type ] ) ); => object
	}

	handleCancel(){
		this.props.history.replaceState(null, '/marriage_app');
	}

	handleSubmit(){
		var _this=this;
		if(this.state.feedback=="" || this.state.feedback==null){
			_this.setState({
				errMess : "写点什么吧~"
			});
			_this.showModal(false); 
			return false;
		};
		this.setState({
			errMess : "请稍等 一下~"
		});
		this.showModal(true);				/*禁止关闭按钮*/
		request.post("/feedback")
			.send({
				feedback : this.state.feedback
			})
			.end(function(err,res){
				if(err || !res.ok){
					console.log(err);
					_this.setState({
						errMess : "反馈失败"
					});
					_this.showModal(false);
					return false;
				};
				if(res.body.message=="反馈失败"){
					_this.setState({
						errMess : res.body.message
					});
					_this.showModal(false);
					return false;
				};
				_this.setState({
					errMess : res.body.message 	//反馈成功
				});
				_this.showModal(true);
				setTimeout(function(){
					_this.props.history.replaceState(null, '/marriage_app');
				},2000);
			});
	}

	/*提示遮罩层出现*/
	showModal(forbidState){
		this.setState({
			forbidClose : forbidState
		});
        		this.refs.modal.show();
    	}

    	/*提示遮罩层消失*/
    	hideModal(){
        		this.refs.modal.hide();
    	}

	render(){
		return(
			<div className="feedback">
				<Modal ref="modal">
					<div className="errMessCloseBox">
						{
							this.state.forbidClose==true ? "" : <span className="errMessClose" onClick={ () => this.hideModal() }></span>
						}
					</div>
					<div className="errMess">{ this.state.errMess }</div>
				</Modal>
				<div className="feedback_header"><span>意见反馈</span></div>
				<div className="feedback_main">
					<p className="words">亲爱的，如果你不开心，小初也不开心</p>
					<p className="words">你对小初有什么想吐槽的，说给小初听吧，小初会好好改正的。</p>
					<Textarea ref="feedback" 
						onValue={ (event) => this.collect_value(event,"feedback") }
						placeholder="写下你想对小初说的话"/>
					<div className="button_zone">
						<div className="button_zone_mian">
							<Cancel onClick={ () => this.handleCancel() }/>
							<Submit onClick={ () => this.handleSubmit() }/>
						</div>
					</div>
				</div>
			</div>
		);
	}
};

export default Feedback;