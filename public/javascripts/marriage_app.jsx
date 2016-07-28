import React from "react";
import ReactDOM from "react-dom";
import request from "superagent"; 
import createBrowserHistory from "history/lib/createBrowserHistory"
import { Router,Route,Link,browserHistory,IndexRoute,IndexLink } from "react-router";

import auth from "./marriage_component/auth/auth.js";

ReactDOM.render(
	(
		<Router history={ createBrowserHistory() }>
		
				{/*登录*/}
				<Route path="/marriage_app/login" onEnter={ auth.already_login } getComponent={ (nextState, callback) =>{ 
					require.ensure( [ ], (require) => { 
						callback(null, require("./marriage_component/auth/login").default) 
					}) } }/>

				{/*注册*/}
				<Route path="/marriage_app/register" getComponent={ (nextState, callback) =>{ 
					require.ensure( [ ], (require) => { 
						callback(null, require("./marriage_component/auth/register").default) 
					}) } }/>

				{/*找回密码*/}
				<Route path="/marriage_app/reset_password" getComponent={ (nextState, callback) =>{ 
					require.ensure( [ ], (require) => { 
						callback(null, require("./marriage_component/auth/reset_password").default) 
					}) } }/>

				{/*认证*/}
				<Route path="/marriage_app/authentication" onEnter={ auth.redirect_to_login } getComponent={ (nextState, callback) =>{ 
					require.ensure( [ ], (require) => {
						callback(null, require("./marriage_component/auth/authentication").default) 
					}) } }/>

				{/*审核中*/}
				<Route path="/marriage_app/checking" onEnter={ auth.redirect_to_login } getComponent={ (nextState, callback) =>{ 
					require.ensure( [ ], (require) => {
						callback(null, require("./marriage_component/auth/checking").default)
					}) } }/>

				{/*注销*/}
				<Route path="/marriage_app/logout" onEnter={ auth.logout } getComponent={ (nextState, callback) =>{ 
					require.ensure( [ ], (require) => { 
						callback(null, require("./marriage_component/auth/logout").default) 
					}) } }/>

				{/*主应用*/}
				<Route path="/marriage_app" onEnter={ auth.redirect_to_login } getComponent={ (nextState, callback) =>{ 
					require.ensure( [ ], (require) => { 
						callback(null, require("./app").default) 
					}) } }>

						{/*默认*/}
						<IndexRoute getComponent={ (nextState, callback) =>{ 
							require.ensure( [ ], (require) => { 
								callback(null, require("./marriage_component/activity/news").default) 
							}) } }/>

						{/*消息详情*/}
						<Route path="/marriage_app/News_detail" getComponent={ (nextState, callback) =>{ 
							require.ensure( [ ], (require) => { 
								callback(null, require("./marriage_component/activity/news_detail").default) 
							}) } }/>

						{/*活动发布*/}
						<Route path="/marriage_app/Activity_publish" getComponent={ (nextState, callback) =>{ 
							require.ensure( [ ], (require) => { 
								callback(null, require("./marriage_component/activity/activity_publish").default) 
							}) } }/>

						{/*素材*/}
						<Route path="/marriage_app/Material" getComponent={ (nextState, callback) =>{ 
							require.ensure( [ ], (require) => { 
								callback(null, require("./marriage_component/activity/material").default) 
							}) } }/>

						{/*活动管理*/}
						<Route path="/marriage_app/Activity_management" getComponent={ (nextState, callback) =>{ 
							require.ensure( [ ], (require) => { 
								callback(null, require("./marriage_component/activity/activity_management").default) 
							}) } }/>

						{/*活动详情*/}
						<Route path="/marriage_app/Activity_management/Activity_detail/:activity_id" getComponent={ (nextState, callback) =>{ 
							require.ensure( [ ], (require) => { 
								callback(null, require("./marriage_component/activity/activity_detail").default) 
							}) } }>

								{/*评论子组件*/}
								<IndexRoute getComponent={ (nextState, callback) =>{ 
									require.ensure( [ ], (require) => { 
										callback(null, require("./marriage_component/activity/comment").default) 
									}) } }/>

								{/*报名子组件*/}
								<Route path="/marriage_app/Activity_management/Activity_detail/:activity_id/Sign" getComponent={ (nextState, callback) =>{ 
									require.ensure( [ ], (require) => { 
										callback(null, require("./marriage_component/activity/sign").default) 
									}) } }/>

						</Route>

						{/*主页分析*/}
						<Route path="/marriage_app/Page_analysis" getComponent={ (nextState, callback) =>{ 
							require.ensure( [ ], (require) => { 
								callback(null, require("./marriage_component/statistics/page_analysis").default) 
							}) } }>

								<IndexRoute getComponent={ (nextState, callback) =>{ 
									require.ensure( [ ], (require) => { 
										callback(null, require("./marriage_component/statistics/page_grow").default) 
									}) } }/>

								<Route path="/marriage_app/Page_analysis/Page_Property" getComponent={ (nextState, callback) =>{ 
									require.ensure( [ ], (require) => { 
										callback(null, require("./marriage_component/statistics/page_property").default) 
									}) } }/>

						</Route>

						{/*活动分析*/}
						<Route path="/marriage_app/Activity_analysis" getComponent={ (nextState, callback) =>{ 
							require.ensure( [ ], (require) => { 
								callback(null, require("./marriage_component/statistics/activity_analysis").default) 
							}) } }>

								<IndexRoute getComponent={ (nextState, callback) =>{ 
									require.ensure( [ ], (require) => { 
										callback(null, require("./marriage_component/statistics/activity_grow").default) 
									}) } }/>

								<Route path="/marriage_app/Activity_analysis/Activity_Property" getComponent={ (nextState, callback) =>{ 
									require.ensure( [ ], (require) => { 
										callback(null, require("./marriage_component/statistics/activity_property").default) 
									}) } }/>
									
						</Route>

						{/*修改资料*/}
						<Route path="/marriage_app/Edit_profile" getComponent={ (nextState, callback) =>{ 
							require.ensure( [ ], (require) => { 
								callback(null, require("./marriage_component/setting/edit_profile").default) 
							}) } }/>

						{/*修改密码*/}	
						<Route path="/marriage_app/Change_password" getComponent={ (nextState, callback) =>{ 
							require.ensure( [ ], (require) => { 
								callback(null, require("./marriage_component/setting/change_password").default) 
							}) } }/>

						{/*反馈*/}
						<Route path="/marriage_app/Feedback" getComponent={ (nextState, callback) =>{ 
							require.ensure( [ ], (require) => { 
								callback(null, require("./marriage_component/setting/feedback").default) 
							}) } }/>

						{/*关于初恋*/}
						<Route path="/marriage_app/About_turelove" getComponent={ (nextState, callback) =>{ 
							require.ensure( [ ], (require) => { 
								callback(null, require("./marriage_component/setting/about_turelove").default)
							}) } }/>

				</Route>
		</Router>
	), document.getElementById("app"));