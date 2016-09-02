import React from "react";
import "../../../stylesheets/marriage_component/layout_component/footer.css";

class Footer extends React.Component{
	render(  ){
		return(
			<div className="footer">
				<div className="footer_main">
					<div className="footer_mian_left">
						<div className="contact_us">
							<h3>联系我们</h3>
				 	    		<p>公司名称：深圳云创时代网络科技有限公司</p>
				 	    		<p>联系地址：深圳光明新区公明街四排南治一号</p>
				 	    		<p>合作邮箱：yekai0902@qq.com</p>
						</div>
						<div className="copyright">
							<p>
								copyright © 深圳云创时代网络科技有限公司2015 All Rights Reserved.
							</p>
						</div>
					</div>
					<div className="QR_Code_for_download"></div>
				</div>
			</div>
		);
	}
};

export default Footer;
