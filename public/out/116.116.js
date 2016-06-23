webpackJsonp([116,24],{

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

/***/ 401:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(193);

	var _superagent = __webpack_require__(160);

	var _superagent2 = _interopRequireDefault(_superagent);

	__webpack_require__(402);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Activity_detail = function (_React$Component) {
		_inherits(Activity_detail, _React$Component);

		function Activity_detail(props) {
			_classCallCheck(this, Activity_detail);

			var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Activity_detail).call(this, props));

			var activity_detail_data = {
				activity_img_show: "../../../images/../../../images/1459782264000.jpg",
				activity_name: "遭遇触动!",
				activity_deadline: "2016-03-06 12:30",
				activity_date: "2016-03-08",
				commentSum: 30,
				signSum: 120,

				timestamp: null /*时间戳*/
			};
			_this2.state = {
				activity_detail_data: activity_detail_data
			};
			return _this2;
		}

		_createClass(Activity_detail, [{
			key: "componentDidMount",
			value: function componentDidMount() {
				var _this = this;
				var timestamp = this.props.params.timestamp;

				this.setState({ timestamp: this.props.params.activity_id });
				console.log(this.props.params);
				if (timestamp) {
					this.setState({ timestamp: timestamp });
					console.log("时间戳为:  " + timestamp + "  =>将会根据此时间戳获取到相应的活动详情数据");
					_superagent2.default.get("/getActivityDetail").accept('application/json') /*接收什么类型的数据*/
					.query({
						timestamp: timestamp
					}).end(function (err, res) {
						if (err || !res.ok) {
							console.log(err);
							console.log(res);
							return false;
						};
						console.log("已经初始化时间戳为 " + timestamp + " 的活动");
					});
				}
			}
		}, {
			key: "render",
			value: function render() {
				return _react2.default.createElement(
					"div",
					{ className: "activity_detail" },
					_react2.default.createElement(
						"div",
						{ className: "activity_detail_header" },
						_react2.default.createElement(
							"span",
							null,
							"活动详情"
						)
					),
					_react2.default.createElement(
						"div",
						{ className: "activity_detail_main" },
						_react2.default.createElement(
							"div",
							{ className: "back_to_activity_management" },
							_react2.default.createElement(
								_reactRouter.Link,
								{ to: "/Activity_management" },
								_react2.default.createElement(
									"span",
									null,
									"活动总览"
								)
							)
						),
						_react2.default.createElement(
							"div",
							{ className: "activity_information" },
							_react2.default.createElement(
								"div",
								{ className: "activity_img_show" },
								_react2.default.createElement("img", { src: this.state.activity_detail_data.activity_img_show })
							),
							_react2.default.createElement(
								"div",
								{ className: "activity" },
								_react2.default.createElement(
									"div",
									{ className: "activity_name" },
									_react2.default.createElement(
										"span",
										{ className: "label" },
										"活动名称:"
									),
									_react2.default.createElement(
										"span",
										null,
										this.state.activity_detail_data.activity_name
									)
								),
								_react2.default.createElement(
									"div",
									{ className: "activity_deadline" },
									_react2.default.createElement(
										"span",
										{ className: "label" },
										"报名截止时间:"
									),
									_react2.default.createElement(
										"span",
										null,
										this.state.activity_detail_data.activity_deadline
									)
								),
								_react2.default.createElement(
									"div",
									{ className: "activity_date" },
									_react2.default.createElement(
										"span",
										{ className: "label" },
										"活动时间:"
									),
									_react2.default.createElement(
										"span",
										null,
										this.state.activity_detail_data.activity_date
									)
								)
							)
						),
						_react2.default.createElement(
							"div",
							{ className: "activity_comment" },
							_react2.default.createElement(
								"div",
								{ className: "activity_comment_header" },
								_react2.default.createElement(
									_reactRouter.IndexLink,
									{ to: "/marriage_app/Activity_management/Activity_detail/" + this.state.timestamp, activeClassName: "active", className: "activity_comment_nav" },
									_react2.default.createElement(
										"div",
										{ className: "header_item" },
										_react2.default.createElement(
											"span",
											{ className: "label" },
											"评论"
										),
										_react2.default.createElement(
											"span",
											{ className: "comment_data" },
											this.state.activity_detail_data.commentSum
										)
									)
								),
								_react2.default.createElement(
									_reactRouter.Link,
									{ to: "/marriage_app/Activity_management/Activity_detail/" + this.state.timestamp + "/Sign", activeClassName: "active", className: "activity_comment_nav" },
									_react2.default.createElement(
										"div",
										{ className: "header_item" },
										_react2.default.createElement(
											"span",
											{ className: "label" },
											"报名"
										),
										_react2.default.createElement(
											"span",
											{ className: "comment_data" },
											this.state.activity_detail_data.signSum
										)
									)
								)
							),
							_react2.default.createElement(
								"div",
								{ className: "comment_or_sign" },
								this.props.children
							)
						)
					)
				);
			}
		}]);

		return Activity_detail;
	}(_react2.default.Component);

	exports.default = Activity_detail;

/***/ },

