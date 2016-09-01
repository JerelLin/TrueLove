import React from "react";
import wangEditor from "wangeditor";

class Editor extends React.Component{

	constructor( props ){
		super(props)
		this.state = {

		}
	}

	componentDidMount(  ){
		let _this=this;
	      	let id = this.props.id;
	      	wangEditor.config.printLog = false;
	            this.editor = new wangEditor( id );
	            this.editor.config.uploadImgUrl = "/marriage_api/upload";
	            this.editor.config.uploadParams = {
	             	token : localStorage.marriage_app_token
	            };
	            this.editor.config.menus = [ 'bold', 'underline', 'italic', '|', 'quote', 'unorderlist', 'orderlist', '|', 'link', 'unlink', '|', 'img', '|', 'fullscreen' ];
	            this.editor.onchange=function(){
	             	if( _this.props.onValue ){
				_this.props.onValue( this.$txt.html(  ) );
			}
	            };
                	this.editor.create(  );

                	// 初始化详情
                	if( this.props.init_value ){
			this.editor.$txt.html( this.props.init_value )
		}
	}

	render(  ){ 
		return(
			<div style={{ "width" : "852px", "marginTop" : "30px" }}>
		             	<div id={ this.props.id } style={{ "width" : "100%", "height" : "320px" }} contentEditable="true"></div>
		             </div>
		)
	}
}

export default Editor