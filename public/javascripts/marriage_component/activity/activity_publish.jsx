import React from "react";

import request from "superagent"; 
/*尽管我十分不愿意用jquery，但为了保险起见，在表单提交这一块还是用jquery的ajax吧，关于formdata，好多实现都是基于ajax的*/
import $ from "../../module/jquery.min.js";

import Input from "../common_component/input.jsx";
import Textarea from "../common_component/textarea.jsx";
import Editor from "../common_component/editor.jsx";
import Cancel from "../common_component/cancel_button.jsx";
import Submit from "../common_component/submit_button.jsx";
import DateSelected from "../common_component/dateSelected.jsx";
import ImgCrop from "../activity/img_crop.jsx";						/*封面上传、预览*/
import Modal from "boron/DropModal";	 						/*遮罩层组件*/
import "../../../stylesheets/marriage_component/activity/activity_publish.css";

class Activity extends React.Component{

	constructor(props){
		super(props);
		window.scrollTo(0,0);
		this.mid_detail=null;		/*直接为detail设置状态富文本编辑器会出问题*/
		this.state={
			/*material*/
			title : "",			/*需要判断字符长度，所以用null的话会报错*/
			date : null,
			site : "",
			deadline : null,
			brief : "",
			img : null,

			errMess : null, 		/*错误提示*/

			forbidClose : false,	/*遮罩层的关闭按钮是否禁止？false为不禁止，true为禁止*/
		};
	}

	/*
	*********************************************************************************************
	*获取素材后渲染表单
	*********************************************************************************************
	 */
	/*根据素材传递而来的活动标题发送异步请求获取之前保存的数据*/
	/*此方法被调用的时候子组件已经被架置，因为constructor为组件即将被架置时所调用的方法，*/
	/*所以state已经被初始化，此时如果想重新更改state，可以在子组件中添加componentWillReceiveProps方法*/
	componentDidMount(){
		/* 或者 var query = this.props.location.query */
		var _this=this;
	      	var { query } = this.props.location;
		var timestamp = query.timestamp;
		if(timestamp){
			console.log("时间戳为:  " + timestamp + "  =>将会根据此时间戳获取到相应素材的数据");	//时间戳
			request.get("/getMaterial")
				.accept('application/json')		/*接收什么类型的数据*/
				.query({
					timestamp : timestamp
				})
				.end(function(err,res){
					if(err || !res.ok){
						console.log(err);
						return false;
					};
					console.log("已经初始化时间戳为 "+timestamp+" 的素材");		//时间戳
					_this.mid_detail="<p>详情</p>";
					_this.setState({
						title : "标题",
						date : "2016-12-10",
						site : "地点",
						deadline : "2017-01-01",
						brief : "简介",
						img : "../../../images/1459782264000.jpg"
					});
				});
		}
	}


	/*
	*********************************************************************************************
	*获取各表单输入值
	*********************************************************************************************
	 */
	/*提取各输入框的输入值存入state*/
	collect_value(event,type){
		var { value } = event.currentTarget;
		this.setState({
			[ type ] : value
		});
		//console.log( typeof( type ) ); 	=> string
		//console.log( typeof( [ type ] ) ); => object
	}

	/*从富文本编辑器获取活动详情*/
	get_detail(value){
		console.log("活动详情:" + value);
		this.mid_detail=value;
	}

	/*获得活动时间和活动截止时间*/
	get_date(date,type){
		//在state里面保存完整的date，需要时再做日期字符提取
		// var dateString = date._d.getFullYear()+"-"+(date._d.getMonth()+1)+"-"+date._d.getDate();
		this.setState({
			[ type ] : date
		});
		// console.log(date._d.getFullYear()+"-"+(date._d.getMonth()+1)+"-"+date._d.getDate());
	}

	/*获取图片链接(二进制数据流)*/ 
	get_imgurl(baseUrl){
		this.setState({
			img : baseUrl
		});
		// console.log(baseUrl);
	}

