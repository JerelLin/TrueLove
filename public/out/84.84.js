webpackJsonp([84,24],{

/***/ 169:
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

/***/ 170:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "ed60a7f9ef26a0a6870e4735de4d09a6.otf";

/***/ },

/***/ 171:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "00fbcbcf258afa2a60ef8967ccbe1aa9.jpg";

/***/ },

/***/ 172:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAwCAYAAABE1blzAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkQ2ODk2RUNEQkNCRDExRTU4NjdERDMwNEM0NjhBNjhFIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkQ2ODk2RUNFQkNCRDExRTU4NjdERDMwNEM0NjhBNjhFIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RDY4OTZFQ0JCQ0JEMTFFNTg2N0REMzA0QzQ2OEE2OEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RDY4OTZFQ0NCQ0JEMTFFNTg2N0REMzA0QzQ2OEE2OEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6xgpMhAAALtElEQVR42rRa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"

/***/ },

/***/ 173:
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

/***/ 488:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(159);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _superagent = __webpack_require__(160);

	var _superagent2 = _interopRequireDefault(_superagent);

	__webpack_require__(489);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Register = function (_React$Component) {
		_inherits(Register, _React$Component);

		function Register(props) {
			_classCallCheck(this, Register);

			var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Register).call(this, props));

			_this2.state = {
				errMess: null
			};
			return _this2;
		}

		/*点击注册按钮时触发验证*/


		_createClass(Register, [{
			key: "handleRegister",
			value: function handleRegister(event) {
				var _this = this;
				event.preventDefault();
				var phoneNumber = this.refs.phone_number.value;
				var password = this.refs.password.value;
				var confirm_password = this.refs.confirm_password.value;
				var checkbox = this.refs.checkbox;

				if (checkbox.checked == false) {
					return false;
				};
				if (phoneNumber.length == 0 || password.length == 0 || confirm_password.length == 0) {
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
				} else if (password != confirm_password) {
					this.setState({ errMess: "亲~两次输入的密码格式不一样哦~" });
					this.refs.errMess.style.display = "block";
					return false;
				};

				_superagent2.default.post("/register").send({
					phoneNumber: phoneNumber,
					password: password
				}).end(function (err, res) {
					if (err || !res.ok) {
						console.log(err);
						return false;
					};
					_this.setState({
						errMess: res.body.message //已经注册过了、注册成功
					});
					_this.refs.errMess.style.display = "block";
					if (res.body.message == "已经注册过了") {
						return false;
					};
					setTimeout(function () {
						location.href = "/marriage_app";
					}, 2000);
				});
			}
		}, {
			key: "render",
			value: function render() {
				var _this3 = this;

				return _react2.default.createElement(
					"div",
					{ className: "register" },
					_react2.default.createElement(
						"div",
						{ className: "errMess", ref: "errMess" },
						this.state.errMess
					),
					_react2.default.createElement(
						"div",
						{ className: "register_main" },
						_react2.default.createElement(
							"div",
							{ className: "decoration" },
							_react2.default.createElement("div", { className: "logo" }),
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
							{ className: "register_form", method: "post" },
							_react2.default.createElement(
								"div",
								{ className: "register_form_title" },
								"免费注册"
							),
							_react2.default.createElement(
								"div",
								{ className: "phone_number_wrap" },
								_react2.default.createElement("input", { className: "phone_number text_input", ref: "phone_number", type: "text", name: "phone_number", placeholder: "手机号" })
							),
							_react2.default.createElement(
								"div",
								{ className: "password_wrap" },
								_react2.default.createElement("input", { className: "password text_input", ref: "password", type: "password", name: "password", placeholder: "密码" })
							),
							_react2.default.createElement(
								"div",
								{ className: "confirm_password_wrap" },
								_react2.default.createElement("input", { className: "confirm_password text_input", ref: "confirm_password", type: "password", name: "confirm_password", placeholder: "确定密码" })
							),
							_react2.default.createElement(
								"div",
								{ className: "agree" },
								_react2.default.createElement("input", { type: "checkbox", className: "checkbox", id: "checkbox", ref: "checkbox" }),
								_react2.default.createElement(
									"label",
									{ htmlFor: "checkbox", className: "checkbox_label" },
									"我已同意\"初恋\"的注册协议"
								)
							),
							_react2.default.createElement(
								"div",
								{ className: "submit_wrap" },
								_react2.default.createElement("input", { className: "submit", id: "submit", type: "submit", name: "submit", value: "确认", onClick: function onClick(event) {
										return _this3.handleRegister(event);
									} })
							)
						)
					)
				);
			}
		}]);

		return Register;
	}(_react2.default.Component);

	;

	exports.default = Register;

	// ReactDOM.render(<Register/>,document.getElementById("app"));

