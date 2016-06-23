import React from "react";
import Upload from "../common_component/upload.jsx";
import Cropper from "react-cropper";         			/*图片剪裁组件*/
import Modal from "boron/DropModal";	 			/*遮罩层组件*/
import "../../../stylesheets/marriage_component/activity/img_crop.css";

class ImgCrop extends React.Component{

	constructor(props){
		super(props);
		this.state={
			src: null,
      			cropResult: null
		};
	}

	/*素材保存的图片*/
	componentWillReceiveProps(nextProps){
	      if(nextProps.img){
	      	this.setState({
		      	cropResult : nextProps.img
		});
	          this.refs.toDisplayNone.style.display="none";
    	          this.refs.toDisplayBlock.style.display="block";
	      }
	}

	/*剪裁图片*/
	_cropImage(){
		if(typeof this.refs.cropper.getCroppedCanvas() === 'undefined'){
      			return;
    		}
    		this.setState({
      			cropResult: this.refs.cropper.getCroppedCanvas().toDataURL()
    		});
    		this.hideModal();
    		this.refs.toDisplayNone.style.display="none";
    		this.refs.toDisplayBlock.style.display="block";

    		/*把剪裁后的图片数据传给父组件*/
    		this.props.get_imgurl( this.refs.cropper.getCroppedCanvas().toDataURL("image/jpeg","0.9") );
    		// console.log(this.refs.cropper.getCroppedCanvas().toDataURL());
	}

	/*选定上传图片时触发*/
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

	/*遮罩层出现*/
	showModal(){
        		this.refs.modal.show();
    	}

    	/*遮罩层消失*/
    	hideModal(){
        		this.refs.modal.hide();
    	}

	render(){
		return(
			<div className="ImgCrop">
				{/*遮罩层*/}
				<Modal ref="modal">
					<Cropper
				            style={{height: '400', width: '100%'}}
				            aspectRatio={900 / 500}
				            preview=''
				            guides={false}
				            src={this.state.src}
				            ref='cropper'
				            crop={this._crop} />
				            <input type="button" id="crop" value="剪裁" onClick={ this._cropImage.bind(this) }/>
			                         <input type="button" id="close" value="关闭" onClick={ this.hideModal.bind(this) }/>
			          </Modal>
				{/*封面*/}
				<div className="activity_publish_img">
					<p className="title">封面：</p>
					<span className="upload_img">
						<img src={ this.state.cropResult }/>
						<span ref="toDisplayNone" className="upload_img_center">
							<Upload value="选择上传" onChange={ this._onChange.bind(this) }/>
							<p className="tip">建议图片尺寸为900像素*500像素</p>
							<p className="tip">点击在本地中选择上传</p>
						</span>
					</span>
					<span ref="toDisplayBlock" className="toDisplayBlock">
						<Upload value="重新上传" onChange={ this._onChange.bind(this) }/>
					</span>
				</div>
				{/*预览*/}
				<div className="activity_publish_preview">
					<p>封面预览：</p>
					<span className="preview">
						<span className="title_preview"><p>{ this.props.title }</p></span>
						<span className="img_preview"><img src={ this.state.cropResult }/></span>
						<span className="content_preview"><p>{ this.props.brief }</p></span>
					</span>
				</div>
			</div>
		);
	};
};

export default ImgCrop;
