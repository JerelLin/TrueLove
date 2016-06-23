import React from "react";
import Upload from "../common_component/upload.jsx";
import Cropper from "react-cropper";          /*图片剪裁组件*/
import Modal from "boron/DropModal";	 /*遮罩层组件*/
import "../../../stylesheets/marriage_component/setting/upload_head.css";/*修改资料 上传头像*/

class Upload_head extends React.Component{

	constructor(props){
		super(props);
		this.state={
			src: null,
      			cropResult: null
		};
	}

	/*用户头像*/
	componentWillReceiveProps(nextProps){
	      	if(nextProps.img){
	      		this.setState({
		      		cropResult : nextProps.img
			});
	      	}
	}

	_cropImage(){
		if(typeof this.refs.cropper.getCroppedCanvas() === 'undefined'){
      			return;
    		}
    		this.setState({
      			cropResult: this.refs.cropper.getCroppedCanvas().toDataURL()
    		});
    		/*传递头像给父组件*/
    		this.props.get_header(this.refs.cropper.getCroppedCanvas().toDataURL("image/jpeg","0.9"));
    		this.hideModal();
	}

	_onChange(e){
	    	e.preventDefault();
	    	let files;
	    	if (e.dataTransfer) {
	      		files = e.dataTransfer.files;
	    	} else if (e.target) {
	      		files = e.target.files;
	    	}
	    	let reader = new FileReader();
	    	reader.onload = () => {
	      		this.setState({src: reader.result});
	    	};
	    	reader.readAsDataURL(files[0]);
	    	this.showModal();
	  }

	showModal(){
        		this.refs.modal.show();
    	}

    	hideModal(){
        		this.refs.modal.hide();
    	}

	render(){
		return(
			<div className="upload_head">
				{/*遮罩层*/}
				<Modal ref="modal">
					<Cropper
				            style={{height: '400', width: '100%'}}
				            aspectRatio={105 / 105}
				            preview=''
				            guides={false}
				            src={this.state.src}
				            ref='cropper'
				            crop={this._crop} />
				            <input type="button" id="crop" value="剪裁" onClick={ this._cropImage.bind(this) }/>
			                    <input type="button" id="close" value="关闭" onClick={ this.hideModal.bind(this) }/>
			          </Modal>
			      	{/*遮罩层-end*/}
				<div className="img">
					<div className="img_container"><img src={ this.state.cropResult }/></div>
				</div>
				<div className="upload"><Upload value="上传头像" onChange={ this._onChange.bind(this) }/></div>
			</div>
		);
	};
};
export default Upload_head;