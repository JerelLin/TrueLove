import React from "react";
import ReactDOM from "react-dom";
import { Router,Route,browserHistory,IndexRoute } from "react-router";

import App from "../app.jsx";
import hook from "./route_hook.js";

ReactDOM.render(
	(
		<Router history={ browserHistory }>
			{/*注册*/}
			<Route path="/marriage_app/register" onEnter={ hook.already_login } getComponent={ (nextState, callback) =>{ 
				require.ensure( [ ], (require) => { 
					callback(null, require("../marriage_component/user_auth/register").default) 
				}) } }/>
			{/*找回密码*/}
			<Route path="/marriage_app/reset_password" onEnter={ hook.already_login } getComponent={ (nextState, callback) =>{ 
				require.ensure( [ ], (require) => { 
					callback(null, require("../marriage_component/user_auth/reset_password").default) 
				}) } }/>
			{/*登录*/}
			<Route path="/marriage_app/login" onEnter={ hook.already_login } getComponent={ (nextState, callback) =>{ 
				require.ensure( [ ], (require) => { 
					callback(null, require("../marriage_component/user_auth/login").default) 
				}) } }/>
			{/*认证*/}
			<Route path="/marriage_app/authentication" onEnter={ hook.authentication_enter } getComponent={ (nextState, callback) =>{ 
				require.ensure( [ ], (require) => {
					callback(null, require("../marriage_component/user_auth/authentication").default) 
				}) } }/>
			{/*审核中*/}
			<Route path="/marriage_app/checking" onEnter={ hook.checking_enter } getComponent={ (nextState, callback) =>{ 
				require.ensure( [ ], (require) => {
					callback(null, require("../marriage_component/user_auth/checking").default)
				}) } }/>
			{/*主应用*/}
			<Route path="/marriage_app" onEnter={ hook.marriage_app_enter } component={ App }>
				{/*默认*/}
				<IndexRoute getComponent={ (nextState, callback) =>{
					require.ensure( [ ], (require) => { 
						callback(null, require("../marriage_component/activity/news").default) 
					}) } }/>
				{/*活动发布*/}
				<Route path="/marriage_app/activity_publish" getComponent={ (nextState, callback) =>{ 
					require.ensure( [ ], (require) => { 
						callback(null, require("../marriage_component/activity/activity_publish").default) 
					}) } }/>
				{/*素材*/}
				<Route path="/marriage_app/material" getComponent={ (nextState, callback) =>{ 
					require.ensure( [ ], (require) => { 
						callback(null, require("../marriage_component/activity/material").default) 
					}) } }/>
				{/*活动管理*/}
				<Route path="/marriage_app/activity_management" getComponent={ (nextState, callback) =>{ 
					require.ensure( [ ], (require) => { 
						callback(null, require("../marriage_component/activity/activity_management").default) 
					}) } }/>
				{/*活动详情*/}
				<Route path="/marriage_app/activity_management/activity_detail" getComponent={ (nextState, callback) =>{ 
					require.ensure( [ ], (require) => { 
						callback(null, require("../marriage_component/activity/activity_detail").default) 
					}) } }/>
				{/*主页分析*/}
				<Route path="/marriage_app/page_analysis" getComponent={ (nextState, callback) =>{ 
					require.ensure( [ ], (require) => { 
						callback(null, require("../marriage_component/statistics/page_analysis").default) 
					}) } }/>					
				{/*活动分析*/}
				<Route path="/marriage_app/activity_analysis" getComponent={ (nextState, callback) =>{ 
					require.ensure( [ ], (require) => { 
						callback(null, require("../marriage_component/statistics/activity_analysis").default) 
					}) } }/>
				{/*修改资料*/}
				<Route path="/marriage_app/edit_profile" getComponent={ (nextState, callback) =>{ 
					require.ensure( [ ], (require) => { 
						callback(null, require("../marriage_component/setting/edit_profile").default) 
					}) } }/>
				{/*修改密码*/}
				<Route path="/marriage_app/change_password" getComponent={ (nextState, callback) =>{ 
					require.ensure( [ ], (require) => { 
						callback(null, require("../marriage_component/setting/change_password").default) 
					}) } }/>
				{/*意见反馈*/}
				<Route path="/marriage_app/feedback" getComponent={ (nextState, callback) =>{ 
					require.ensure( [ ], (require) => { 
						callback(null, require("../marriage_component/setting/feedback").default) 
					}) } }/>
				{/*关于初恋 */}
				<Route path="/marriage_app/about_truelove" getComponent={ (nextState, callback) =>{ 
					require.ensure( [ ], (require) => { 
						callback(null, require("../marriage_component/setting/about_truelove").default) 
					}) } }/>
			</Route>
		</Router>
	), 
	document.getElementById("app")
);