/***/ 402:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(403);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(173)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./activity_detail.css", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./activity_detail.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 403:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(169)();
	// imports


	// module
	exports.push([module.id, "*{\r\n\tmargin: 0;\r\n\tpadding: 0;\r\n}\r\n.activity_detail_header{\r\n\twidth: 100%;\r\n\theight: 65px;\r\n\tline-height: 65px;\r\n\tborder-bottom: 1px solid #dcdcdc;\r\n}\r\n.activity_detail_header span{\r\n\tmargin-left: 35px;\r\n\tfont-size: 22px;\r\n\tcolor: #333;\r\n}\r\n.activity_detail_main{\r\n\twidth: 852px;\r\n\tmin-height: 720px;\r\n\tmargin: 0 auto;\r\n\t/*border: 1px solid #dcdcdc;*/\r\n}\r\n\r\n/*back*/\r\n.activity_detail .back_to_activity_management{\r\n\twidth:100%;\r\n\theight:50px;\r\n\tline-height:50px;\r\n}\r\n.activity_detail .back_to_activity_management a{\r\n\ttext-decoration:none;\r\n\tcolor:#434343;\r\n\tfont-size:16px;\r\n\tpadding-left:30px;\r\n}\r\n\r\n/*活动信息*/\r\n.activity_detail .activity_information{\r\n\twidth:100%;\r\n\theight:480px;\r\n\tborder:1px solid #eee;\r\n}\r\n.activity_detail .activity_information .activity_img_show{\r\n\twidth:100%;\r\n\theight:350px;\r\n}\r\n.activity_detail .activity_information .activity_img_show img{\r\n\twidth:100%;\r\n\theight:100%;\r\n}\r\n.activity_detail .activity_information .activity{\r\n\twidth:100%;\r\n\theight:130px;\r\n}\r\n.activity_detail .activity_information .activity .activity_name{\r\n\twidth:100%;\r\n\theight:42px;\r\n\tline-height:42px;\r\n}\r\n.activity_detail .activity_information .activity .activity_deadline{\r\n\twidth:100%;\r\n\theight:42px;\r\n\tline-height:42px;\r\n}\r\n.activity_detail .activity_information .activity .activity_date{\r\n\twidth:100%;\r\n\theight:42px;\r\n\tline-height:42px;\r\n}\r\n.activity_detail .activity_information .activity span{\r\n\tfloat:left;\r\n}\r\n.activity_detail .activity_information .activity .label{\r\n\tmargin-left: 15px;\r\n\tmargin-right:20px;\r\n}\r\n\r\n/*活动评价*/\r\n.activity_detail .activity_comment{\r\n\tmargin-top:50px;\r\n\twidth:100%;\r\n}\r\n/*Link*/\r\n.activity_detail .activity_comment .activity_comment_nav{\r\n\tdisplay:inline-block;\r\n\twidth:166px;\r\n\theight:100%;\r\n\tline-height:50px;\r\n\ttext-align:center;\r\n\tcolor:#333;\r\n\ttext-decoration:none;\r\n}\r\n.activity_detail .activity_comment .active{\r\n\tbackground-color:#3b8ede;\r\n\tcolor:#FFF;\r\n}\r\n.activity_detail .activity_comment .activity_comment_header{\r\n\twidth:954px;\r\n\theight:50px;\r\n\tmargin-left: -51px;\r\n\tbackground-color:#eeeeee;\r\n\t/*border:1px solid #000;*/\r\n}\r\n.activity_detail .activity_comment .activity_comment_header .header_item{}\r\n.activity_detail .activity_comment .activity_comment_header .header_item .label{\r\n\tmargin-right: 10px;\r\n}\r\n.activity_detail .activity_comment .activity_comment_header .header_item .comment_data{\r\n\tfont-size:22px;\r\n}\r\n.activity_detail .activity_comment .activity_comment_main{\r\n\twidth:100%;\r\n}\r\n/*每一个评论*/\r\n.activity_detail .activity_comment .activity_comment_list{\r\n\twidth:100%;\r\n\tmin-height:250px;\r\n\tborder-bottom:1px solid #eee;\r\n\toverflow:hidden;\r\n}\r\n/*用户信息*/\r\n.activity_detail .activity_comment .activity_comment_list .user_information{\r\n\twidth:100%;\r\n\theight:100px;\r\n\tline-height:100px;\r\n\tmargin-top:10px;\r\n\toverflow:hidden;\r\n}\r\n.activity_detail .activity_comment .activity_comment_list .user_information img{\r\n\twidth:80px;\r\n\theight:80px;\r\n\tborder-radius:80px;\r\n\tmargin-right:20px;\r\n\tfloat:left;\r\n}\r\n.activity_detail .activity_comment .activity_comment_list .user_information span{\r\n\tfloat:left;\r\n\tmargin-right:10px;\r\n}\r\n/*评论内容*/\r\n.activity_detail .activity_comment .activity_comment_list .comment{\r\n\twidth:650px;\r\n\tmargin:0 auto;\r\n\tmin-height:50px;\r\n\toverflow:hidden;\r\n}\r\n.activity_detail .activity_comment .activity_comment_list .comment span{\r\n\tfloat:left;\r\n}\r\n.activity_detail .activity_comment .activity_comment_list .comment p{\r\n\tfloat:right;\r\n\twidth:600px;\r\n}\r\n/*评论图片*/\r\n.activity_detail .activity_comment .activity_comment_list .comment_photos{\r\n\tmargin-left: 150px;\r\n\tmargin-top:20px;\r\n\twidth:462px;\r\n\tmax-height:450px;\r\n}\r\n.activity_detail .activity_comment .activity_comment_list .comment_photos img{\r\n\tdisplay:inline-block;\r\n\twidth:150px;\r\n\theight:150px;\r\n\tmargin-right:4px;\r\n\tmargin-bottom:-2px;\r\n}\r\n/*评论时间*/\r\n.activity_detail .activity_comment .activity_comment_list .comment_date{\r\n\tfloat:right;\r\n\tmargin-top: 20px;\r\n\tmargin-bottom: 20px;\r\n}", ""]);

	// exports


/***/ }

});