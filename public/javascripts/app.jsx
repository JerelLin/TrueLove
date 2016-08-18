import React from "react";

import Header from "./marriage_component/layout_component/header.jsx";
import Nav from "./marriage_component/layout_component/nav.jsx";
import Footer from "./marriage_component/layout_component/footer.jsx";

class App extends React.Component{

	render(){
		return(
			<div className="container">
				<Header />
				<div className="content_box">
					<Nav />
					<div className="content_main">
						{ this.props.children }
					</div>
				</div>
				<Footer />
			</div>
		);
	}
};

export default App;