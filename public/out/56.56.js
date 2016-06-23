webpackJsonp([56,29],{

/***/ 215:
/***/ function(module, exports) {

	"use strict";

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function () {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for (var i = 0; i < this.length; i++) {
				var item = this[i];
				if (item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function (modules, mediaQuery) {
			if (typeof modules === "string") modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for (var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if (typeof id === "number") alreadyImportedModules[id] = true;
			}
			for (i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if (mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if (mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};

/***/ },

/***/ 216:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "ed60a7f9ef26a0a6870e4735de4d09a6.otf";

/***/ },

/***/ 217:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "94ed60b23fc5848ae722031dfb60ac8d.jpg";

/***/ },

/***/ 218:
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },

/***/ 226:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _superagent = __webpack_require__(159);

	var _superagent2 = _interopRequireDefault(_superagent);

	__webpack_require__(227);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Reset_password = function (_React$Component) {
		_inherits(Reset_password, _React$Component);

		function Reset_password(props) {
			_classCallCheck(this, Reset_password);

			var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Reset_password).call(this, props));

			_this2.state = {
				checkedButtonState: "点击获取验证码",
				errMess: null //消息提醒
			};
			return _this2;
		}

		/*发送验证码*/


		_createClass(Reset_password, [{
			key: "sendCheckedCode",
			value: function sendCheckedCode() {
				var _this = this;
				var phoneNumber = this.refs.phone_number.value;
				_this.refs.get_checked_code.disabled = true;
				if (phoneNumber.length == 0) {
					this.setState({ errMess: "亲~请填写手机号码~" });
					this.refs.errMess.style.display = "block";
					_this.refs.get_checked_code.disabled = false;
					return false;
				};
				if (!new RegExp("^[0-9]*$").test(phoneNumber)) {
					this.setState({ errMess: "亲~手机号码的格式不对哦~" });
					this.refs.errMess.style.display = "block";
					_this.refs.get_checked_code.disabled = false;
					return false;
				};
				_superagent2.default.get("/sendCheckedCode").query({ phoneNumber: phoneNumber }).end(function (err, res) {
					if (err || !res.ok) {
						console.log(err);
						_this.refs.get_checked_code.disabled = false;
						return false;
					};
					_this.setState({
						errMess: res.body.message //该手机号码还没注册、已经成功向该手机号码发送验证码，请注意查看
					});
					_this.refs.errMess.style.display = "block";
					if (res.body.message == "该手机号码还没注册") {
						_this.refs.get_checked_code.disabled = false;
						return false;
					} else {
						var deadline = 60;
						var timer = setInterval(function () {
							_this.setState({
								checkedButtonState: deadline-- + " s 后重新发送"
							});
							if (deadline < 0) {
								clearInterval(timer);
								_this.setState({
									checkedButtonState: "点击获取验证码"
								});
								_this.refs.get_checked_code.disabled = false;
								return;
							};
						}, 1000);
					};
				});
			}

			/*点击确认按钮时触发验证*/

		}, {
			key: "handleReset",
			value: function handleReset(event) {
				var _this = this;
				event.preventDefault();

				var phoneNumber = this.refs.phone_number.value;
				var checkedCode = this.refs.checked_code.value;
				var password = this.refs.password.value;
				var confirmPassword = this.refs.confirm_password.value;

				if (phoneNumber.length == 0 || checkedCode.length == 0 || password.length == 0 || confirmPassword.length == 0) {
					this.setState({ errMess: "亲~表单信息请填写完整哦~" });
					this.refs.errMess.style.display = "block";
					return false;
				} else if (!new RegExp("^[0-9]*$").test(phoneNumber)) {
					this.setState({ errMess: "亲~手机号码的格式不对哦~" });
					this.refs.errMess.style.display = "block";
					return false;
				} else if (new RegExp("[\\u4E00-\\u9FFF]+", "g").test(password)) {
					this.setState({ errMess: "亲~密码的格式不对哦~" });
					this.refs.errMess.style.display = "block";
					return false;
				} else if (password != confirmPassword) {
					this.setState({ errMess: "亲~两次输入的密码不一样哦~" });
					this.refs.errMess.style.display = "block";
					return false;
				} else {
					_superagent2.default.get("/CheckedCodeIsTure").query({
						phoneNumber: phoneNumber, //检测是否往该手机发送了该验证码
						checkedCode: checkedCode
					}).accept('application/json').end(function (err, res) {
						if (res.body.message == "验证码错误") {
							_this.setState({
								errMess: message //验证码错误、验证码正确
							});
							_this.refs.errMess.style.display = "block";
							return false;
						};
						_superagent2.default.post("/reset_password").send({
							phoneNumber: phoneNumber,
							password: password
						}).end(function (err, res) {
							if (err || !res.ok) {
								console.log(err);
								return false;
							};
							_this.setState({
								errMess: res.body.message //重设密码失败、重设密码成功
							});
							_this.refs.errMess.style.display = "block";
							if (res.body.message == "重设密码失败") {
								return false;
							};
							setTimeout(function () {
								location.href = "/marriage_app";
							}, 2000);
						});
					});
				};
			}
		}, {
			key: "render",
			value: function render() {
				var _this3 = this;

				return _react2.default.createElement(
					"div",
					{ className: "reset_password" },
					_react2.default.createElement(
						"div",
						{ className: "authErrMess", ref: "errMess" },
						this.state.errMess
					),
					_react2.default.createElement(
						"div",
						{ className: "reset_password_main" },
						_react2.default.createElement(
							"div",
							{ className: "decoration" },
							_react2.default.createElement(
								"div",
								{ className: "appName" },
								"初恋"
							),
							_react2.default.createElement(
								"div",
								{ className: "appSlogan" },
								"在这里，遇见最美的初恋"
							)
						),
						_react2.default.createElement(
							"form",
							{ className: "reset_password_form", method: "post" },
							_react2.default.createElement(
								"div",
								{ className: "reset_password_form_title" },
								"找回密码"
							),
							_react2.default.createElement(
								"div",
								{ className: "phone_number_wrap" },
								_react2.default.createElement("input", { className: "phone_number text_input", ref: "phone_number", type: "text", name: "phone_number", placeholder: "手机号" }),
								_react2.default.createElement("input", { className: "get_checked_code", ref: "get_checked_code", type: "button", name: "get_checked_code", value: this.state.checkedButtonState, onClick: function onClick() {
										return _this3.sendCheckedCode();
									} })
							),
							_react2.default.createElement(
								"div",
								{ className: "checked_code_wrap" },
								_react2.default.createElement("input", { className: "checked_code text_input", ref: "checked_code", type: "text", name: "checked_code", placeholder: "输入验证码" })
							),
							_react2.default.createElement(
								"div",
								{ className: "password_wrap" },
								_react2.default.createElement("input", { className: "password text_input", ref: "password", type: "password", name: "password", placeholder: "新密码" })
							),
							_react2.default.createElement(
								"div",
								{ className: "confirm_password_wrap" },
								_react2.default.createElement("input", { className: "confirm_password text_input", ref: "confirm_password", type: "password", name: "confirm_password", placeholder: "确定密码" })
							),
							_react2.default.createElement(
								"div",
								{ className: "submit_wrap" },
								_react2.default.createElement("input", { className: "submit", id: "submit", type: "submit", name: "submit", value: "确认", onClick: function onClick(event) {
										return _this3.handleReset(event);
									} })
							)
						)
					)
				);
			}
		}]);

		return Reset_password;
	}(_react2.default.Component);

	;

	exports.default = Reset_password;

	// ReactDOM.render(<Reset_password/>,document.getElementById("app"));

/***/ },

/***/ 227:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(228);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(218)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./reset_password.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./reset_password.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 228:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(215)();
	// imports


	// module
	exports.push([module.id, "*{\r\n\tmargin:0;\r\n\tpadding:0;\r\n}\r\n@font-face {\r\n    font-family: \"Source Han Sans CN\";\r\n    src: url(" + __webpack_require__(216) + ");\r\n}\r\nhtml,body{\r\n\twidth:100%;\r\n\theight:100%;\r\n\tbackground-color: #f6f6f6;\r\n\tfont-family: \"Source Han Sans CN\";\r\n}\r\n#app{\r\n\twidth:100%;\r\n\theight:100%;\r\n}\r\n.reset_password{\r\n\twidth:100%;\r\n\theight:100%;\r\n\tbackground-image:url(" + __webpack_require__(217) + ");\r\n\tbackground-repeat:no-repeat;\r\n\tbackground-size:cover;\r\n}\r\n.reset_password .reset_password_main{\r\n\tmargin:0px auto;\r\n\twidth:400px;\r\n\tposition:relative;\r\n\ttop:50px;\r\n}\r\n\r\n.reset_password .authErrMess{\r\n\tdisplay:none;\r\n\tposition:fixed;\r\n\ttop:0;\r\n\twidth:100%;\r\n\theight:50px;\r\n\tbackground-color:#f1f1f1;\r\n\tcolor:#FC052D;\r\n\ttext-align:center;\r\n\tline-height:50px;\r\n\tfont-size:16px;\r\n\tfont-family: \"Source Han Sans CN\";\r\n}\r\n\r\n/*logo区域*/\r\n.reset_password .decoration{\r\n\twidth:400px;\r\n\theight:160px;\r\n\ttext-align:center;\r\n}\r\n/* .reset_password .decoration .logo{\r\n\tmargin:0 auto;\r\n\twidth:144px;\r\n\theight:120px;\r\n\tbackground-image:url('../images/icon.png');\r\n\tbackground-repeat:no-repeat;\r\n\tbackground-size:cover;\r\n} */\r\n.reset_password .decoration .appName{\r\n\twidth:100%;\r\n\theight:90px;\r\n\tline-height:90px;\r\n\tfont-size:40px;\r\n\tcolor:#FFF;\r\n}\r\n.reset_password .decoration .appSlogan{\r\n\twidth:100%;\r\n\theight:40px;\r\n\tfont-size:18px;\r\n\tcolor:#FFF;\r\n}\r\n\r\n/*表单区域*/\r\n.reset_password .reset_password_form{\r\n\twidth:400px;\r\n\theight:400px;\r\n\tborder:1px solid #fff;\r\n\tbackground-color:#f1f1f1;\r\n}\r\n.reset_password .reset_password_form .reset_password_form_title{\r\n\twidth:100%;\r\n\theight:80px;\r\n\tfont-size:20px;\r\n\tline-height:80px;\r\n\ttext-align:center;\r\n\tcolor:#666;\r\n\tborder-bottom:1px solid #bfbfbf;\r\n}\r\n\r\n.text_input{\r\n\twidth:360px;\r\n\theight:40px;\r\n\tpadding:10px 20px;\r\n\tborder:none;\r\n\tcolor:#333;\r\n\tfont-size:16px;\r\n\tbackground-color:#f1f1f1;\r\n}\r\n\r\n.reset_password .reset_password_form .phone_number_wrap{\r\n\twidth:100%;\r\n\theight:60px;\r\n\tborder-bottom:1px solid #bfbfbf;\r\n\tposition:relative;\r\n}\r\n.reset_password .reset_password_form .phone_number{\r\n\twidth:55%;\r\n}\r\n.reset_password .reset_password_form .get_checked_code{\r\n\tdisplay:inline-block;\r\n\twidth:148px;\r\n\theight:54px;\r\n\tborder:none;\r\n\tbackground-color:#4c8ee8;\r\n\tcolor:#FFF;\r\n\tfont-size:16px;\r\n\tposition:absolute;\r\n\tright:5px;\r\n\ttop:3px;\r\n}\r\n.reset_password .reset_password_form .get_checked_code:hover{\r\n\tbackground-color:#0124FC;\r\n}\r\n\r\n.reset_password .reset_password_form .checked_code_wrap{\r\n\twidth:100%;\r\n\theight:60px;\r\n\tborder-bottom:1px solid #bfbfbf;\r\n}\r\n.reset_password .reset_password_form .checked_code{}\r\n\r\n.reset_password .reset_password_form .password_wrap{\r\n\twidth:100%;\r\n\theight:60px;\r\n\tborder-bottom:1px solid #bfbfbf;\r\n}\r\n.reset_password .reset_password_form .password{}\r\n\r\n.reset_password .reset_password_form .confirm_password_wrap{\r\n\twidth:100%;\r\n\theight:60px;\r\n\tborder-bottom:1px solid #bfbfbf;\r\n}\r\n.reset_password .reset_password_form .confirm_password{}\r\n\r\n.reset_password .reset_password_form .agree{\r\n\twidth:380px;\r\n\theight:60px;\r\n\tpadding-left:20px;\r\n\tline-height:60px;\r\n}\r\n.reset_password .reset_password_form .checkbox{}\r\n.reset_password .reset_password_form .checkbox_label{\r\n\tcolor:#666;\r\n\tfont-size:16px;\r\n}\r\n\r\n.reset_password .reset_password_form .submit_wrap{\r\n\twidth:100%;\r\n\theight:60px;\r\n\ttext-align:center;\r\n\tline-height:60px;\r\n}\r\n.reset_password .reset_password_form .submit{\r\n\tdisplay:inline-block;\r\n\twidth:150px;\r\n\theight:50px;\r\n\tborder:none;\r\n\tcolor:#FFF;\r\n\tbackground-color:#ffbb33;\r\n\tfont-size:14px;\r\n}\r\n.reset_password .reset_password_form .submit:hover{\r\n\tbackground-color:#FF5902;\r\n}", ""]);

	// exports


/***/ }

});