/***/ },

/***/ 489:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(490);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(173)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./register.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./register.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 490:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(169)();
	// imports


	// module
	exports.push([module.id, "*{\r\n\tmargin:0;\r\n\tpadding:0;\r\n}\r\n@font-face {\r\n    font-family: \"Source Han Sans CN\";\r\n    src: url(" + __webpack_require__(170) + ");\r\n}\r\nbody{\r\n\tbackground-image:url(" + __webpack_require__(171) + ");\r\n\tbackground-repeat:no-repeat;\r\n\tbackground-size:cover;\r\n\tfont-family: \"Source Han Sans CN\";\r\n}\r\n\r\n.register{\r\n\twidth:100%;\r\n\theight:100%;\r\n}\r\n.register .register_main{\r\n\tmargin:170px auto;\r\n\twidth:400px;\r\n\theight:800px;\r\n}\r\n\r\n.register .errMess{\r\n\tdisplay:none;\r\n\tposition:fixed;\r\n\ttop:0;\r\n\twidth:100%;\r\n\theight:50px;\r\n\tbackground-color:#f1f1f1;\r\n\tcolor:#FC052D;\r\n\ttext-align:center;\r\n\tline-height:50px;\r\n\tfont-size:16px;\r\n\tfont-family: \"Source Han Sans CN\";\r\n}\r\n\r\n/*logo区域*/\r\n.register .decoration{\r\n\twidth:400px;\r\n\theight:280px;\r\n\ttext-align:center;\r\n}\r\n.register .decoration .logo{\r\n\tmargin:0 auto;\r\n\twidth:144px;\r\n\theight:120px;\r\n\tbackground-image:url(" + __webpack_require__(172) + ");\r\n\tbackground-repeat:no-repeat;\r\n\tbackground-size:cover;\r\n}\r\n.register .decoration .appName{\r\n\tmargin-top:30px;\r\n\twidth:100%;\r\n\theight:90px;\r\n\tline-height:90px;\r\n\tfont-size:40px;\r\n\tcolor:#000;\r\n}\r\n.register .decoration .appSlogan{\r\n\twidth:100%;\r\n\theight:40px;\r\n\tfont-size:18px;\r\n\tcolor:#000;\r\n}\r\n\r\n/*表单区域*/\r\n.register .register_form{\r\n\twidth:400px;\r\n\theight:400px;\r\n\tborder:1px solid #fff;\r\n\tbackground-color:#f1f1f1;\r\n}\r\n.register .register_form .register_form_title{\r\n\twidth:100%;\r\n\theight:80px;\r\n\tfont-size:20px;\r\n\tline-height:80px;\r\n\ttext-align:center;\r\n\tcolor:#666;\r\n\tborder-bottom:1px solid #bfbfbf;\r\n}\r\n\r\n.text_input{\r\n\twidth:360px;\r\n\theight:40px;\r\n\tpadding:10px 20px;\r\n\tborder:none;\r\n\tcolor:#333;\r\n\tfont-size:16px;\r\n\tbackground-color:#f1f1f1;\r\n}\r\n\r\n.register .register_form .phone_number_wrap{\r\n\twidth:100%;\r\n\theight:60px;\r\n\tborder-bottom:1px solid #bfbfbf;\r\n}\r\n.register .register_form .phone_number{}\r\n\r\n.register .register_form .password_wrap{\r\n\twidth:100%;\r\n\theight:60px;\r\n\tborder-bottom:1px solid #bfbfbf;\r\n}\r\n.register .register_form .password{}\r\n\r\n.register .register_form .confirm_password_wrap{\r\n\twidth:100%;\r\n\theight:60px;\r\n\tborder-bottom:1px solid #bfbfbf;\r\n}\r\n.register .register_form .confirm_password{}\r\n\r\n.register .register_form .agree{\r\n\twidth:380px;\r\n\theight:60px;\r\n\tpadding-left:20px;\r\n\tline-height:60px;\r\n}\r\n.register .register_form .checkbox{}\r\n.register .register_form .checkbox_label{\r\n\tcolor:#666;\r\n\tfont-size:16px;\r\n}\r\n\r\n.register .register_form .submit_wrap{\r\n\twidth:100%;\r\n\theight:60px;\r\n\ttext-align:center;\r\n\tline-height:60px;\r\n}\r\n.register .register_form .submit{\r\n\tdisplay:inline-block;\r\n\twidth:150px;\r\n\theight:50px;\r\n\tborder:none;\r\n\tcolor:#FFF;\r\n\tbackground-color:#ffbb33;\r\n\tfont-size:14px;\r\n}\r\n.register .register_form .submit:hover{\r\n\tbackground-color:#FF5902;\r\n}", ""]);

	// exports


/***/ }

});