	/*将一段二进制数据流封装为一个数据流对象*/
	//**dataURL to blob**
	dataURLtoBlob(dataurl){
		var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
		while(n--){
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new Blob([u8arr], {type:mime});
	}


	/*
	*********************************************************************************************
	*保存发布时 de 操作
	*********************************************************************************************
	 */
	
	/*封装formdata对象*/
	toFormData(form){
		// 封装formdata对象，formdata对象可以包含json
		form.append("title",this.state.title);
		form.append("site",this.state.site);
		form.append("brief",this.state.brief);
		form.append("detail",this.mid_detail);
		/************************************************************
		 *比如根据时间戳获取相应的素材?
		*************************************************************/
		if(this.state.date&&this.state.date._d){
			form.append("date",this.state.date._d.getFullYear()+"-"+(this.state.date._d.getMonth()+1)+"-"+this.state.date._d.getDate());
		}else{
			/*因为从素材那边传递而来的是拼接好后的date字符串*/
			form.append("date",this.state.date);
		};
		if(this.state.deadline&&this.state.deadline._d){
			form.append("deadline",this.state.deadline._d.getFullYear()+"-"+(this.state.deadline._d.getMonth()+1)+"-"+this.state.deadline._d.getDate());
		}else{
			/*因为从素材那边传递而来的是拼接好后的date字符串*/
			form.append("deadline",this.state.deadline);
		};

		/*检测为base64字符串时*/
		if( this.state.img.indexOf("base64")>0 ){
			//点击素材库重新编辑封面只是一个来自服务端的url，不是base64数据流，
			//所以判断一下，如果是URL字符的话就无需上传了
			//可是无需上传的话是不是还需要把图片从素材区转移到活动发布区？
			// console.log(Date.parse( new Date() ));
			form.append('image', this.dataURLtoBlob(this.state.img),Date.parse( new Date() )+".jpg");
		}else{
			form.append('image', null);
		};
		return form;
	}
	
	/*保存为素材时调用*/
	handleSave(){
		var _this=this;
		var form=new FormData();
		if(this.state.title.length==0||this.state.title.length>30){
			// alert("活动标题字数有误");
			this.setState({
				errMess : "活动标题字数有误" 
			});
			this.showModal(false);
			return false;
		};

		if(this.state.img==null){
			this.setState({
				errMess : "上传一张图片作为封面吧"
			});
			this.showModal(false);
			return false;
		}

		this.setState({
			errMess : "正在保存..."
		});
		_this.showModal(true);

		this.toFormData(form);
		request.post("/save")
			.send(form)
			.end(function(err,res){
				if(err || !res.ok){
					console.log(err);
					return false;
				};
				_this.setState({
					errMess : "保存成功"
				});
				_this.showModal(true);
				setTimeout(function(){
					_this.props.history.replaceState(null, '/marriage_app/Material');
				},2000);
			});
	}

	/*发布活动时调用*/
	handlePublish(){
		var _this=this;
		var form=new FormData();
		if(this.state.title.length==0||this.state.title.length>30){
			this.setState({
				errMess : "活动标题字数有误"
			});
			this.showModal(false);
			return false;
		}
		if(this.state.date==null){
			this.setState({
				errMess : "请选择活动时间"
			});
			this.showModal(false);
			return false;
		}
		if(this.state.site==""){
			this.setState({
				errMess : "活动地点不能为空"
			});
			this.showModal(false);
			return false;
		}
		if(this.state.deadline==null){
			this.setState({
				errMess : "请选择报名截止日期"
			});
			this.showModal(false);
			return false;
		}
		if(this.mid_detail==null || this.mid_detail=="<p><br></p>" || this.mid_detail=="<p></p>" || this.mid_detail==""){
			this.setState({
				errMess : "详情不能为空"
			});
			this.showModal(false);
			return false;
		}
		if(this.state.brief.length==0 || this.state.brief.length>150){
			this.setState({
				errMess : "活动简介字数有误"
			});
			this.showModal(false);
			return false;
		}
		if(this.state.img==null){
			this.setState({
				errMess :  "上传一张图片作为封面吧"
			});
			this.showModal(false);
			return false;
		}

		this.setState({
			errMess : "请稍等一下~"
		});
		_this.showModal(true);

		this.setState({
			detail : this.mid_detail		/*mid_detail被确定为即将发布的内容之后将赋予detail*/
		});
		this.toFormData(form);
		request.post("/publish")			/*保险起见替换为jquery的ajax？*/
			.send(form)
			.end(function(err,res){
				if(err || !res.ok){
					console.log(err);
					_this.setState({
						errMess : "发布失败"
					});
					_this.showModal(false);
					return false;
				};
				_this.setState({
					errMess : "发布成功"
				});
				_this.showModal(true);
				setTimeout(function(){
					_this.props.history.replaceState(null, '/marriage_app/Activity_management');
					// location.href="/marriage_app/Activity_management"; 	/*弹出"发布成功"提示，2秒后跳转到活动管理页面*/
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

    	/*
	*********************************************************************************************
	*视图区域
	*********************************************************************************************
	 */
	render(){
		return(
			<div className="activity_publish">

				{/*遮罩层*/}
				<Modal ref="modal">
					<div className="errMessCloseBox">
						{
							this.state.forbidClose==true ? "" : <span className="errMessClose" onClick={ () => this.hideModal() }></span>
						}
					</div>
					<div className="errMess">{ this.state.errMess }</div>
				</Modal>

				<div className="activity_publish_header"><span>发布相亲活动</span></div>
				<form encType="multipart/form-data" className="activity_publish_main" action="#" method="post" ref="publishFrom">
					{/*标题*/}
					<div className="activity_publish_title">
						<p>活动标题：</p>
						{
							this.state.title.length<30 ? <p ref="tip" className="word_tip">还可以输入<em>{ 30-this.state.title.length }</em>字</p> : <p ref="title_tip" className="word_tip">已经超出<em className="error">{ this.state.title.length-30 }</em>字</p>
						}
						<Input name="title"
							ref="title"
							placeholder="不超过三十个字符" 
							onValue={ (event) => this.collect_value(event,"title") }
							init_value={ this.state.title }/>
					</div>
					{/*日期*/}
					<div className="activity_publish_date">
						<span className="date_left">选择活动时间：</span>
						<span className="date_right"><DateSelected init_value={ this.state.date } onSetDate={ (date) => this.get_date(date,"date") }/></span>
					</div>
					{/*地点*/}
					<div className="activity_publish_site">
						<span className="site_left">输入活动地点：</span>
						<span className="site_right">
							<Input name="site"
								ref="site"
								placeholder="请输入活动地点" 
								onValue={ (event) => this.collect_value(event,"site") }
								init_value={ this.state.site }/>
						</span>
					</div>
					{/*截止日期*/}
					<div className="activity_publish_deadline">
						<span className="deadline_left">报名截止时间：</span>
						<span className="deadline_right"><DateSelected init_value={ this.state.deadline } onSetDate={ (date) => this.get_date(date,"deadline") }/></span>
					</div>
					{/*详情*/}
					<div className="activity_publish_detail">
						<p>添加活动图文详情：</p>
						<Editor id="editor" init_value={ this.mid_detail } onValue={ (value) => this.get_detail(value) } />
					</div>
					{/*简介*/}
					<div className="activity_publish_brief">
						<p>简介：</p>
						{
							this.state.brief.length<150 ? <p ref="tip" className="word_tip">还可以输入<em>{ 150-this.state.brief.length }</em>字</p> : <p ref="brief_tip" className="word_tip">已经超出<em className="error">{ this.state.brief.length-150 }</em>字</p>
						}
						<Textarea name="brief"
							     ref="brief"
							     placeholder="不超过一百五十个字符" 
							     onValue={ (event) => this.collect_value(event,"brief") }
							     init_value={ this.state.brief }/>
					</div>

					{/*封面上传、预览*/}
					<ImgCrop title={ this.state.title } brief={ this.state.brief } img={ this.state.img } get_imgurl={ (baseUrl) => this.get_imgurl(baseUrl) }/>

					{/*提交按钮区域*/}
					<div className="activity_publish_button">
						<span className="button_zone">
							<Cancel value="保存" onClick={ () => this.handleSave() }/>
							<Submit value="发布" onClick={ () => this.handlePublish() }/>
						</span>
					</div>
				</form>
			</div>
		);
	}
};

export default Activity;