import React from 'react';
import E from 'wangEditor/dist/js/wangEditor.js';
import 'wangEditor/dist/css/wangEditor.css';

class Editor extends React.Component{

	constructor(props){
		super(props);
		this.state={
			detail : null
		};
	}

	componentDidMount(){
		var _this=this;
	      	var id = this.props.id;
	             this.editor = new window.wangEditor(id);
	             this.editor.config.uploadImgUrl = '/upload';
	             this.editor.config.uploadParams={
	             	token : "token"
	             };
	             window.wangEditor.config.printLog = false;
	             this.editor.config.menus = [
	                    'bold',
	                    'underline',
	                    'italic',
	                    '|',
	                    'quote',
	                    'unorderlist',
	                    'orderlist',
	                    '|',
	                    'link',
	                    'unlink',
	                    '|',
	                    'img',
	                    '|',
	                    'fullscreen'
	             ];
	             this.editor.onchange=function(){
	             	if(_this.props.onValue){
				_this.props.onValue(this.$txt.html());
			};
	             };
                	this.editor.create();
	}

	/*当有props传递过来的时候，重新更新state( 初始化详情 )*/
	componentWillReceiveProps(nextProps){
		if(nextProps.init_value){
			this.editor.$txt.html(nextProps.init_value);
		}
	}

	getContent(){
                	var content = this.editor.$txt.html();
                	console.log(content);
             }

	render(){ 
		return(
			<div style={{ "width" : "852px", "marginTop" : "30px" }}>
		             	<div id={ this.props.id } style={{ "width" : "100%", "height" : "215px"}} contentEditable="true"></div>
		             </div>
		);
	}
};

export default Editor;