import React from "react";
import { Modal } from "antd";
import Cropper from "react-cropper";

import Upload from "./upload.jsx";

import "cropperjs/dist/cropper.css";

class CropperModal extends React.Component{

	constructor( props ){
		super( props )
		this.state = {
			crop_visible : false,
			src : null
		}
	}

	cropImage(  ){
		if( typeof this.cropper.getCroppedCanvas(  ) === "undefined" ){ return };

    		// 传递剪裁数据给父组件
    		this.props.passUrlData(this.cropper.getCroppedCanvas(  ).toDataURL("image/jpeg","0.9"));
    		this.crop_close(  );
	}

	onChange( e ){
	    	e.preventDefault();
	    	let files;
	    	if (e.dataTransfer) {
	      		files = e.dataTransfer.files;
	    	} else if ( e.target ) {
	      		files = e.target.files;
	    	}
	    	let reader = new FileReader(  );
	    	reader.onload = (  ) => {
	      		this.setState( { src: reader.result } );
	    	};
	    	reader.readAsDataURL( files[0] );
	    	this.crop_show(  );
	  }

	crop_show(  ){
        		this.setState({ crop_visible : true });
    	}

    	crop_close(  ){
		this.setState({ crop_visible : false });
	}

	render(  ){
		return(
			<div className="upload_head">
				<Modal 
					wrapClassName="upload_head_modal"
					width = "680px"
					title = "图片剪裁"
				          	visible = { this.state.crop_visible }
				          	onOk = { (  ) => this.cropImage(  ) }
				          	onCancel = { (  ) => this.crop_close(  ) }
				>
					<Cropper 
					     	style={{ height: 400, width: "100%" }}
				                 	aspectRatio={ this.props.aspectRatio }
				                	preview=""
				                 	guides={ false }
				                 	src={ this.state.src }
				                 	ref={ cropper => { this.cropper = cropper } }
				            />
			           </Modal>
				<Upload onChange={ ( e ) => this.onChange( e ) }/>
			</div>
		);
	};
}
export default CropperModal