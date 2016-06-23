webpackJsonp([80,24],{

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

/***/ 241:
/***/ function(module, exports) {

	"use strict";

	module.exports = function (module) {
		if (!module.webpackPolyfill) {
			module.deprecate = function () {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	};

/***/ },

/***/ 243:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	__webpack_require__(244);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Input = function (_React$Component) {
		_inherits(Input, _React$Component);

		function Input(props) {
			_classCallCheck(this, Input);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Input).call(this, props));

			_this.state = {
				value: null
			};
			return _this;
		}

		/*当有props传递过来的时候，重新更新state*/


		_createClass(Input, [{
			key: "componentWillReceiveProps",
			value: function componentWillReceiveProps(nextProps) {
				if (nextProps.init_value) {
					this.setState({
						value: nextProps.init_value
					});
				}
			}
		}, {
			key: "handleChange",
			value: function handleChange(event) {
				// console.log("event传递过去啦");
				this.setState({
					value: event.target.value
				});
				if (this.props.onValue) {
					this.props.onValue(event);
				};
			}
		}, {
			key: "handleBlur",
			value: function handleBlur(event) {
				if (this.props.onBlur) {
					this.props.onBlur(event);
				};
			}
		}, {
			key: "render",
			value: function render() {
				return _react2.default.createElement("input", { name: this.props.name,
					type: this.props.type,
					className: "input_component",
					placeholder: this.props.placeholder,
					onChange: this.handleChange.bind(this),
					onBlur: this.handleBlur.bind(this),
					value: this.state.value });
			}
		}]);

		return Input;
	}(_react2.default.Component);

	;

	Input.defaultProps = {
		type: "text"
	};

	exports.default = Input;

/***/ },

/***/ 244:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(245);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(173)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./input.css", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./input.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 245:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(169)();
	// imports


	// module
	exports.push([module.id, ".input_component{\r\n\tdisplay: inline-block;\r\n\tpadding-left: 10px;\r\n\twidth: 280px;\r\n\theight: 28px;\r\n\tcolor: #333;\r\n\tbackground-color: #FFF;\r\n\tborder: 1px solid #a3e0d1;\r\n}\r\n\r\n.input_component:focus{\r\n\tbox-shadow: 0px 0px 10px #a3e0d1;\r\n}", ""]);

	// exports


/***/ },

/***/ 246:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	__webpack_require__(247);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Textarea = function (_React$Component) {
		_inherits(Textarea, _React$Component);

		function Textarea(props) {
			_classCallCheck(this, Textarea);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Textarea).call(this, props));

			_this.state = {
				value: null
			};
			return _this;
		}

		/*当有props传递过来的时候，重新更新state*/


		_createClass(Textarea, [{
			key: "componentWillReceiveProps",
			value: function componentWillReceiveProps(nextProps) {
				if (nextProps.init_value) {
					this.setState({
						value: nextProps.init_value
					});
				}
			}
		}, {
			key: "handleChange",
			value: function handleChange(event) {
				this.setState({
					value: event.target.value
				});
				if (this.props.onValue) {
					this.props.onValue(event);
				};
			}
		}, {
			key: "handleBlur",
			value: function handleBlur(event) {
				if (this.props.onBlur) {
					this.props.onBlur(event);
				};
			}
		}, {
			key: "render",
			value: function render() {
				return _react2.default.createElement("textarea", { name: this.props.name,
					className: "textarea_component",
					placeholder: this.props.placeholder,
					onChange: this.handleChange.bind(this),
					onBlur: this.handleBlur.bind(this),
					value: this.state.value });
			}
		}]);

		return Textarea;
	}(_react2.default.Component);

	;

	exports.default = Textarea;

/***/ },

/***/ 247:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(248);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(173)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./textarea.css", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./textarea.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 248:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(169)();
	// imports


	// module
	exports.push([module.id, ".textarea_component{\r\n\twidth: 832px;\r\n\theight: 215px;\r\n\tpadding-top: 10px;\r\n\tpadding-left: 10px;\r\n\tpadding-right: 10px;\r\n\tborder: 1px solid #a3e0d1;\r\n\tcolor: #333;\r\n\tfont-size: 14px;\r\n\tresize: none;\r\n}\r\n\r\n.textarea_component:focus{\r\n\tbox-shadow: 0 0 10px #a3e0d1;\r\n}", ""]);

	// exports


/***/ },

/***/ 260:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	__webpack_require__(261);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Cancel = function (_React$Component) {
		_inherits(Cancel, _React$Component);

		function Cancel(props) {
			_classCallCheck(this, Cancel);

			return _possibleConstructorReturn(this, Object.getPrototypeOf(Cancel).call(this, props));
		}

		_createClass(Cancel, [{
			key: "handleClick",
			value: function handleClick() {
				this.props.onClick();
			}
		}, {
			key: "render",
			value: function render() {
				var _this2 = this;

				return _react2.default.createElement("input", { type: "button", className: "cancel", value: this.props.value, onClick: function onClick() {
						return _this2.handleClick();
					} });
			}
		}]);

		return Cancel;
	}(_react2.default.Component);

	;

	Cancel.defaultProps = {
		value: "取消"
	};

	exports.default = Cancel;

/***/ },

/***/ 261:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(262);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(173)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./cancel_button.css", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./cancel_button.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 262:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(169)();
	// imports


	// module
	exports.push([module.id, ".cancel{\r\n\twidth: 120px;\r\n\theight: 30px;\r\n\tborder: 1px solid #a3e0d1;\r\n\tmargin-left: 20px;\r\n\tcolor: #666;\r\n\tbackground-color: #fff;\r\n\tcursor: pointer;\r\n}\r\n.cancel:hover{\r\n\tbackground-color: #a3e0d1;\r\n\tcolor: #FFF;\r\n\tborder: none;\r\n}", ""]);

	// exports


/***/ },

/***/ 263:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	__webpack_require__(264);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Submit = function (_React$Component) {
		_inherits(Submit, _React$Component);

		function Submit(props) {
			_classCallCheck(this, Submit);

			return _possibleConstructorReturn(this, Object.getPrototypeOf(Submit).call(this, props));
		}

		_createClass(Submit, [{
			key: "handleClick",
			value: function handleClick() {
				this.props.onClick();
			}
		}, {
			key: "render",
			value: function render() {
				var _this2 = this;

				return _react2.default.createElement("input", { type: "button", className: "submit", value: this.props.value, onClick: function onClick() {
						return _this2.handleClick();
					} });
			}
		}]);

		return Submit;
	}(_react2.default.Component);

	;

	Submit.defaultProps = {
		value: "确认"
	};

	exports.default = Submit;

/***/ },

/***/ 264:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(265);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(173)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./submit_button.css", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./submit_button.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 265:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(169)();
	// imports


	// module
	exports.push([module.id, ".submit{\r\n\twidth: 120px;\r\n\theight: 30px;\r\n\tborder: none;\r\n\tmargin-left: 20px;\r\n\tcolor: #FFF;\r\n\tbackground-color: #a3e0d1;\r\n\tcursor: pointer;\r\n}\r\n.submit:hover{\r\n\tbackground-color: #04D1FC;\r\n}", ""]);

	// exports


/***/ },

/***/ 372:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	__webpack_require__(373);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Upload = function (_React$Component) {
		_inherits(Upload, _React$Component);

		function Upload() {
			_classCallCheck(this, Upload);

			return _possibleConstructorReturn(this, Object.getPrototypeOf(Upload).apply(this, arguments));
		}

		_createClass(Upload, [{
			key: "render",
			value: function render() {
				return _react2.default.createElement(
					"a",
					{ href: "javascript:;", className: "file" },
					this.props.value,
					_react2.default.createElement("input", { type: "file", onChange: this.props.onChange })
				);
			}
		}]);

		return Upload;
	}(_react2.default.Component);

	;

	Upload.defaultProps = {
		value: "上传"
	};

	exports.default = Upload;

/***/ },

/***/ 373:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(374);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(173)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./upload.css", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./upload.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 374:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(169)();
	// imports


	// module
	exports.push([module.id, ".file{\r\n\tposition: relative;\r\n\ttext-decoration: none;\r\n\ttext-align: center;\r\n\tline-height: 35px;\r\n\tdisplay: inline-block;\r\n\twidth: 130px;\r\n\theight: 35px;\r\n\tbackground-color: #FFF;\r\n\tcolor: #434343;\r\n\tborder: 1px solid #a3e0d1;\r\n\tfont-size: 14px;\r\n\t/*-webkit-transition: all .5s;\r\n\ttransition: all .5s;*/\r\n}\r\n.file:hover{\r\n\tborder: 1px solid #a3e0d1;\r\n\tbackground-color: #a3e0d1;\r\n\tcolor: #FFF;\r\n}\r\n.file input{\r\n\tposition: absolute;\r\n\tleft: 0;\r\n\ttop: 0;\r\n\tdisplay: inline-block;\r\n\twidth: 100%;\r\n\theight: 100%;\r\n\topacity: 0;\r\n}", ""]);

	// exports


/***/ },

/***/ 375:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }return target;
	};

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { 'default': obj };
	}

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _cropperjs = __webpack_require__(376);

	var _cropperjs2 = _interopRequireDefault(_cropperjs);

	__webpack_require__(377);

	var _reactDom = __webpack_require__(159);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var ReactCropper = _react2['default'].createClass({
	  displayName: 'ReactCropper',

	  propTypes: {
	    // react cropper options
	    crossOrigin: _react2['default'].PropTypes.string,
	    src: _react2['default'].PropTypes.string,
	    alt: _react2['default'].PropTypes.string,

	    // cropper options
	    aspectRatio: _react2['default'].PropTypes.number,
	    crop: _react2['default'].PropTypes.func,
	    preview: _react2['default'].PropTypes.string,
	    strict: _react2['default'].PropTypes.bool,
	    responsive: _react2['default'].PropTypes.bool,
	    checkImageOrigin: _react2['default'].PropTypes.bool,
	    background: _react2['default'].PropTypes.bool,
	    modal: _react2['default'].PropTypes.bool,
	    guides: _react2['default'].PropTypes.bool,
	    highlight: _react2['default'].PropTypes.bool,
	    autoCrop: _react2['default'].PropTypes.bool,
	    autoCropArea: _react2['default'].PropTypes.number,
	    dragCrop: _react2['default'].PropTypes.bool,
	    movable: _react2['default'].PropTypes.bool,
	    cropBoxMovable: _react2['default'].PropTypes.bool,
	    cropBoxResizable: _react2['default'].PropTypes.bool,
	    doubleClickToggle: _react2['default'].PropTypes.bool,
	    zoomable: _react2['default'].PropTypes.bool,
	    mouseWheelZoom: _react2['default'].PropTypes.bool,
	    touchDragZoom: _react2['default'].PropTypes.bool,
	    rotatable: _react2['default'].PropTypes.bool,
	    minContainerWidth: _react2['default'].PropTypes.number,
	    minContainerHeight: _react2['default'].PropTypes.number,
	    minCanvasWidth: _react2['default'].PropTypes.number,
	    minCanvasHeight: _react2['default'].PropTypes.number,
	    minCropBoxWidth: _react2['default'].PropTypes.number,
	    minCropBoxHeight: _react2['default'].PropTypes.number,
	    build: _react2['default'].PropTypes.func,
	    built: _react2['default'].PropTypes.func,
	    dragstart: _react2['default'].PropTypes.func,
	    dragmove: _react2['default'].PropTypes.func,
	    dragend: _react2['default'].PropTypes.func,
	    zoomin: _react2['default'].PropTypes.func,
	    zoomout: _react2['default'].PropTypes.func
	  },

	  getDefaultProps: function getDefaultProps() {
	    return {
	      src: null
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    // console.log('componentDidMount');
	    var options = {};
	    for (var prop in this.props) {
	      if (prop !== 'src' && prop !== 'alt' && prop !== 'crossOrigin') {
	        options[prop] = this.props[prop];
	      }
	    }
	    this.img = _reactDom2['default'].findDOMNode(this.refs.img);
	    // console.log('options');
	    // console.log(options);
	    this.cropper = new _cropperjs2['default'](this.img, options);
	  },

	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    // console.log('componentWillReceiveProps');
	    if (nextProps.src !== this.props.src) {
	      this.cropper.reset().clear().replace(nextProps.src);
	    }
	    if (nextProps.aspectRatio !== this.props.aspectRatio) {
	      this.setAspectRatio(nextProps.aspectRatio);
	    }
	  },

	  componentWillUnmount: function componentWillUnmount() {
	    // console.log('componentWillUnmount');
	    if (this.img) {
	      // Destroy the cropper, this makes sure events such as resize are cleaned up and do not leak
	      this.cropper.destroy();
	      delete this.img;
	      delete this.cropper;
	    }
	  },

	  crop: function crop() {
	    return this.cropper.crop;
	  },

	  move: function move(offsetX, offsetY) {
	    return this.cropper.move(offsetX, offsetY);
	  },

	  zoom: function zoom(ratio) {
	    return this.cropper.zoom(ratio);
	  },

	  rotate: function rotate(degree) {
	    return this.cropper.rotate(degree);
	  },

	  enable: function enable() {
	    return this.cropper.enable();
	  },

	  disable: function disable() {
	    return this.cropper.disable();
	  },

	  reset: function reset() {
	    return this.cropper.reset();
	  },

	  clear: function clear() {
	    return this.cropper.clear();
	  },

	  replace: function replace(url) {
	    return this.cropper.replace(url);
	  },

	  getData: function getData(rounded) {
	    return this.cropper.getData(rounded);
	  },

	  setData: function setData(data) {
	    return this.cropper.setData(data);
	  },

	  getContainerData: function getContainerData() {
	    return this.cropper.getContainerData();
	  },

	  getImageData: function getImageData() {
	    return this.cropper.getImageData();
	  },

	  getCanvasData: function getCanvasData() {
	    return this.cropper.getCanvasData();
	  },

	  setCanvasData: function setCanvasData(data) {
	    return this.cropper.setCanvasData(data);
	  },

	  getCropBoxData: function getCropBoxData() {
	    return this.cropper.getCropBoxData();
	  },

	  setCropBoxData: function setCropBoxData(data) {
	    return this.cropper.setCropBoxData(data);
	  },

	  getCroppedCanvas: function getCroppedCanvas(options) {
	    return this.cropper.getCroppedCanvas(options);
	  },

	  setAspectRatio: function setAspectRatio(aspectRatio) {
	    return this.cropper.setAspectRatio(aspectRatio);
	  },

	  setDragMode: function setDragMode() {
	    return this.cropper.setDragMode();
	  },

	  render: function render() {
	    return _react2['default'].createElement('div', _extends({}, this.props, { src: null, crossOrigin: null, alt: null }), _react2['default'].createElement('img', {
	      crossOrigin: this.props.crossOrigin,
	      ref: 'img',
	      src: this.props.src,
	      alt: this.props.alt === undefined ? 'picture' : this.props.alt,
	      style: { opacity: 0 }
	    }));
	  }
	});

	exports['default'] = ReactCropper;
	module.exports = exports['default'];

/***/ },

/***/ 376:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	/*!
	 * Cropper.js v0.5.6
	 * https://github.com/fengyuanchen/cropperjs
	 *
	 * Copyright (c) 2015-2016 Fengyuan Chen
	 * Released under the MIT license
	 *
	 * Date: 2016-01-18T05:33:43.542Z
	 */
	(function (global, factory) {
	  if (( false ? 'undefined' : _typeof(module)) === 'object' && _typeof(module.exports) === 'object') {
	    module.exports = global.document ? factory(global, true) : function (window) {
	      if (!window.document) {
	        throw new Error('Cropper requires a window with a document');
	      }

	      return factory(window);
	    };
	  } else {
	    factory(global);
	  }
	})(typeof window !== 'undefined' ? window : undefined, function (window, noGlobal) {

	  'use strict';

	  // Globals

	  var document = window.document;
	  var location = window.location;
	  var ArrayBuffer = window.ArrayBuffer;
	  var Object = window.Object;
	  var Array = window.Array;
	  var String = window.String;
	  var Number = window.Number;
	  var Math = window.Math;

	  // Constants
	  var NAMESPACE = 'cropper';

	  // Classes
	  var CLASS_MODAL = NAMESPACE + '-modal';
	  var CLASS_HIDE = NAMESPACE + '-hide';
	  var CLASS_HIDDEN = NAMESPACE + '-hidden';
	  var CLASS_INVISIBLE = NAMESPACE + '-invisible';
	  var CLASS_MOVE = NAMESPACE + '-move';
	  var CLASS_CROP = NAMESPACE + '-crop';
	  var CLASS_DISABLED = NAMESPACE + '-disabled';
	  var CLASS_BG = NAMESPACE + '-bg';

	  // Events
	  var EVENT_MOUSE_DOWN = 'mousedown touchstart pointerdown MSPointerDown';
	  var EVENT_MOUSE_MOVE = 'mousemove touchmove pointermove MSPointerMove';
	  var EVENT_MOUSE_UP = 'mouseup touchend touchcancel pointerup pointercancel MSPointerUp MSPointerCancel';
	  var EVENT_WHEEL = 'wheel mousewheel DOMMouseScroll';
	  var EVENT_DBLCLICK = 'dblclick';
	  var EVENT_RESIZE = 'resize';
	  var EVENT_ERROR = 'error';
	  var EVENT_LOAD = 'load';

	  // RegExps
	  var REGEXP_ACTIONS = /e|w|s|n|se|sw|ne|nw|all|crop|move|zoom/;
	  var REGEXP_SUFFIX = /width|height|left|top|marginLeft|marginTop/;
	  var REGEXP_ORIGINS = /^(https?:)\/\/([^\:\/\?#]+):?(\d*)/i;
	  var REGEXP_TRIM = /^\s+(.*)\s+$/;
	  var REGEXP_SPACES = /\s+/;
	  var REGEXP_DATA_URL = /^data\:/;
	  var REGEXP_DATA_URL_HEAD = /^data\:([^\;]+)\;base64,/;
	  var REGEXP_DATA_URL_JPEG = /^data\:image\/jpeg.*;base64,/;

	  // Data
	  var DATA_PREVIEW = 'preview';
	  var DATA_ACTION = 'action';

	  // Actions
	  var ACTION_EAST = 'e';
	  var ACTION_WEST = 'w';
	  var ACTION_SOUTH = 's';
	  var ACTION_NORTH = 'n';
	  var ACTION_SOUTH_EAST = 'se';
	  var ACTION_SOUTH_WEST = 'sw';
	  var ACTION_NORTH_EAST = 'ne';
	  var ACTION_NORTH_WEST = 'nw';
	  var ACTION_ALL = 'all';
	  var ACTION_CROP = 'crop';
	  var ACTION_MOVE = 'move';
	  var ACTION_ZOOM = 'zoom';
	  var ACTION_NONE = 'none';

	  // Supports
	  var SUPPORT_CANVAS = !!document.createElement('canvas').getContext;

	  // Maths
	  var min = Math.min;
	  var max = Math.max;
	  var abs = Math.abs;
	  var sin = Math.sin;
	  var cos = Math.cos;
	  var sqrt = Math.sqrt;
	  var round = Math.round;
	  var floor = Math.floor;
	  var PI = Math.PI;

	  // Utilities
	  var objectProto = Object.prototype;
	  var toString = objectProto.toString;
	  var hasOwnProperty = objectProto.hasOwnProperty;
	  var slice = Array.prototype.slice;
	  var fromCharCode = String.fromCharCode;

	  function typeOf(obj) {
	    return toString.call(obj).slice(8, -1).toLowerCase();
	  }

	  function isNumber(num) {
	    return typeof num === 'number' && !isNaN(num);
	  }

	  function isUndefined(obj) {
	    return typeof obj === 'undefined';
	  }

	  function isObject(obj) {
	    return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj !== null;
	  }

	  function isPlainObject(obj) {
	    var constructor;
	    var prototype;

	    if (!isObject(obj)) {
	      return false;
	    }

	    try {
	      constructor = obj.constructor;
	      prototype = constructor.prototype;

	      return constructor && prototype && hasOwnProperty.call(prototype, 'isPrototypeOf');
	    } catch (e) {
	      return false;
	    }
	  }

	  function isFunction(fn) {
	    return typeOf(fn) === 'function';
	  }

	  function isArray(arr) {
	    return Array.isArray ? Array.isArray(arr) : typeOf(arr) === 'array';
	  }

	  function toArray(obj, offset) {
	    offset = offset >= 0 ? offset : 0;

	    if (Array.from) {
	      return Array.from(obj).slice(offset);
	    }

	    return slice.call(obj, offset);
	  }

	  function trim(str) {
	    if (typeof str === 'string') {
	      str = str.trim ? str.trim() : str.replace(REGEXP_TRIM, '$1');
	    }

	    return str;
	  }

	  function each(obj, callback) {
	    var length;
	    var i;

	    if (obj && isFunction(callback)) {
	      if (isArray(obj) || isNumber(obj.length) /* array-like */) {
	          for (i = 0, length = obj.length; i < length; i++) {
	            if (callback.call(obj, obj[i], i, obj) === false) {
	              break;
	            }
	          }
	        } else if (isObject(obj)) {
	        for (i in obj) {
	          if (obj.hasOwnProperty(i)) {
	            if (callback.call(obj, obj[i], i, obj) === false) {
	              break;
	            }
	          }
	        }
	      }
	    }

	    return obj;
	  }

	  function extend(obj) {
	    var args;

	    if (arguments.length > 1) {
	      args = toArray(arguments);

	      if (Object.assign) {
	        return Object.assign.apply(Object, args);
	      }

	      args.shift();

	      each(args, function (arg) {
	        each(arg, function (prop, i) {
	          obj[i] = prop;
	        });
	      });
	    }

	    return obj;
	  }

	  function proxy(fn, context) {
	    var args = toArray(arguments, 2);

	    return function () {
	      return fn.apply(context, args.concat(toArray(arguments)));
	    };
	  }

	  function setStyle(element, styles) {
	    var style = element.style;

	    each(styles, function (value, property) {
	      if (REGEXP_SUFFIX.test(property) && isNumber(value)) {
	        value += 'px';
	      }

	      style[property] = value;
	    });
	  }

	  function hasClass(element, value) {
	    return element.classList ? element.classList.contains(value) : element.className.indexOf(value) > -1;
	  }

	  function addClass(element, value) {
	    var className;

	    if (isNumber(element.length)) {
	      return each(element, function (elem) {
	        addClass(elem, value);
	      });
	    }

	    if (element.classList) {
	      return element.classList.add(value);
	    }

	    className = trim(element.className);

	    if (!className) {
	      element.className = value;
	    } else if (className.indexOf(value) < 0) {
	      element.className = className + ' ' + value;
	    }
	  }

	  function removeClass(element, value) {
	    if (isNumber(element.length)) {
	      return each(element, function (elem) {
	        removeClass(elem, value);
	      });
	    }

	    if (element.classList) {
	      return element.classList.remove(value);
	    }

	    if (element.className.indexOf(value) >= 0) {
	      element.className = element.className.replace(value, '');
	    }
	  }

	  function toggleClass(element, value, added) {
	    if (isNumber(element.length)) {
	      return each(element, function (elem) {
	        toggleClass(elem, value, added);
	      });
	    }

	    // IE10-11 doesn't support the second parameter of `classList.toggle`
	    if (added) {
	      addClass(element, value);
	    } else {
	      removeClass(element, value);
	    }
	  }

	  function getData(element, name) {
	    return isObject(element[name]) ? element[name] : element.dataset ? element.dataset[name] : element.getAttribute('data-' + name);
	  }

	  function setData(element, name, data) {
	    if (isObject(data) && isUndefined(element[name])) {
	      element[name] = data;
	    } else if (element.dataset) {
	      element.dataset[name] = data;
	    } else {
	      element.setAttribute('data-' + name, data);
	    }
	  }

	  function removeData(element, name) {
	    if (isObject(element[name])) {
	      delete element[name];
	    } else if (element.dataset) {
	      delete element.dataset[name];
	    } else {
	      element.removeAttribute('data-' + name);
	    }
	  }

	  function addListener(element, type, handler) {
	    var types = trim(type).split(REGEXP_SPACES);

	    if (types.length > 1) {
	      return each(types, function (type) {
	        addListener(element, type, handler);
	      });
	    }

	    if (element.addEventListener) {
	      element.addEventListener(type, handler, false);
	    } else if (element.attachEvent) {
	      element.attachEvent('on' + type, handler);
	    }
	  }

	  function removeListener(element, type, handler) {
	    var types = trim(type).split(REGEXP_SPACES);

	    if (types.length > 1) {
	      return each(types, function (type) {
	        removeListener(element, type, handler);
	      });
	    }

	    if (element.removeEventListener) {
	      element.removeEventListener(type, handler, false);
	    } else if (element.detachEvent) {
	      element.detachEvent('on' + type, handler);
	    }
	  }

	  function preventDefault(e) {
	    if (e.preventDefault) {
	      e.preventDefault();
	    } else {
	      e.returnValue = false;
	    }
	  }

	  function getEvent(event) {
	    var e = event || window.event;
	    var doc;

	    // Fix target property (IE8)
	    if (!e.target) {
	      e.target = e.srcElement || document;
	    }

	    if (!isNumber(e.pageX)) {
	      doc = document.documentElement;
	      e.pageX = e.clientX + (window.scrollX || doc && doc.scrollLeft || 0) - (doc && doc.clientLeft || 0);
	      e.pageY = e.clientY + (window.scrollY || doc && doc.scrollTop || 0) - (doc && doc.clientTop || 0);
	    }

	    return e;
	  }

	  function getOffset(element) {
	    var doc = document.documentElement;
	    var box = element.getBoundingClientRect();

	    return {
	      left: box.left + (window.scrollX || doc && doc.scrollLeft || 0) - (doc && doc.clientLeft || 0),
	      top: box.top + (window.scrollY || doc && doc.scrollTop || 0) - (doc && doc.clientTop || 0)
	    };
	  }

	  function getTouchesCenter(touches) {
	    var length = touches.length;
	    var pageX = 0;
	    var pageY = 0;

	    if (length) {
	      each(touches, function (touch) {
	        pageX += touch.pageX;
	        pageY += touch.pageY;
	      });

	      pageX /= length;
	      pageY /= length;
	    }

	    return {
	      pageX: pageX,
	      pageY: pageY
	    };
	  }

	  function getByTag(element, tagName) {
	    return element.getElementsByTagName(tagName);
	  }

	  function getByClass(element, className) {
	    return element.getElementsByClassName ? element.getElementsByClassName(className) : element.querySelectorAll('.' + className);
	  }

	  function createElement(tagName) {
	    return document.createElement(tagName);
	  }

	  function appendChild(element, elem) {
	    element.appendChild(elem);
	  }

	  function removeChild(element) {
	    if (element.parentNode) {
	      element.parentNode.removeChild(element);
	    }
	  }

	  function empty(element) {
	    while (element.firstChild) {
	      element.removeChild(element.firstChild);
	    }
	  }

	  function isCrossOriginURL(url) {
	    var parts = url.match(REGEXP_ORIGINS);

	    return parts && (parts[1] !== location.protocol || parts[2] !== location.hostname || parts[3] !== location.port);
	  }

	  function addTimestamp(url) {
	    var timestamp = 'timestamp=' + new Date().getTime();

	    return url + (url.indexOf('?') === -1 ? '?' : '&') + timestamp;
	  }

	  function getImageSize(image, callback) {
	    var newImage;

	    // Modern browsers
	    if (image.naturalWidth) {
	      return callback(image.naturalWidth, image.naturalHeight);
	    }

	    // IE8: Don't use `new Image()` here
	    newImage = createElement('img');

	    newImage.onload = function () {
	      callback(this.width, this.height);
	    };

	    newImage.src = image.src;
	  }

	  function getTransform(data) {
	    var transforms = [];
	    var rotate = data.rotate;
	    var scaleX = data.scaleX;
	    var scaleY = data.scaleY;

	    if (isNumber(rotate)) {
	      transforms.push('rotate(' + rotate + 'deg)');
	    }

	    if (isNumber(scaleX) && isNumber(scaleY)) {
	      transforms.push('scale(' + scaleX + ',' + scaleY + ')');
	    }

	    return transforms.length ? transforms.join(' ') : 'none';
	  }

	  function getRotatedSizes(data, reversed) {
	    var deg = abs(data.degree) % 180;
	    var arc = (deg > 90 ? 180 - deg : deg) * PI / 180;
	    var sinArc = sin(arc);
	    var cosArc = cos(arc);
	    var width = data.width;
	    var height = data.height;
	    var aspectRatio = data.aspectRatio;
	    var newWidth;
	    var newHeight;

	    if (!reversed) {
	      newWidth = width * cosArc + height * sinArc;
	      newHeight = width * sinArc + height * cosArc;
	    } else {
	      newWidth = width / (cosArc + sinArc / aspectRatio);
	      newHeight = newWidth / aspectRatio;
	    }

	    return {
	      width: newWidth,
	      height: newHeight
	    };
	  }

	  function getSourceCanvas(image, data) {
	    var canvas = createElement('canvas');
	    var context = canvas.getContext('2d');
	    var x = 0;
	    var y = 0;
	    var width = data.naturalWidth;
	    var height = data.naturalHeight;
	    var rotate = data.rotate;
	    var scaleX = data.scaleX;
	    var scaleY = data.scaleY;
	    var scalable = isNumber(scaleX) && isNumber(scaleY) && (scaleX !== 1 || scaleY !== 1);
	    var rotatable = isNumber(rotate) && rotate !== 0;
	    var advanced = rotatable || scalable;
	    var canvasWidth = width;
	    var canvasHeight = height;
	    var translateX;
	    var translateY;
	    var rotated;

	    if (scalable) {
	      translateX = width / 2;
	      translateY = height / 2;
	    }

	    if (rotatable) {
	      rotated = getRotatedSizes({
	        width: width,
	        height: height,
	        degree: rotate
	      });

	      canvasWidth = rotated.width;
	      canvasHeight = rotated.height;
	      translateX = rotated.width / 2;
	      translateY = rotated.height / 2;
	    }

	    canvas.width = canvasWidth;
	    canvas.height = canvasHeight;

	    if (advanced) {
	      x = -width / 2;
	      y = -height / 2;

	      context.save();
	      context.translate(translateX, translateY);
	    }

	    if (rotatable) {
	      context.rotate(rotate * PI / 180);
	    }

	    // Should call `scale` after rotated
	    if (scalable) {
	      context.scale(scaleX, scaleY);
	    }

	    context.drawImage(image, floor(x), floor(y), floor(width), floor(height));

	    if (advanced) {
	      context.restore();
	    }

	    return canvas;
	  }

	  function getStringFromCharCode(dataView, start, length) {
	    var str = '';
	    var i = start;

	    for (length += start; i < length; i++) {
	      str += fromCharCode(dataView.getUint8(i));
	    }

	    return str;
	  }

	  function getOrientation(arrayBuffer) {
	    var dataView = new DataView(arrayBuffer);
	    var length = dataView.byteLength;
	    var orientation;
	    var exifIDCode;
	    var tiffOffset;
	    var firstIFDOffset;
	    var littleEndian;
	    var endianness;
	    var app1Start;
	    var ifdStart;
	    var offset;
	    var i;

	    // Only handle JPEG image (start by 0xFFD8)
	    if (dataView.getUint8(0) === 0xFF && dataView.getUint8(1) === 0xD8) {
	      offset = 2;

	      while (offset < length) {
	        if (dataView.getUint8(offset) === 0xFF && dataView.getUint8(offset + 1) === 0xE1) {
	          app1Start = offset;
	          break;
	        }

	        offset++;
	      }
	    }

	    if (app1Start) {
	      exifIDCode = app1Start + 4;
	      tiffOffset = app1Start + 10;

	      if (getStringFromCharCode(dataView, exifIDCode, 4) === 'Exif') {
	        endianness = dataView.getUint16(tiffOffset);
	        littleEndian = endianness === 0x4949;

	        if (littleEndian || endianness === 0x4D4D /* bigEndian */) {
	            if (dataView.getUint16(tiffOffset + 2, littleEndian) === 0x002A) {
	              firstIFDOffset = dataView.getUint32(tiffOffset + 4, littleEndian);

	              if (firstIFDOffset >= 0x00000008) {
	                ifdStart = tiffOffset + firstIFDOffset;
	              }
	            }
	          }
	      }
	    }

	    if (ifdStart) {
	      length = dataView.getUint16(ifdStart, littleEndian);

	      for (i = 0; i < length; i++) {
	        offset = ifdStart + i * 12 + 2;

	        if (dataView.getUint16(offset, littleEndian) === 0x0112 /* Orientation */) {

	            // 8 is the offset of the current tag's value
	            offset += 8;

	            // Get the original orientation value
	            orientation = dataView.getUint16(offset, littleEndian);

	            // Override the orientation with the default value: 1
	            dataView.setUint16(offset, 1, littleEndian);
	            break;
	          }
	      }
	    }

	    return orientation;
	  }

	  function dataURLToArrayBuffer(dataURL) {
	    var base64 = dataURL.replace(REGEXP_DATA_URL_HEAD, '');
	    var binary = atob(base64);
	    var length = binary.length;
	    var arrayBuffer = new ArrayBuffer(length);
	    var dataView = new Uint8Array(arrayBuffer);
	    var i;

	    for (i = 0; i < length; i++) {
	      dataView[i] = binary.charCodeAt(i);
	    }

	    return arrayBuffer;
	  }

	  // Only available for JPEG image
	  function arrayBufferToDataURL(arrayBuffer) {
	    var dataView = new Uint8Array(arrayBuffer);
	    var length = dataView.length;
	    var base64 = '';
	    var i;

	    for (i = 0; i < length; i++) {
	      base64 += fromCharCode(dataView[i]);
	    }

	    return 'data:image/jpeg;base64,' + btoa(base64);
	  }

	  function Cropper(element, options) {
	    var _this = this;

	    _this.element = element;
	    _this.options = extend({}, Cropper.DEFAULTS, isPlainObject(options) && options);
	    _this.ready = false;
	    _this.built = false;
	    _this.complete = false;
	    _this.rotated = false;
	    _this.cropped = false;
	    _this.disabled = false;
	    _this.replaced = false;
	    _this.limited = false;
	    _this.wheeling = false;
	    _this.isImg = false;
	    _this.originalUrl = '';
	    _this.canvasData = null;
	    _this.cropBoxData = null;
	    _this.previews = null;
	    _this.init();
	  }

	  Cropper.prototype = {
	    constructor: Cropper,

	    init: function init() {
	      var _this = this;
	      var element = _this.element;
	      var tagName = element.tagName.toLowerCase();
	      var url;

	      if (getData(element, NAMESPACE)) {
	        return;
	      }

	      setData(element, NAMESPACE, _this);

	      if (tagName === 'img') {
	        _this.isImg = true;

	        // e.g.: "img/picture.jpg"
	        _this.originalUrl = url = element.getAttribute('src');

	        // Stop when it's a blank image
	        if (!url) {
	          return;
	        }

	        // e.g.: "http://example.com/img/picture.jpg"
	        url = element.src;
	      } else if (tagName === 'canvas' && SUPPORT_CANVAS) {
	        url = element.toDataURL();
	      }

	      _this.load(url);
	    },

	    load: function load(url) {
	      var _this = this;
	      var options = _this.options;
	      var xhr;

	      if (!url) {
	        return;
	      }

	      if (isFunction(options.build) && options.build.call(_this.element) === false) {
	        return;
	      }

	      _this.url = url;
	      _this.imageData = {};

	      if (!options.checkOrientation || !ArrayBuffer) {
	        return _this.clone();
	      }

	      // XMLHttpRequest disallows to open a Data URL in some browsers like IE11 and Safari
	      if (REGEXP_DATA_URL.test(url)) {
	        return REGEXP_DATA_URL_JPEG.test(url) ? _this.read(dataURLToArrayBuffer(url)) : _this.clone();
	      }

	      xhr = new XMLHttpRequest();

	      xhr.onerror = xhr.onabort = function () {
	        _this.clone();
	      };

	      xhr.onload = function () {
	        _this.read(this.response);
	      };

	      xhr.open('get', url);
	      xhr.responseType = 'arraybuffer';
	      xhr.send();
	    },

	    read: function read(arrayBuffer) {
	      var _this = this;
	      var options = _this.options;
	      var orientation = getOrientation(arrayBuffer);
	      var imageData = _this.imageData;
	      var rotate;
	      var scaleX;
	      var scaleY;

	      if (orientation > 1) {
	        _this.url = arrayBufferToDataURL(arrayBuffer);

	        switch (orientation) {

	          // flip horizontal
	          case 2:
	            scaleX = -1;
	            break;

	          // rotate left 180°
	          case 3:
	            rotate = -180;
	            break;

	          // flip vertical
	          case 4:
	            scaleY = -1;
	            break;

	          // flip vertical + rotate right 90°
	          case 5:
	            rotate = 90;
	            scaleY = -1;
	            break;

	          // rotate right 90°
	          case 6:
	            rotate = 90;
	            break;

	          // flip horizontal + rotate right 90°
	          case 7:
	            rotate = 90;
	            scaleX = -1;
	            break;

	          // rotate left 90°
	          case 8:
	            rotate = -90;
	            break;
	        }
	      }

	      if (options.rotatable) {
	        imageData.rotate = rotate;
	      }

	      if (options.scalable) {
	        imageData.scaleX = scaleX;
	        imageData.scaleY = scaleY;
	      }

	      _this.clone();
	    },

	    clone: function clone() {
	      var _this = this;
	      var element = _this.element;
	      var url = _this.url;
	      var crossOrigin;
	      var crossOriginUrl;
	      var image;
	      var start;
	      var stop;

	      if (_this.options.checkCrossOrigin && isCrossOriginURL(url)) {
	        crossOrigin = element.crossOrigin;

	        if (crossOrigin) {
	          crossOriginUrl = url;
	        } else {
	          crossOrigin = 'anonymous';

	          // Bust cache when there is not a "crossOrigin" property
	          crossOriginUrl = addTimestamp(url);
	        }
	      }

	      _this.crossOrigin = crossOrigin;
	      _this.crossOriginUrl = crossOriginUrl;
	      image = createElement('img');

	      if (crossOrigin) {
	        image.crossOrigin = crossOrigin;
	      }

	      image.src = crossOriginUrl || url;
	      _this.image = image;
	      _this._start = start = proxy(_this.start, _this);
	      _this._stop = stop = proxy(_this.stop, _this);

	      if (_this.isImg) {
	        if (element.complete) {
	          _this.start();
	        } else {
	          addListener(element, EVENT_LOAD, start);
	        }
	      } else {
	        addListener(image, EVENT_LOAD, start);
	        addListener(image, EVENT_ERROR, stop);
	        addClass(image, CLASS_HIDE);
	        element.parentNode.insertBefore(image, element.nextSibling);
	      }
	    },

	    start: function start(event) {
	      var _this = this;
	      var image = _this.isImg ? _this.element : _this.image;

	      if (event) {
	        removeListener(image, EVENT_LOAD, _this._start);
	        removeListener(image, EVENT_ERROR, _this._stop);
	      }

	      getImageSize(image, function (naturalWidth, naturalHeight) {
	        extend(_this.imageData, {
	          naturalWidth: naturalWidth,
	          naturalHeight: naturalHeight,
	          aspectRatio: naturalWidth / naturalHeight
	        });

	        _this.ready = true;
	        _this.build();
	      });
	    },

	    stop: function stop() {
	      var _this = this;
	      var image = _this.image;

	      removeListener(image, EVENT_LOAD, _this._start);
	      removeListener(image, EVENT_ERROR, _this._stop);

	      removeChild(image);
	      _this.image = null;
	    },

	    build: function build() {
	      var _this = this;
	      var options = _this.options;
	      var element = _this.element;
	      var image = _this.image;
	      var container;
	      var template;
	      var cropper;
	      var canvas;
	      var dragBox;
	      var cropBox;
	      var face;

	      if (!_this.ready) {
	        return;
	      }

	      // Unbuild first when replace
	      if (_this.built) {
	        _this.unbuild();
	      }

	      template = createElement('div');
	      template.innerHTML = Cropper.TEMPLATE;

	      // Create cropper elements
	      _this.container = container = element.parentNode;
	      _this.cropper = cropper = getByClass(template, 'cropper-container')[0];
	      _this.canvas = canvas = getByClass(cropper, 'cropper-canvas')[0];
	      _this.dragBox = dragBox = getByClass(cropper, 'cropper-drag-box')[0];
	      _this.cropBox = cropBox = getByClass(cropper, 'cropper-crop-box')[0];
	      _this.viewBox = getByClass(cropper, 'cropper-view-box')[0];
	      _this.face = face = getByClass(cropBox, 'cropper-face')[0];

	      appendChild(canvas, image);

	      // Hide the original image
	      addClass(element, CLASS_HIDDEN);

	      // Inserts the cropper after to the current image
	      container.insertBefore(cropper, element.nextSibling);

	      // Show the image if is hidden
	      if (!_this.isImg) {
	        removeClass(image, CLASS_HIDE);
	      }

	      _this.initPreview();
	      _this.bind();

	      options.aspectRatio = max(0, options.aspectRatio) || NaN;
	      options.viewMode = max(0, min(3, round(options.viewMode))) || 0;

	      if (options.autoCrop) {
	        _this.cropped = true;

	        if (options.modal) {
	          addClass(dragBox, CLASS_MODAL);
	        }
	      } else {
	        addClass(cropBox, CLASS_HIDDEN);
	      }

	      if (!options.guides) {
	        addClass(getByClass(cropBox, 'cropper-dashed'), CLASS_HIDDEN);
	      }

	      if (!options.center) {
	        addClass(getByClass(cropBox, 'cropper-center'), CLASS_HIDDEN);
	      }

	      if (options.background) {
	        addClass(cropper, CLASS_BG);
	      }

	      if (!options.highlight) {
	        addClass(face, CLASS_INVISIBLE);
	      }

	      if (options.cropBoxMovable) {
	        addClass(face, CLASS_MOVE);
	        setData(face, DATA_ACTION, ACTION_ALL);
	      }

	      if (!options.cropBoxResizable) {
	        addClass(getByClass(cropBox, 'cropper-line'), CLASS_HIDDEN);
	        addClass(getByClass(cropBox, 'cropper-point'), CLASS_HIDDEN);
	      }

	      _this.setDragMode(options.dragMode);
	      _this.render();
	      _this.built = true;
	      _this.setData(options.data);

	      // Call the built asynchronously to keep "image.cropper" is defined
	      setTimeout(function () {
	        if (isFunction(options.built)) {
	          options.built.call(element);
	        }

	        if (isFunction(options.crop)) {
	          options.crop.call(element, _this.getData());
	        }

	        _this.complete = true;
	      }, 0);
	    },

	    unbuild: function unbuild() {
	      var _this = this;

	      if (!_this.built) {
	        return;
	      }

	      _this.built = false;
	      _this.complete = false;
	      _this.initialImageData = null;

	      // Clear `initialCanvasData` is necessary when replace
	      _this.initialCanvasData = null;
	      _this.initialCropBoxData = null;
	      _this.containerData = null;
	      _this.canvasData = null;

	      // Clear `cropBoxData` is necessary when replace
	      _this.cropBoxData = null;
	      _this.unbind();

	      _this.resetPreview();
	      _this.previews = null;

	      _this.viewBox = null;
	      _this.cropBox = null;
	      _this.dragBox = null;
	      _this.canvas = null;
	      _this.container = null;

	      removeChild(_this.cropper);
	      _this.cropper = null;
	    },

	    render: function render() {
	      var _this = this;

	      _this.initContainer();
	      _this.initCanvas();
	      _this.initCropBox();

	      _this.renderCanvas();

	      if (_this.cropped) {
	        _this.renderCropBox();
	      }
	    },

	    initContainer: function initContainer() {
	      var _this = this;
	      var options = _this.options;
	      var element = _this.element;
	      var container = _this.container;
	      var cropper = _this.cropper;
	      var containerData;

	      addClass(cropper, CLASS_HIDDEN);
	      removeClass(element, CLASS_HIDDEN);

	      _this.containerData = containerData = {
	        width: max(container.offsetWidth, Number(options.minContainerWidth) || 200),
	        height: max(container.offsetHeight, Number(options.minContainerHeight) || 100)
	      };

	      setStyle(cropper, {
	        width: containerData.width,
	        height: containerData.height
	      });

	      addClass(element, CLASS_HIDDEN);
	      removeClass(cropper, CLASS_HIDDEN);
	    },

	    // Canvas (image wrapper)
	    initCanvas: function initCanvas() {
	      var _this = this;
	      var viewMode = _this.options.viewMode;
	      var containerData = _this.containerData;
	      var imageData = _this.imageData;
	      var rotated = abs(imageData.rotate) === 90;
	      var naturalWidth = rotated ? imageData.naturalHeight : imageData.naturalWidth;
	      var naturalHeight = rotated ? imageData.naturalWidth : imageData.naturalHeight;
	      var aspectRatio = naturalWidth / naturalHeight;
	      var canvasWidth = containerData.width;
	      var canvasHeight = containerData.height;
	      var canvasData;

	      if (containerData.height * aspectRatio > containerData.width) {
	        if (viewMode === 3) {
	          canvasWidth = containerData.height * aspectRatio;
	        } else {
	          canvasHeight = containerData.width / aspectRatio;
	        }
	      } else {
	        if (viewMode === 3) {
	          canvasHeight = containerData.width / aspectRatio;
	        } else {
	          canvasWidth = containerData.height * aspectRatio;
	        }
	      }

	      canvasData = {
	        naturalWidth: naturalWidth,
	        naturalHeight: naturalHeight,
	        aspectRatio: aspectRatio,
	        width: canvasWidth,
	        height: canvasHeight
	      };

	      canvasData.oldLeft = canvasData.left = (containerData.width - canvasWidth) / 2;
	      canvasData.oldTop = canvasData.top = (containerData.height - canvasHeight) / 2;

	      _this.canvasData = canvasData;
	      _this.limited = viewMode === 1 || viewMode === 2;
	      _this.limitCanvas(true, true);
	      _this.initialImageData = extend({}, imageData);
	      _this.initialCanvasData = extend({}, canvasData);
	    },

	    limitCanvas: function limitCanvas(sizeLimited, positionLimited) {
	      var _this = this;
	      var options = _this.options;
	      var viewMode = options.viewMode;
	      var containerData = _this.containerData;
	      var canvasData = _this.canvasData;
	      var aspectRatio = canvasData.aspectRatio;
	      var cropBoxData = _this.cropBoxData;
	      var cropped = _this.cropped && cropBoxData;
	      var minCanvasWidth;
	      var minCanvasHeight;
	      var newCanvasLeft;
	      var newCanvasTop;

	      if (sizeLimited) {
	        minCanvasWidth = Number(options.minCanvasWidth) || 0;
	        minCanvasHeight = Number(options.minCanvasHeight) || 0;

	        if (viewMode > 1) {
	          minCanvasWidth = max(minCanvasWidth, containerData.width);
	          minCanvasHeight = max(minCanvasHeight, containerData.height);

	          if (viewMode === 3) {
	            if (minCanvasHeight * aspectRatio > minCanvasWidth) {
	              minCanvasWidth = minCanvasHeight * aspectRatio;
	            } else {
	              minCanvasHeight = minCanvasWidth / aspectRatio;
	            }
	          }
	        } else if (viewMode > 0) {
	          if (minCanvasWidth) {
	            minCanvasWidth = max(minCanvasWidth, cropped ? cropBoxData.width : 0);
	          } else if (minCanvasHeight) {
	            minCanvasHeight = max(minCanvasHeight, cropped ? cropBoxData.height : 0);
	          } else if (cropped) {
	            minCanvasWidth = cropBoxData.width;
	            minCanvasHeight = cropBoxData.height;

	            if (minCanvasHeight * aspectRatio > minCanvasWidth) {
	              minCanvasWidth = minCanvasHeight * aspectRatio;
	            } else {
	              minCanvasHeight = minCanvasWidth / aspectRatio;
	            }
	          }
	        }

	        if (minCanvasWidth && minCanvasHeight) {
	          if (minCanvasHeight * aspectRatio > minCanvasWidth) {
	            minCanvasHeight = minCanvasWidth / aspectRatio;
	          } else {
	            minCanvasWidth = minCanvasHeight * aspectRatio;
	          }
	        } else if (minCanvasWidth) {
	          minCanvasHeight = minCanvasWidth / aspectRatio;
	        } else if (minCanvasHeight) {
	          minCanvasWidth = minCanvasHeight * aspectRatio;
	        }

	        canvasData.minWidth = minCanvasWidth;
	        canvasData.minHeight = minCanvasHeight;
	        canvasData.maxWidth = Infinity;
	        canvasData.maxHeight = Infinity;
	      }

	      if (positionLimited) {
	        if (viewMode) {
	          newCanvasLeft = containerData.width - canvasData.width;
	          newCanvasTop = containerData.height - canvasData.height;

	          canvasData.minLeft = min(0, newCanvasLeft);
	          canvasData.minTop = min(0, newCanvasTop);
	          canvasData.maxLeft = max(0, newCanvasLeft);
	          canvasData.maxTop = max(0, newCanvasTop);

	          if (cropped && _this.limited) {
	            canvasData.minLeft = min(cropBoxData.left, cropBoxData.left + cropBoxData.width - canvasData.width);
	            canvasData.minTop = min(cropBoxData.top, cropBoxData.top + cropBoxData.height - canvasData.height);
	            canvasData.maxLeft = cropBoxData.left;
	            canvasData.maxTop = cropBoxData.top;

	            if (viewMode === 2) {
	              if (canvasData.width >= containerData.width) {
	                canvasData.minLeft = min(0, newCanvasLeft);
	                canvasData.maxLeft = max(0, newCanvasLeft);
	              }

	              if (canvasData.height >= containerData.height) {
	                canvasData.minTop = min(0, newCanvasTop);
	                canvasData.maxTop = max(0, newCanvasTop);
	              }
	            }
	          }
	        } else {
	          canvasData.minLeft = -canvasData.width;
	          canvasData.minTop = -canvasData.height;
	          canvasData.maxLeft = containerData.width;
	          canvasData.maxTop = containerData.height;
	        }
	      }
	    },

	    renderCanvas: function renderCanvas(changed) {
	      var _this = this;
	      var canvasData = _this.canvasData;
	      var imageData = _this.imageData;
	      var rotate = imageData.rotate;
	      var aspectRatio;
	      var rotatedData;

	      if (_this.rotated) {
	        _this.rotated = false;

	        // Computes rotated sizes with image sizes
	        rotatedData = getRotatedSizes({
	          width: imageData.width,
	          height: imageData.height,
	          degree: rotate
	        });

	        aspectRatio = rotatedData.width / rotatedData.height;

	        if (aspectRatio !== canvasData.aspectRatio) {
	          canvasData.left -= (rotatedData.width - canvasData.width) / 2;
	          canvasData.top -= (rotatedData.height - canvasData.height) / 2;
	          canvasData.width = rotatedData.width;
	          canvasData.height = rotatedData.height;
	          canvasData.aspectRatio = aspectRatio;
	          canvasData.naturalWidth = imageData.naturalWidth;
	          canvasData.naturalHeight = imageData.naturalHeight;

	          // Computes rotated sizes with natural image sizes
	          if (rotate % 180) {
	            rotatedData = getRotatedSizes({
	              width: imageData.naturalWidth,
	              height: imageData.naturalHeight,
	              degree: rotate
	            });

	            canvasData.naturalWidth = rotatedData.width;
	            canvasData.naturalHeight = rotatedData.height;
	          }

	          _this.limitCanvas(true, false);
	        }
	      }

	      if (canvasData.width > canvasData.maxWidth || canvasData.width < canvasData.minWidth) {
	        canvasData.left = canvasData.oldLeft;
	      }

	      if (canvasData.height > canvasData.maxHeight || canvasData.height < canvasData.minHeight) {
	        canvasData.top = canvasData.oldTop;
	      }

	      canvasData.width = min(max(canvasData.width, canvasData.minWidth), canvasData.maxWidth);
	      canvasData.height = min(max(canvasData.height, canvasData.minHeight), canvasData.maxHeight);

	      _this.limitCanvas(false, true);

	      canvasData.oldLeft = canvasData.left = min(max(canvasData.left, canvasData.minLeft), canvasData.maxLeft);
	      canvasData.oldTop = canvasData.top = min(max(canvasData.top, canvasData.minTop), canvasData.maxTop);

	      setStyle(_this.canvas, {
	        width: canvasData.width,
	        height: canvasData.height,
	        left: canvasData.left,
	        top: canvasData.top
	      });

	      _this.renderImage();

	      if (_this.cropped && _this.limited) {
	        _this.limitCropBox(true, true);
	      }

	      if (changed) {
	        _this.output();
	      }
	    },

	    renderImage: function renderImage(changed) {
	      var _this = this;
	      var canvasData = _this.canvasData;
	      var imageData = _this.imageData;
	      var newImageData;
	      var reversedData;
	      var reversedWidth;
	      var reversedHeight;
	      var transform;

	      if (imageData.rotate) {
	        reversedData = getRotatedSizes({
	          width: canvasData.width,
	          height: canvasData.height,
	          degree: imageData.rotate,
	          aspectRatio: imageData.aspectRatio
	        }, true);

	        reversedWidth = reversedData.width;
	        reversedHeight = reversedData.height;

	        newImageData = {
	          width: reversedWidth,
	          height: reversedHeight,
	          left: (canvasData.width - reversedWidth) / 2,
	          top: (canvasData.height - reversedHeight) / 2
	        };
	      }

	      extend(imageData, newImageData || {
	        width: canvasData.width,
	        height: canvasData.height,
	        left: 0,
	        top: 0
	      });

	      transform = getTransform(imageData);

	      setStyle(_this.image, {
	        width: imageData.width,
	        height: imageData.height,
	        marginLeft: imageData.left,
	        marginTop: imageData.top,
	        WebkitTransform: transform,
	        msTransform: transform,
	        transform: transform
	      });

	      if (changed) {
	        _this.output();
	      }
	    },

	    initCropBox: function initCropBox() {
	      var _this = this;
	      var options = _this.options;
	      var aspectRatio = options.aspectRatio;
	      var autoCropArea = Number(options.autoCropArea) || 0.8;
	      var canvasData = _this.canvasData;
	      var cropBoxData = {
	        width: canvasData.width,
	        height: canvasData.height
	      };

	      if (aspectRatio) {
	        if (canvasData.height * aspectRatio > canvasData.width) {
	          cropBoxData.height = cropBoxData.width / aspectRatio;
	        } else {
	          cropBoxData.width = cropBoxData.height * aspectRatio;
	        }
	      }

	      _this.cropBoxData = cropBoxData;
	      _this.limitCropBox(true, true);

	      // Initialize auto crop area
	      cropBoxData.width = min(max(cropBoxData.width, cropBoxData.minWidth), cropBoxData.maxWidth);
	      cropBoxData.height = min(max(cropBoxData.height, cropBoxData.minHeight), cropBoxData.maxHeight);

	      // The width/height of auto crop area must large than "minWidth/Height"
	      cropBoxData.width = max(cropBoxData.minWidth, cropBoxData.width * autoCropArea);
	      cropBoxData.height = max(cropBoxData.minHeight, cropBoxData.height * autoCropArea);
	      cropBoxData.oldLeft = cropBoxData.left = canvasData.left + (canvasData.width - cropBoxData.width) / 2;
	      cropBoxData.oldTop = cropBoxData.top = canvasData.top + (canvasData.height - cropBoxData.height) / 2;

	      _this.initialCropBoxData = extend({}, cropBoxData);
	    },

	    limitCropBox: function limitCropBox(sizeLimited, positionLimited) {
	      var _this = this;
	      var options = _this.options;
	      var aspectRatio = options.aspectRatio;
	      var containerData = _this.containerData;
	      var canvasData = _this.canvasData;
	      var cropBoxData = _this.cropBoxData;
	      var limited = _this.limited;
	      var minCropBoxWidth;
	      var minCropBoxHeight;
	      var maxCropBoxWidth;
	      var maxCropBoxHeight;

	      if (sizeLimited) {
	        minCropBoxWidth = Number(options.minCropBoxWidth) || 0;
	        minCropBoxHeight = Number(options.minCropBoxHeight) || 0;

	        // The min/maxCropBoxWidth/Height must be less than containerWidth/Height
	        minCropBoxWidth = min(minCropBoxWidth, containerData.width);
	        minCropBoxHeight = min(minCropBoxHeight, containerData.height);
	        maxCropBoxWidth = min(containerData.width, limited ? canvasData.width : containerData.width);
	        maxCropBoxHeight = min(containerData.height, limited ? canvasData.height : containerData.height);

	        if (aspectRatio) {
	          if (minCropBoxWidth && minCropBoxHeight) {
	            if (minCropBoxHeight * aspectRatio > minCropBoxWidth) {
	              minCropBoxHeight = minCropBoxWidth / aspectRatio;
	            } else {
	              minCropBoxWidth = minCropBoxHeight * aspectRatio;
	            }
	          } else if (minCropBoxWidth) {
	            minCropBoxHeight = minCropBoxWidth / aspectRatio;
	          } else if (minCropBoxHeight) {
	            minCropBoxWidth = minCropBoxHeight * aspectRatio;
	          }

	          if (maxCropBoxHeight * aspectRatio > maxCropBoxWidth) {
	            maxCropBoxHeight = maxCropBoxWidth / aspectRatio;
	          } else {
	            maxCropBoxWidth = maxCropBoxHeight * aspectRatio;
	          }
	        }

	        // The minWidth/Height must be less than maxWidth/Height
	        cropBoxData.minWidth = min(minCropBoxWidth, maxCropBoxWidth);
	        cropBoxData.minHeight = min(minCropBoxHeight, maxCropBoxHeight);
	        cropBoxData.maxWidth = maxCropBoxWidth;
	        cropBoxData.maxHeight = maxCropBoxHeight;
	      }

	      if (positionLimited) {
	        if (limited) {
	          cropBoxData.minLeft = max(0, canvasData.left);
	          cropBoxData.minTop = max(0, canvasData.top);
	          cropBoxData.maxLeft = min(containerData.width, canvasData.left + canvasData.width) - cropBoxData.width;
	          cropBoxData.maxTop = min(containerData.height, canvasData.top + canvasData.height) - cropBoxData.height;
	        } else {
	          cropBoxData.minLeft = 0;
	          cropBoxData.minTop = 0;
	          cropBoxData.maxLeft = containerData.width - cropBoxData.width;
	          cropBoxData.maxTop = containerData.height - cropBoxData.height;
	        }
	      }
	    },

	    renderCropBox: function renderCropBox() {
	      var _this = this;
	      var options = _this.options;
	      var containerData = _this.containerData;
	      var cropBoxData = _this.cropBoxData;

	      if (cropBoxData.width > cropBoxData.maxWidth || cropBoxData.width < cropBoxData.minWidth) {
	        cropBoxData.left = cropBoxData.oldLeft;
	      }

	      if (cropBoxData.height > cropBoxData.maxHeight || cropBoxData.height < cropBoxData.minHeight) {
	        cropBoxData.top = cropBoxData.oldTop;
	      }

	      cropBoxData.width = min(max(cropBoxData.width, cropBoxData.minWidth), cropBoxData.maxWidth);
	      cropBoxData.height = min(max(cropBoxData.height, cropBoxData.minHeight), cropBoxData.maxHeight);

	      _this.limitCropBox(false, true);

	      cropBoxData.oldLeft = cropBoxData.left = min(max(cropBoxData.left, cropBoxData.minLeft), cropBoxData.maxLeft);
	      cropBoxData.oldTop = cropBoxData.top = min(max(cropBoxData.top, cropBoxData.minTop), cropBoxData.maxTop);

	      if (options.movable && options.cropBoxMovable) {

	        // Turn to move the canvas when the crop box is equal to the container
	        setData(_this.face, DATA_ACTION, cropBoxData.width === containerData.width && cropBoxData.height === containerData.height ? ACTION_MOVE : ACTION_ALL);
	      }

	      setStyle(_this.cropBox, {
	        width: cropBoxData.width,
	        height: cropBoxData.height,
	        left: cropBoxData.left,
	        top: cropBoxData.top
	      });

	      if (_this.cropped && _this.limited) {
	        _this.limitCanvas(true, true);
	      }

	      if (!_this.disabled) {
	        _this.output();
	      }
	    },

	    output: function output() {
	      var _this = this;
	      var options = _this.options;

	      _this.preview();

	      if (_this.complete && isFunction(options.crop)) {
	        options.crop.call(_this.element, _this.getData());
	      }
	    },

	    initPreview: function initPreview() {
	      var _this = this;
	      var preview = _this.options.preview;
	      var image = createElement('img');
	      var crossOrigin = _this.crossOrigin;
	      var url = crossOrigin ? _this.crossOriginUrl : _this.url;
	      var previews;

	      if (crossOrigin) {
	        image.crossOrigin = crossOrigin;
	      }

	      image.src = url;
	      appendChild(_this.viewBox, image);

	      if (!preview) {
	        return;
	      }

	      _this.previews = previews = document.querySelectorAll(preview);

	      each(previews, function (element) {
	        var image = createElement('img');

	        // Save the original size for recover
	        setData(element, DATA_PREVIEW, {
	          width: element.offsetWidth,
	          height: element.offsetHeight,
	          html: element.innerHTML
	        });

	        if (crossOrigin) {
	          image.crossOrigin = crossOrigin;
	        }

	        image.src = url;

	        /**
	         * Override img element styles
	         * Add `display:block` to avoid margin top issue
	         * Add `height:auto` to override `height` attribute on IE8
	         * (Occur only when margin-top <= -height)
	         */

	        image.style.cssText = 'display:block;' + 'width:100%;' + 'height:auto;' + 'min-width:0!important;' + 'min-height:0!important;' + 'max-width:none!important;' + 'max-height:none!important;' + 'image-orientation:0deg!important;"';

	        empty(element);
	        appendChild(element, image);
	      });
	    },

	    resetPreview: function resetPreview() {
	      each(this.previews, function (element) {
	        var data = getData(element, DATA_PREVIEW);

	        setStyle(element, {
	          width: data.width,
	          height: data.height
	        });

	        element.innerHTML = data.html;
	        removeData(element, DATA_PREVIEW);
	      });
	    },

	    preview: function preview() {
	      var _this = this;
	      var imageData = _this.imageData;
	      var canvasData = _this.canvasData;
	      var cropBoxData = _this.cropBoxData;
	      var cropBoxWidth = cropBoxData.width;
	      var cropBoxHeight = cropBoxData.height;
	      var width = imageData.width;
	      var height = imageData.height;
	      var left = cropBoxData.left - canvasData.left - imageData.left;
	      var top = cropBoxData.top - canvasData.top - imageData.top;
	      var transform = getTransform(imageData);
	      var transforms = {
	        WebkitTransform: transform,
	        msTransform: transform,
	        transform: transform
	      };

	      if (!_this.cropped || _this.disabled) {
	        return;
	      }

	      setStyle(getByTag(_this.viewBox, 'img')[0], extend({
	        width: width,
	        height: height,
	        marginLeft: -left,
	        marginTop: -top
	      }, transforms));

	      each(_this.previews, function (element) {
	        var data = getData(element, DATA_PREVIEW);
	        var originalWidth = data.width;
	        var originalHeight = data.height;
	        var newWidth = originalWidth;
	        var newHeight = originalHeight;
	        var ratio = 1;

	        if (cropBoxWidth) {
	          ratio = originalWidth / cropBoxWidth;
	          newHeight = cropBoxHeight * ratio;
	        }

	        if (cropBoxHeight && newHeight > originalHeight) {
	          ratio = originalHeight / cropBoxHeight;
	          newWidth = cropBoxWidth * ratio;
	          newHeight = originalHeight;
	        }

	        setStyle(element, {
	          width: newWidth,
	          height: newHeight
	        });

	        setStyle(getByTag(element, 'img')[0], extend({
	          width: width * ratio,
	          height: height * ratio,
	          marginLeft: -left * ratio,
	          marginTop: -top * ratio
	        }, transforms));
	      });
	    },

	    bind: function bind() {
	      var _this = this;
	      var options = _this.options;
	      var cropper = _this.cropper;

	      addListener(cropper, EVENT_MOUSE_DOWN, _this._cropStart = proxy(_this.cropStart, _this));

	      if (options.zoomable && options.zoomOnWheel) {
	        addListener(cropper, EVENT_WHEEL, _this._wheel = proxy(_this.wheel, _this));
	      }

	      if (options.toggleDragModeOnDblclick) {
	        addListener(cropper, EVENT_DBLCLICK, _this._dblclick = proxy(_this.dblclick, _this));
	      }

	      addListener(document, EVENT_MOUSE_MOVE, _this._cropMove = proxy(_this.cropMove, _this));
	      addListener(document, EVENT_MOUSE_UP, _this._cropEnd = proxy(_this.cropEnd, _this));

	      if (options.responsive) {
	        addListener(window, EVENT_RESIZE, _this._resize = proxy(_this.resize, _this));
	      }
	    },

	    unbind: function unbind() {
	      var _this = this;
	      var options = _this.options;
	      var cropper = _this.cropper;

	      removeListener(cropper, EVENT_MOUSE_DOWN, _this._cropStart);

	      if (options.zoomable && options.zoomOnWheel) {
	        removeListener(cropper, EVENT_WHEEL, _this._wheel);
	      }

	      if (options.toggleDragModeOnDblclick) {
	        removeListener(cropper, EVENT_DBLCLICK, _this._dblclick);
	      }

	      removeListener(document, EVENT_MOUSE_MOVE, _this._cropMove);
	      removeListener(document, EVENT_MOUSE_UP, _this._cropEnd);

	      if (options.responsive) {
	        removeListener(window, EVENT_RESIZE, _this._resize);
	      }
	    },

	    resize: function resize() {
	      var _this = this;
	      var restore = _this.options.restore;
	      var container = _this.container;
	      var containerData = _this.containerData;
	      var canvasData;
	      var cropBoxData;
	      var ratio;

	      // Check `container` is necessary for IE8
	      if (_this.disabled || !containerData) {
	        return;
	      }

	      ratio = container.offsetWidth / containerData.width;

	      // Resize when width changed or height changed
	      if (ratio !== 1 || container.offsetHeight !== containerData.height) {
	        if (restore) {
	          canvasData = _this.getCanvasData();
	          cropBoxData = _this.getCropBoxData();
	        }

	        _this.render();

	        if (restore) {
	          _this.setCanvasData(each(canvasData, function (n, i) {
	            canvasData[i] = n * ratio;
	          }));
	          _this.setCropBoxData(each(cropBoxData, function (n, i) {
	            cropBoxData[i] = n * ratio;
	          }));
	        }
	      }
	    },

	    dblclick: function dblclick() {
	      var _this = this;

	      if (_this.disabled) {
	        return;
	      }

	      _this.setDragMode(hasClass(_this.dragBox, CLASS_CROP) ? ACTION_MOVE : ACTION_CROP);
	    },

	    wheel: function wheel(event) {
	      var _this = this;
	      var e = getEvent(event);
	      var ratio = Number(_this.options.wheelZoomRatio) || 0.1;
	      var delta = 1;

	      if (_this.disabled) {
	        return;
	      }

	      preventDefault(e);

	      // Limit wheel speed to prevent zoom too fast (#21)
	      if (_this.wheeling) {
	        return;
	      }

	      _this.wheeling = true;

	      setTimeout(function () {
	        _this.wheeling = false;
	      }, 50);

	      if (e.deltaY) {
	        delta = e.deltaY > 0 ? 1 : -1;
	      } else if (e.wheelDelta) {
	        delta = -e.wheelDelta / 120;
	      } else if (e.detail) {
	        delta = e.detail > 0 ? 1 : -1;
	      }

	      _this.zoom(-delta * ratio, e);
	    },

	    cropStart: function cropStart(event) {
	      var _this = this;
	      var options = _this.options;
	      var e = getEvent(event);
	      var touches = e.touches;
	      var touchesLength;
	      var touch;
	      var action;

	      if (_this.disabled) {
	        return;
	      }

	      if (touches) {
	        touchesLength = touches.length;

	        if (touchesLength > 1) {
	          if (options.zoomable && options.zoomOnTouch && touchesLength === 2) {
	            touch = touches[1];
	            _this.startX2 = touch.pageX;
	            _this.startY2 = touch.pageY;
	            action = ACTION_ZOOM;
	          } else {
	            return;
	          }
	        }

	        touch = touches[0];
	      }

	      action = action || getData(e.target, DATA_ACTION);

	      if (REGEXP_ACTIONS.test(action)) {
	        if (isFunction(options.cropstart) && options.cropstart.call(_this.element, {
	          originalEvent: e,
	          action: action
	        }) === false) {
	          return;
	        }

	        preventDefault(e);

	        _this.action = action;
	        _this.cropping = false;

	        _this.startX = touch ? touch.pageX : e.pageX;
	        _this.startY = touch ? touch.pageY : e.pageY;

	        if (action === ACTION_CROP) {
	          _this.cropping = true;
	          addClass(_this.dragBox, CLASS_MODAL);
	        }
	      }
	    },

	    cropMove: function cropMove(event) {
	      var _this = this;
	      var options = _this.options;
	      var e = getEvent(event);
	      var touches = e.touches;
	      var action = _this.action;
	      var touchesLength;
	      var touch;

	      if (_this.disabled) {
	        return;
	      }

	      if (touches) {
	        touchesLength = touches.length;

	        if (touchesLength > 1) {
	          if (options.zoomable && options.zoomOnTouch && touchesLength === 2) {
	            touch = touches[1];
	            _this.endX2 = touch.pageX;
	            _this.endY2 = touch.pageY;
	          } else {
	            return;
	          }
	        }

	        touch = touches[0];
	      }

	      if (action) {
	        if (isFunction(options.cropmove) && options.cropmove.call(_this.element, {
	          originalEvent: e,
	          action: action
	        }) === false) {
	          return;
	        }

	        preventDefault(e);

	        _this.endX = touch ? touch.pageX : e.pageX;
	        _this.endY = touch ? touch.pageY : e.pageY;

	        _this.change(e.shiftKey, action === ACTION_ZOOM ? e : null);
	      }
	    },

	    cropEnd: function cropEnd(event) {
	      var _this = this;
	      var options = _this.options;
	      var e = getEvent(event);
	      var action = _this.action;

	      if (_this.disabled) {
	        return;
	      }

	      if (action) {
	        preventDefault(e);

	        if (_this.cropping) {
	          _this.cropping = false;
	          toggleClass(_this.dragBox, CLASS_MODAL, _this.cropped && options.modal);
	        }

	        _this.action = '';

	        if (isFunction(options.cropend)) {
	          options.cropend.call(_this.element, {
	            originalEvent: e,
	            action: action
	          });
	        }
	      }
	    },

	    change: function change(shiftKey, originalEvent) {
	      var _this = this;
	      var options = _this.options;
	      var aspectRatio = options.aspectRatio;
	      var action = _this.action;
	      var containerData = _this.containerData;
	      var canvasData = _this.canvasData;
	      var cropBoxData = _this.cropBoxData;
	      var width = cropBoxData.width;
	      var height = cropBoxData.height;
	      var left = cropBoxData.left;
	      var top = cropBoxData.top;
	      var right = left + width;
	      var bottom = top + height;
	      var minLeft = 0;
	      var minTop = 0;
	      var maxWidth = containerData.width;
	      var maxHeight = containerData.height;
	      var renderable = true;
	      var offset;
	      var range;

	      // Locking aspect ratio in "free mode" by holding shift key
	      if (!aspectRatio && shiftKey) {
	        aspectRatio = width && height ? width / height : 1;
	      }

	      if (_this.limited) {
	        minLeft = cropBoxData.minLeft;
	        minTop = cropBoxData.minTop;
	        maxWidth = minLeft + min(containerData.width, canvasData.width);
	        maxHeight = minTop + min(containerData.height, canvasData.height);
	      }

	      range = {
	        x: _this.endX - _this.startX,
	        y: _this.endY - _this.startY
	      };

	      if (aspectRatio) {
	        range.X = range.y * aspectRatio;
	        range.Y = range.x / aspectRatio;
	      }

	      switch (action) {
	        // Move crop box
	        case ACTION_ALL:
	          left += range.x;
	          top += range.y;
	          break;

	        // Resize crop box
	        case ACTION_EAST:
	          if (range.x >= 0 && (right >= maxWidth || aspectRatio && (top <= minTop || bottom >= maxHeight))) {

	            renderable = false;
	            break;
	          }

	          width += range.x;

	          if (aspectRatio) {
	            height = width / aspectRatio;
	            top -= range.Y / 2;
	          }

	          if (width < 0) {
	            action = ACTION_WEST;
	            width = 0;
	          }

	          break;

	        case ACTION_NORTH:
	          if (range.y <= 0 && (top <= minTop || aspectRatio && (left <= minLeft || right >= maxWidth))) {

	            renderable = false;
	            break;
	          }

	          height -= range.y;
	          top += range.y;

	          if (aspectRatio) {
	            width = height * aspectRatio;
	            left += range.X / 2;
	          }

	          if (height < 0) {
	            action = ACTION_SOUTH;
	            height = 0;
	          }

	          break;

	        case ACTION_WEST:
	          if (range.x <= 0 && (left <= minLeft || aspectRatio && (top <= minTop || bottom >= maxHeight))) {

	            renderable = false;
	            break;
	          }

	          width -= range.x;
	          left += range.x;

	          if (aspectRatio) {
	            height = width / aspectRatio;
	            top += range.Y / 2;
	          }

	          if (width < 0) {
	            action = ACTION_EAST;
	            width = 0;
	          }

	          break;

	        case ACTION_SOUTH:
	          if (range.y >= 0 && (bottom >= maxHeight || aspectRatio && (left <= minLeft || right >= maxWidth))) {

	            renderable = false;
	            break;
	          }

	          height += range.y;

	          if (aspectRatio) {
	            width = height * aspectRatio;
	            left -= range.X / 2;
	          }

	          if (height < 0) {
	            action = ACTION_NORTH;
	            height = 0;
	          }

	          break;

	        case ACTION_NORTH_EAST:
	          if (aspectRatio) {
	            if (range.y <= 0 && (top <= minTop || right >= maxWidth)) {
	              renderable = false;
	              break;
	            }

	            height -= range.y;
	            top += range.y;
	            width = height * aspectRatio;
	          } else {
	            if (range.x >= 0) {
	              if (right < maxWidth) {
	                width += range.x;
	              } else if (range.y <= 0 && top <= minTop) {
	                renderable = false;
	              }
	            } else {
	              width += range.x;
	            }

	            if (range.y <= 0) {
	              if (top > minTop) {
	                height -= range.y;
	                top += range.y;
	              }
	            } else {
	              height -= range.y;
	              top += range.y;
	            }
	          }

	          if (width < 0 && height < 0) {
	            action = ACTION_SOUTH_WEST;
	            height = 0;
	            width = 0;
	          } else if (width < 0) {
	            action = ACTION_NORTH_WEST;
	            width = 0;
	          } else if (height < 0) {
	            action = ACTION_SOUTH_EAST;
	            height = 0;
	          }

	          break;

	        case ACTION_NORTH_WEST:
	          if (aspectRatio) {
	            if (range.y <= 0 && (top <= minTop || left <= minLeft)) {
	              renderable = false;
	              break;
	            }

	            height -= range.y;
	            top += range.y;
	            width = height * aspectRatio;
	            left += range.X;
	          } else {
	            if (range.x <= 0) {
	              if (left > minLeft) {
	                width -= range.x;
	                left += range.x;
	              } else if (range.y <= 0 && top <= minTop) {
	                renderable = false;
	              }
	            } else {
	              width -= range.x;
	              left += range.x;
	            }

	            if (range.y <= 0) {
	              if (top > minTop) {
	                height -= range.y;
	                top += range.y;
	              }
	            } else {
	              height -= range.y;
	              top += range.y;
	            }
	          }

	          if (width < 0 && height < 0) {
	            action = ACTION_SOUTH_EAST;
	            height = 0;
	            width = 0;
	          } else if (width < 0) {
	            action = ACTION_NORTH_EAST;
	            width = 0;
	          } else if (height < 0) {
	            action = ACTION_SOUTH_WEST;
	            height = 0;
	          }

	          break;

	        case ACTION_SOUTH_WEST:
	          if (aspectRatio) {
	            if (range.x <= 0 && (left <= minLeft || bottom >= maxHeight)) {
	              renderable = false;
	              break;
	            }

	            width -= range.x;
	            left += range.x;
	            height = width / aspectRatio;
	          } else {
	            if (range.x <= 0) {
	              if (left > minLeft) {
	                width -= range.x;
	                left += range.x;
	              } else if (range.y >= 0 && bottom >= maxHeight) {
	                renderable = false;
	              }
	            } else {
	              width -= range.x;
	              left += range.x;
	            }

	            if (range.y >= 0) {
	              if (bottom < maxHeight) {
	                height += range.y;
	              }
	            } else {
	              height += range.y;
	            }
	          }

	          if (width < 0 && height < 0) {
	            action = ACTION_NORTH_EAST;
	            height = 0;
	            width = 0;
	          } else if (width < 0) {
	            action = ACTION_SOUTH_EAST;
	            width = 0;
	          } else if (height < 0) {
	            action = ACTION_NORTH_WEST;
	            height = 0;
	          }

	          break;

	        case ACTION_SOUTH_EAST:
	          if (aspectRatio) {
	            if (range.x >= 0 && (right >= maxWidth || bottom >= maxHeight)) {
	              renderable = false;
	              break;
	            }

	            width += range.x;
	            height = width / aspectRatio;
	          } else {
	            if (range.x >= 0) {
	              if (right < maxWidth) {
	                width += range.x;
	              } else if (range.y >= 0 && bottom >= maxHeight) {
	                renderable = false;
	              }
	            } else {
	              width += range.x;
	            }

	            if (range.y >= 0) {
	              if (bottom < maxHeight) {
	                height += range.y;
	              }
	            } else {
	              height += range.y;
	            }
	          }

	          if (width < 0 && height < 0) {
	            action = ACTION_NORTH_WEST;
	            height = 0;
	            width = 0;
	          } else if (width < 0) {
	            action = ACTION_SOUTH_WEST;
	            width = 0;
	          } else if (height < 0) {
	            action = ACTION_NORTH_EAST;
	            height = 0;
	          }

	          break;

	        // Move canvas
	        case ACTION_MOVE:
	          _this.move(range.x, range.y);
	          renderable = false;
	          break;

	        // Zoom canvas
	        case ACTION_ZOOM:
	          _this.zoom(function (x1, y1, x2, y2) {
	            var z1 = sqrt(x1 * x1 + y1 * y1);
	            var z2 = sqrt(x2 * x2 + y2 * y2);

	            return (z2 - z1) / z1;
	          }(abs(_this.startX - _this.startX2), abs(_this.startY - _this.startY2), abs(_this.endX - _this.endX2), abs(_this.endY - _this.endY2)), originalEvent);
	          _this.startX2 = _this.endX2;
	          _this.startY2 = _this.endY2;
	          renderable = false;
	          break;

	        // Create crop box
	        case ACTION_CROP:
	          if (!range.x || !range.y) {
	            renderable = false;
	            break;
	          }

	          offset = getOffset(_this.cropper);
	          left = _this.startX - offset.left;
	          top = _this.startY - offset.top;
	          width = cropBoxData.minWidth;
	          height = cropBoxData.minHeight;

	          if (range.x > 0) {
	            action = range.y > 0 ? ACTION_SOUTH_EAST : ACTION_NORTH_EAST;
	          } else if (range.x < 0) {
	            left -= width;
	            action = range.y > 0 ? ACTION_SOUTH_WEST : ACTION_NORTH_WEST;
	          }

	          if (range.y < 0) {
	            top -= height;
	          }

	          // Show the crop box if is hidden
	          if (!_this.cropped) {
	            removeClass(_this.cropBox, CLASS_HIDDEN);
	            _this.cropped = true;

	            if (_this.limited) {
	              _this.limitCropBox(true, true);
	            }
	          }

	          break;

	        // No default
	      }

	      if (renderable) {
	        cropBoxData.width = width;
	        cropBoxData.height = height;
	        cropBoxData.left = left;
	        cropBoxData.top = top;
	        _this.action = action;

	        _this.renderCropBox();
	      }

	      // Override
	      _this.startX = _this.endX;
	      _this.startY = _this.endY;
	    },

	    // Show the crop box manually
	    crop: function crop() {
	      var _this = this;

	      if (_this.built && !_this.disabled) {
	        if (!_this.cropped) {
	          _this.cropped = true;
	          _this.limitCropBox(true, true);

	          if (_this.options.modal) {
	            addClass(_this.dragBox, CLASS_MODAL);
	          }

	          removeClass(_this.cropBox, CLASS_HIDDEN);
	        }

	        _this.setCropBoxData(_this.initialCropBoxData);
	      }

	      return _this;
	    },

	    // Reset the image and crop box to their initial states
	    reset: function reset() {
	      var _this = this;

	      if (_this.built && !_this.disabled) {
	        _this.imageData = extend({}, _this.initialImageData);
	        _this.canvasData = extend({}, _this.initialCanvasData);
	        _this.cropBoxData = extend({}, _this.initialCropBoxData);

	        _this.renderCanvas();

	        if (_this.cropped) {
	          _this.renderCropBox();
	        }
	      }

	      return _this;
	    },

	    // Clear the crop box
	    clear: function clear() {
	      var _this = this;

	      if (_this.cropped && !_this.disabled) {
	        extend(_this.cropBoxData, {
	          left: 0,
	          top: 0,
	          width: 0,
	          height: 0
	        });

	        _this.cropped = false;
	        _this.renderCropBox();

	        _this.limitCanvas();

	        // Render canvas after crop box rendered
	        _this.renderCanvas();

	        removeClass(_this.dragBox, CLASS_MODAL);
	        addClass(_this.cropBox, CLASS_HIDDEN);
	      }

	      return _this;
	    },

	    /**
	     * Replace the image's src and rebuild the cropper
	     *
	     * @param {String} url
	     */
	    replace: function replace(url) {
	      var _this = this;

	      if (!_this.disabled && url) {
	        if (_this.isImg) {
	          _this.replaced = true;
	          _this.element.src = url;
	        }

	        // Clear previous data
	        _this.options.data = null;
	        _this.load(url);
	      }

	      return _this;
	    },

	    // Enable (unfreeze) the cropper
	    enable: function enable() {
	      var _this = this;

	      if (_this.built) {
	        _this.disabled = false;
	        removeClass(_this.cropper, CLASS_DISABLED);
	      }

	      return _this;
	    },

	    // Disable (freeze) the cropper
	    disable: function disable() {
	      var _this = this;

	      if (_this.built) {
	        _this.disabled = true;
	        addClass(_this.cropper, CLASS_DISABLED);
	      }

	      return _this;
	    },

	    // Destroy the cropper and remove the instance from the image
	    destroy: function destroy() {
	      var _this = this;
	      var element = _this.element;
	      var image = _this.image;

	      if (_this.ready) {
	        if (_this.isImg && _this.replaced) {
	          element.src = _this.originalUrl;
	        }

	        _this.unbuild();
	        removeClass(element, CLASS_HIDDEN);
	      } else {
	        if (_this.isImg) {
	          removeListener(element, EVENT_LOAD, _this.start);
	        } else if (image) {
	          removeChild(image);
	        }
	      }

	      removeData(element, NAMESPACE);

	      return _this;
	    },

	    /**
	     * Move the canvas with relative offsets
	     *
	     * @param {Number} offsetX
	     * @param {Number} offsetY (optional)
	     */
	    move: function move(offsetX, offsetY) {
	      var _this = this;
	      var canvasData = _this.canvasData;

	      return _this.moveTo(isUndefined(offsetX) ? offsetX : canvasData.left + Number(offsetX), isUndefined(offsetY) ? offsetY : canvasData.top + Number(offsetY));
	    },

	    /**
	     * Move the canvas to an absolute point
	     *
	     * @param {Number} x
	     * @param {Number} y (optional)
	     */
	    moveTo: function moveTo(x, y) {
	      var _this = this;
	      var canvasData = _this.canvasData;
	      var changed = false;

	      // If "y" is not present, its default value is "x"
	      if (isUndefined(y)) {
	        y = x;
	      }

	      x = Number(x);
	      y = Number(y);

	      if (_this.built && !_this.disabled && _this.options.movable) {
	        if (isNumber(x)) {
	          canvasData.left = x;
	          changed = true;
	        }

	        if (isNumber(y)) {
	          canvasData.top = y;
	          changed = true;
	        }

	        if (changed) {
	          _this.renderCanvas(true);
	        }
	      }

	      return _this;
	    },

	    /**
	     * Zoom the canvas with a relative ratio
	     *
	     * @param {Number} ratio
	     * @param {Event} _originalEvent (private)
	     */
	    zoom: function zoom(ratio, _originalEvent) {
	      var _this = this;
	      var canvasData = _this.canvasData;

	      ratio = Number(ratio);

	      if (ratio < 0) {
	        ratio = 1 / (1 - ratio);
	      } else {
	        ratio = 1 + ratio;
	      }

	      return _this.zoomTo(canvasData.width * ratio / canvasData.naturalWidth, _originalEvent);
	    },

	    /**
	     * Zoom the canvas to an absolute ratio
	     *
	     * @param {Number} ratio
	     * @param {Event} _originalEvent (private)
	     */
	    zoomTo: function zoomTo(ratio, _originalEvent) {
	      var _this = this;
	      var options = _this.options;
	      var canvasData = _this.canvasData;
	      var width = canvasData.width;
	      var height = canvasData.height;
	      var naturalWidth = canvasData.naturalWidth;
	      var naturalHeight = canvasData.naturalHeight;
	      var newWidth;
	      var newHeight;
	      var offset;
	      var center;

	      ratio = Number(ratio);

	      if (ratio >= 0 && _this.built && !_this.disabled && options.zoomable) {
	        newWidth = naturalWidth * ratio;
	        newHeight = naturalHeight * ratio;

	        if (isFunction(options.zoom) && options.zoom.call(_this.element, {
	          originalEvent: _originalEvent,
	          oldRatio: width / naturalWidth,
	          ratio: newWidth / naturalWidth
	        }) === false) {
	          return _this;
	        }

	        if (_originalEvent) {
	          offset = getOffset(_this.cropper);
	          center = _originalEvent.touches ? getTouchesCenter(_originalEvent.touches) : {
	            pageX: _originalEvent.pageX,
	            pageY: _originalEvent.pageY
	          };

	          // Zoom from the triggering point of the event
	          canvasData.left -= (newWidth - width) * ((center.pageX - offset.left - canvasData.left) / width);
	          canvasData.top -= (newHeight - height) * ((center.pageY - offset.top - canvasData.top) / height);
	        } else {

	          // Zoom from the center of the canvas
	          canvasData.left -= (newWidth - width) / 2;
	          canvasData.top -= (newHeight - height) / 2;
	        }

	        canvasData.width = newWidth;
	        canvasData.height = newHeight;
	        _this.renderCanvas(true);
	      }

	      return _this;
	    },

	    /**
	     * Rotate the canvas with a relative degree
	     *
	     * @param {Number} degree
	     */
	    rotate: function rotate(degree) {
	      var _this = this;

	      return _this.rotateTo((_this.imageData.rotate || 0) + Number(degree));
	    },

	    /**
	     * Rotate the canvas to an absolute degree
	     * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function#rotate()
	     *
	     * @param {Number} degree
	     */
	    rotateTo: function rotateTo(degree) {
	      var _this = this;

	      degree = Number(degree);

	      if (isNumber(degree) && _this.built && !_this.disabled && _this.options.rotatable) {
	        _this.imageData.rotate = degree % 360;
	        _this.rotated = true;
	        _this.renderCanvas(true);
	      }

	      return _this;
	    },

	    /**
	     * Scale the image
	     * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function#scale()
	     *
	     * @param {Number} scaleX
	     * @param {Number} scaleY (optional)
	     */
	    scale: function scale(scaleX, scaleY) {
	      var _this = this;
	      var imageData = _this.imageData;
	      var changed = false;

	      // If "scaleY" is not present, its default value is "scaleX"
	      if (isUndefined(scaleY)) {
	        scaleY = scaleX;
	      }

	      scaleX = Number(scaleX);
	      scaleY = Number(scaleY);

	      if (_this.built && !_this.disabled && _this.options.scalable) {
	        if (isNumber(scaleX)) {
	          imageData.scaleX = scaleX;
	          changed = true;
	        }

	        if (isNumber(scaleY)) {
	          imageData.scaleY = scaleY;
	          changed = true;
	        }

	        if (changed) {
	          _this.renderImage(true);
	        }
	      }

	      return _this;
	    },

	    /**
	     * Scale the abscissa of the image
	     *
	     * @param {Number} scaleX
	     */
	    scaleX: function scaleX(_scaleX) {
	      var _this = this;
	      var scaleY = _this.imageData.scaleY;

	      return _this.scale(_scaleX, isNumber(scaleY) ? scaleY : 1);
	    },

	    /**
	     * Scale the ordinate of the image
	     *
	     * @param {Number} scaleY
	     */
	    scaleY: function scaleY(_scaleY) {
	      var _this = this;
	      var scaleX = _this.imageData.scaleX;

	      return _this.scale(isNumber(scaleX) ? scaleX : 1, _scaleY);
	    },

	    /**
	     * Get the cropped area position and size data (base on the original image)
	     *
	     * @param {Boolean} rounded (optional)
	     * @return {Object} data
	     */
	    getData: function getData(rounded) {
	      var _this = this;
	      var options = _this.options;
	      var imageData = _this.imageData;
	      var canvasData = _this.canvasData;
	      var cropBoxData = _this.cropBoxData;
	      var ratio;
	      var data;

	      if (_this.built && _this.cropped) {
	        data = {
	          x: cropBoxData.left - canvasData.left,
	          y: cropBoxData.top - canvasData.top,
	          width: cropBoxData.width,
	          height: cropBoxData.height
	        };

	        ratio = imageData.width / imageData.naturalWidth;

	        each(data, function (n, i) {
	          n = n / ratio;
	          data[i] = rounded ? round(n) : n;
	        });
	      } else {
	        data = {
	          x: 0,
	          y: 0,
	          width: 0,
	          height: 0
	        };
	      }

	      if (options.rotatable) {
	        data.rotate = imageData.rotate || 0;
	      }

	      if (options.scalable) {
	        data.scaleX = imageData.scaleX || 1;
	        data.scaleY = imageData.scaleY || 1;
	      }

	      return data;
	    },

	    /**
	     * Set the cropped area position and size with new data
	     *
	     * @param {Object} data
	     */
	    setData: function setData(data) {
	      var _this = this;
	      var options = _this.options;
	      var imageData = _this.imageData;
	      var canvasData = _this.canvasData;
	      var cropBoxData = {};
	      var rotated;
	      var scaled;
	      var ratio;

	      if (isFunction(data)) {
	        data = data.call(_this.element);
	      }

	      if (_this.built && !_this.disabled && isPlainObject(data)) {
	        if (options.rotatable) {
	          if (isNumber(data.rotate) && data.rotate !== imageData.rotate) {
	            imageData.rotate = data.rotate;
	            _this.rotated = rotated = true;
	          }
	        }

	        if (options.scalable) {
	          if (isNumber(data.scaleX) && data.scaleX !== imageData.scaleX) {
	            imageData.scaleX = data.scaleX;
	            scaled = true;
	          }

	          if (isNumber(data.scaleY) && data.scaleY !== imageData.scaleY) {
	            imageData.scaleY = data.scaleY;
	            scaled = true;
	          }
	        }

	        if (rotated) {
	          _this.renderCanvas();
	        } else if (scaled) {
	          _this.renderImage();
	        }

	        ratio = imageData.width / imageData.naturalWidth;

	        if (isNumber(data.x)) {
	          cropBoxData.left = data.x * ratio + canvasData.left;
	        }

	        if (isNumber(data.y)) {
	          cropBoxData.top = data.y * ratio + canvasData.top;
	        }

	        if (isNumber(data.width)) {
	          cropBoxData.width = data.width * ratio;
	        }

	        if (isNumber(data.height)) {
	          cropBoxData.height = data.height * ratio;
	        }

	        _this.setCropBoxData(cropBoxData);
	      }

	      return _this;
	    },

	    /**
	     * Get the container size data
	     *
	     * @return {Object} data
	     */
	    getContainerData: function getContainerData() {
	      var _this = this;

	      return _this.built ? _this.containerData : {};
	    },

	    /**
	     * Get the image position and size data
	     *
	     * @return {Object} data
	     */
	    getImageData: function getImageData() {
	      var _this = this;

	      return _this.ready ? _this.imageData : {};
	    },

	    /**
	     * Get the canvas position and size data
	     *
	     * @return {Object} data
	     */
	    getCanvasData: function getCanvasData() {
	      var _this = this;
	      var canvasData = _this.canvasData;
	      var data = {};

	      if (_this.built) {
	        each(['left', 'top', 'width', 'height', 'naturalWidth', 'naturalHeight'], function (n) {
	          data[n] = canvasData[n];
	        });
	      }

	      return data;
	    },

	    /**
	     * Set the canvas position and size with new data
	     *
	     * @param {Object} data
	     */
	    setCanvasData: function setCanvasData(data) {
	      var _this = this;
	      var canvasData = _this.canvasData;
	      var aspectRatio = canvasData.aspectRatio;

	      if (isFunction(data)) {
	        data = data.call(_this.element);
	      }

	      if (_this.built && !_this.disabled && isPlainObject(data)) {
	        if (isNumber(data.left)) {
	          canvasData.left = data.left;
	        }

	        if (isNumber(data.top)) {
	          canvasData.top = data.top;
	        }

	        if (isNumber(data.width)) {
	          canvasData.width = data.width;
	          canvasData.height = data.width / aspectRatio;
	        } else if (isNumber(data.height)) {
	          canvasData.height = data.height;
	          canvasData.width = data.height * aspectRatio;
	        }

	        _this.renderCanvas(true);
	      }

	      return _this;
	    },

	    /**
	     * Get the crop box position and size data
	     *
	     * @return {Object} data
	     */
	    getCropBoxData: function getCropBoxData() {
	      var _this = this;
	      var cropBoxData = _this.cropBoxData;
	      var data;

	      if (_this.built && _this.cropped) {
	        data = {
	          left: cropBoxData.left,
	          top: cropBoxData.top,
	          width: cropBoxData.width,
	          height: cropBoxData.height
	        };
	      }

	      return data || {};
	    },

	    /**
	     * Set the crop box position and size with new data
	     *
	     * @param {Object} data
	     */
	    setCropBoxData: function setCropBoxData(data) {
	      var _this = this;
	      var cropBoxData = _this.cropBoxData;
	      var aspectRatio = _this.options.aspectRatio;
	      var widthChanged;
	      var heightChanged;

	      if (isFunction(data)) {
	        data = data.call(_this.element);
	      }

	      if (_this.built && _this.cropped && !_this.disabled && isPlainObject(data)) {

	        if (isNumber(data.left)) {
	          cropBoxData.left = data.left;
	        }

	        if (isNumber(data.top)) {
	          cropBoxData.top = data.top;
	        }

	        if (isNumber(data.width)) {
	          widthChanged = true;
	          cropBoxData.width = data.width;
	        }

	        if (isNumber(data.height)) {
	          heightChanged = true;
	          cropBoxData.height = data.height;
	        }

	        if (aspectRatio) {
	          if (widthChanged) {
	            cropBoxData.height = cropBoxData.width / aspectRatio;
	          } else if (heightChanged) {
	            cropBoxData.width = cropBoxData.height * aspectRatio;
	          }
	        }

	        _this.renderCropBox();
	      }

	      return _this;
	    },

	    /**
	     * Get a canvas drawn the cropped image
	     *
	     * @param {Object} options (optional)
	     * @return {HTMLCanvasElement} canvas
	     */
	    getCroppedCanvas: function getCroppedCanvas(options) {
	      var _this = this;
	      var originalWidth;
	      var originalHeight;
	      var canvasWidth;
	      var canvasHeight;
	      var scaledWidth;
	      var scaledHeight;
	      var scaledRatio;
	      var aspectRatio;
	      var canvas;
	      var context;
	      var data;

	      if (!_this.built || !_this.cropped || !SUPPORT_CANVAS) {
	        return;
	      }

	      if (!isPlainObject(options)) {
	        options = {};
	      }

	      data = _this.getData();
	      originalWidth = data.width;
	      originalHeight = data.height;
	      aspectRatio = originalWidth / originalHeight;

	      if (isPlainObject(options)) {
	        scaledWidth = options.width;
	        scaledHeight = options.height;

	        if (scaledWidth) {
	          scaledHeight = scaledWidth / aspectRatio;
	          scaledRatio = scaledWidth / originalWidth;
	        } else if (scaledHeight) {
	          scaledWidth = scaledHeight * aspectRatio;
	          scaledRatio = scaledHeight / originalHeight;
	        }
	      }

	      // The canvas element will use `Math.floor` on a float number, so floor first
	      canvasWidth = floor(scaledWidth || originalWidth);
	      canvasHeight = floor(scaledHeight || originalHeight);

	      canvas = createElement('canvas');
	      canvas.width = canvasWidth;
	      canvas.height = canvasHeight;
	      context = canvas.getContext('2d');

	      if (options.fillColor) {
	        context.fillStyle = options.fillColor;
	        context.fillRect(0, 0, canvasWidth, canvasHeight);
	      }

	      // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.drawImage
	      context.drawImage.apply(context, function () {
	        var source = getSourceCanvas(_this.image, _this.imageData);
	        var sourceWidth = source.width;
	        var sourceHeight = source.height;
	        var args = [source];

	        // Source canvas
	        var srcX = data.x;
	        var srcY = data.y;
	        var srcWidth;
	        var srcHeight;

	        // Destination canvas
	        var dstX;
	        var dstY;
	        var dstWidth;
	        var dstHeight;

	        if (srcX <= -originalWidth || srcX > sourceWidth) {
	          srcX = srcWidth = dstX = dstWidth = 0;
	        } else if (srcX <= 0) {
	          dstX = -srcX;
	          srcX = 0;
	          srcWidth = dstWidth = min(sourceWidth, originalWidth + srcX);
	        } else if (srcX <= sourceWidth) {
	          dstX = 0;
	          srcWidth = dstWidth = min(originalWidth, sourceWidth - srcX);
	        }

	        if (srcWidth <= 0 || srcY <= -originalHeight || srcY > sourceHeight) {
	          srcY = srcHeight = dstY = dstHeight = 0;
	        } else if (srcY <= 0) {
	          dstY = -srcY;
	          srcY = 0;
	          srcHeight = dstHeight = min(sourceHeight, originalHeight + srcY);
	        } else if (srcY <= sourceHeight) {
	          dstY = 0;
	          srcHeight = dstHeight = min(originalHeight, sourceHeight - srcY);
	        }

	        args.push(floor(srcX), floor(srcY), floor(srcWidth), floor(srcHeight));

	        // Scale destination sizes
	        if (scaledRatio) {
	          dstX *= scaledRatio;
	          dstY *= scaledRatio;
	          dstWidth *= scaledRatio;
	          dstHeight *= scaledRatio;
	        }

	        // Avoid "IndexSizeError" in IE and Firefox
	        if (dstWidth > 0 && dstHeight > 0) {
	          args.push(floor(dstX), floor(dstY), floor(dstWidth), floor(dstHeight));
	        }

	        return args;
	      }.call(_this));

	      return canvas;
	    },

	    /**
	     * Change the aspect ratio of the crop box
	     *
	     * @param {Number} aspectRatio
	     */
	    setAspectRatio: function setAspectRatio(aspectRatio) {
	      var _this = this;
	      var options = _this.options;

	      if (!_this.disabled && !isUndefined(aspectRatio)) {

	        // 0 -> NaN
	        options.aspectRatio = max(0, aspectRatio) || NaN;

	        if (_this.built) {
	          _this.initCropBox();

	          if (_this.cropped) {
	            _this.renderCropBox();
	          }
	        }
	      }

	      return _this;
	    },

	    /**
	     * Change the drag mode
	     *
	     * @param {String} mode (optional)
	     */
	    setDragMode: function setDragMode(mode) {
	      var _this = this;
	      var options = _this.options;
	      var dragBox = _this.dragBox;
	      var face = _this.face;
	      var croppable;
	      var movable;

	      if (_this.ready && !_this.disabled) {
	        croppable = mode === ACTION_CROP;
	        movable = options.movable && mode === ACTION_MOVE;
	        mode = croppable || movable ? mode : ACTION_NONE;

	        setData(dragBox, DATA_ACTION, mode);
	        toggleClass(dragBox, CLASS_CROP, croppable);
	        toggleClass(dragBox, CLASS_MOVE, movable);

	        if (!options.cropBoxMovable) {

	          // Sync drag mode to crop box when it is not movable
	          setData(face, DATA_ACTION, mode);
	          toggleClass(face, CLASS_CROP, croppable);
	          toggleClass(face, CLASS_MOVE, movable);
	        }
	      }

	      return _this;
	    }
	  };

	  Cropper.DEFAULTS = {

	    // Define the view mode of the cropper
	    viewMode: 0, // 0, 1, 2, 3

	    // Define the dragging mode of the cropper
	    dragMode: 'crop', // 'crop', 'move' or 'none'

	    // Define the aspect ratio of the crop box
	    aspectRatio: NaN,

	    // An object with the previous cropping result data
	    data: null,

	    // A selector for adding extra containers to preview
	    preview: '',

	    // Re-render the cropper when resize the window
	    responsive: true,

	    // Restore the cropped area after resize the window
	    restore: true,

	    // Check if the current image is a cross-origin image
	    checkCrossOrigin: true,

	    // Check the current image's Exif Orientation information
	    checkOrientation: true,

	    // Show the black modal
	    modal: true,

	    // Show the dashed lines for guiding
	    guides: true,

	    // Show the center indicator for guiding
	    center: true,

	    // Show the white modal to highlight the crop box
	    highlight: true,

	    // Show the grid background
	    background: true,

	    // Enable to crop the image automatically when initialize
	    autoCrop: true,

	    // Define the percentage of automatic cropping area when initializes
	    autoCropArea: 0.8,

	    // Enable to move the image
	    movable: true,

	    // Enable to rotate the image
	    rotatable: true,

	    // Enable to scale the image
	    scalable: true,

	    // Enable to zoom the image
	    zoomable: true,

	    // Enable to zoom the image by dragging touch
	    zoomOnTouch: true,

	    // Enable to zoom the image by wheeling mouse
	    zoomOnWheel: true,

	    // Define zoom ratio when zoom the image by wheeling mouse
	    wheelZoomRatio: 0.1,

	    // Enable to move the crop box
	    cropBoxMovable: true,

	    // Enable to resize the crop box
	    cropBoxResizable: true,

	    // Toggle drag mode between "crop" and "move" when click twice on the cropper
	    toggleDragModeOnDblclick: true,

	    // Size limitation
	    minCanvasWidth: 0,
	    minCanvasHeight: 0,
	    minCropBoxWidth: 0,
	    minCropBoxHeight: 0,
	    minContainerWidth: 200,
	    minContainerHeight: 100,

	    // Shortcuts of events
	    build: null,
	    built: null,
	    cropstart: null,
	    cropmove: null,
	    cropend: null,
	    crop: null,
	    zoom: null
	  };

	  Cropper.TEMPLATE = function (source, words) {
	    words = words.split(',');

	    return source.replace(/\d+/g, function (i) {
	      return words[i];
	    });
	  }('<0 6="5-container"><0 6="5-wrap-9"><0 6="5-canvas"></0></0><0 6="5-drag-9"></0><0 6="5-crop-9"><1 6="5-view-9"></1><1 6="5-8 8-h"></1><1 6="5-8 8-v"></1><1 6="5-center"></1><1 6="5-face"></1><1 6="5-7 7-e" 3-2="e"></1><1 6="5-7 7-n" 3-2="n"></1><1 6="5-7 7-w" 3-2="w"></1><1 6="5-7 7-s" 3-2="s"></1><1 6="5-4 4-e" 3-2="e"></1><1 6="5-4 4-n" 3-2="n"></1><1 6="5-4 4-w" 3-2="w"></1><1 6="5-4 4-s" 3-2="s"></1><1 6="5-4 4-ne" 3-2="ne"></1><1 6="5-4 4-nw" 3-2="nw"></1><1 6="5-4 4-sw" 3-2="sw"></1><1 6="5-4 4-se" 3-2="se"></1></0></0>', 'div,span,action,data,point,cropper,class,line,dashed,box');

	  /*Cropper.TEMPLATE = (
	    '<div class="cropper-container">' +
	      '<div class="cropper-wrap-box">' +
	        '<div class="cropper-canvas"></div>' +
	      '</div>' +
	      '<div class="cropper-drag-box"></div>' +
	      '<div class="cropper-crop-box">' +
	        '<span class="cropper-view-box"></span>' +
	        '<span class="cropper-dashed dashed-h"></span>' +
	        '<span class="cropper-dashed dashed-v"></span>' +
	        '<span class="cropper-center"></span>' +
	        '<span class="cropper-face"></span>' +
	        '<span class="cropper-line line-e" data-action="e"></span>' +
	        '<span class="cropper-line line-n" data-action="n"></span>' +
	        '<span class="cropper-line line-w" data-action="w"></span>' +
	        '<span class="cropper-line line-s" data-action="s"></span>' +
	        '<span class="cropper-point point-e" data-action="e"></span>' +
	        '<span class="cropper-point point-n" data-action="n"></span>' +
	        '<span class="cropper-point point-w" data-action="w"></span>' +
	        '<span class="cropper-point point-s" data-action="s"></span>' +
	        '<span class="cropper-point point-ne" data-action="ne"></span>' +
	        '<span class="cropper-point point-nw" data-action="nw"></span>' +
	        '<span class="cropper-point point-sw" data-action="sw"></span>' +
	        '<span class="cropper-point point-se" data-action="se"></span>' +
	      '</div>' +
	    '</div>'
	  );*/

	  var _Cropper = window.Cropper;

	  Cropper.noConflict = function () {
	    window.Cropper = _Cropper;
	    return Cropper;
	  };

	  Cropper.setDefaults = function (options) {
	    extend(Cropper.DEFAULTS, options);
	  };

	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	      return Cropper;
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }

	  if (!noGlobal) {
	    window.Cropper = Cropper;
	  }

	  return Cropper;
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(241)(module)))

/***/ },

/***/ 377:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(378);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(173)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../css-loader/index.js!./cropper.css", function() {
				var newContent = require("!!./../../css-loader/index.js!./cropper.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 378:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(169)();
	// imports


	// module
	exports.push([module.id, "/*!\n * Cropper.js v0.5.6\n * https://github.com/fengyuanchen/cropperjs\n *\n * Copyright (c) 2015-2016 Fengyuan Chen\n * Released under the MIT license\n *\n * Date: 2016-01-18T05:33:19.322Z\n */\n.cropper-container {\n  font-size: 0;\n  line-height: 0;\n\n  position: relative;\n\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n\n  direction: ltr !important;\n  -ms-touch-action: none;\n      touch-action: none;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-touch-callout: none;\n}\n\n.cropper-container img {\n  display: block;\n\n  width: 100%;\n  min-width: 0 !important;\n  max-width: none !important;\n  height: 100%;\n  min-height: 0 !important;\n  max-height: none !important;\n\n  image-orientation: 0deg !important;\n}\n\n.cropper-wrap-box,\n.cropper-canvas,\n.cropper-drag-box,\n.cropper-crop-box,\n.cropper-modal {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n}\n\n.cropper-wrap-box {\n  overflow: hidden;\n}\n\n.cropper-drag-box {\n  opacity: 0;\n  background-color: #fff;\n\n  filter: alpha(opacity=0);\n}\n\n.cropper-modal {\n  opacity: .5;\n  background-color: #000;\n\n  filter: alpha(opacity=50);\n}\n\n.cropper-view-box {\n  display: block;\n  overflow: hidden;\n\n  width: 100%;\n  height: 100%;\n\n  outline: 1px solid #39f;\n  outline-color: rgba(51, 153, 255, .75);\n}\n\n.cropper-dashed {\n  position: absolute;\n\n  display: block;\n\n  opacity: .5;\n  border: 0 dashed #eee;\n\n  filter: alpha(opacity=50);\n}\n\n.cropper-dashed.dashed-h {\n  top: 33.33333%;\n  left: 0;\n\n  width: 100%;\n  height: 33.33333%;\n\n  border-top-width: 1px;\n  border-bottom-width: 1px;\n}\n\n.cropper-dashed.dashed-v {\n  top: 0;\n  left: 33.33333%;\n\n  width: 33.33333%;\n  height: 100%;\n\n  border-right-width: 1px;\n  border-left-width: 1px;\n}\n\n.cropper-center {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n\n  display: block;\n\n  width: 0;\n  height: 0;\n\n  opacity: .75;\n\n  filter: alpha(opacity=75);\n}\n\n.cropper-center:before,\n.cropper-center:after {\n  position: absolute;\n\n  display: block;\n\n  content: ' ';\n\n  background-color: #eee;\n}\n\n.cropper-center:before {\n  top: 0;\n  left: -3px;\n\n  width: 7px;\n  height: 1px;\n}\n\n.cropper-center:after {\n  top: -3px;\n  left: 0;\n\n  width: 1px;\n  height: 7px;\n}\n\n.cropper-face,\n.cropper-line,\n.cropper-point {\n  position: absolute;\n\n  display: block;\n\n  width: 100%;\n  height: 100%;\n\n  opacity: .1;\n\n  filter: alpha(opacity=10);\n}\n\n.cropper-face {\n  top: 0;\n  left: 0;\n\n  background-color: #fff;\n}\n\n.cropper-line {\n  background-color: #39f;\n}\n\n.cropper-line.line-e {\n  top: 0;\n  right: -3px;\n\n  width: 5px;\n\n  cursor: e-resize;\n}\n\n.cropper-line.line-n {\n  top: -3px;\n  left: 0;\n\n  height: 5px;\n\n  cursor: n-resize;\n}\n\n.cropper-line.line-w {\n  top: 0;\n  left: -3px;\n\n  width: 5px;\n\n  cursor: w-resize;\n}\n\n.cropper-line.line-s {\n  bottom: -3px;\n  left: 0;\n\n  height: 5px;\n\n  cursor: s-resize;\n}\n\n.cropper-point {\n  width: 5px;\n  height: 5px;\n\n  opacity: .75;\n  background-color: #39f;\n\n  filter: alpha(opacity=75);\n}\n\n.cropper-point.point-e {\n  top: 50%;\n  right: -3px;\n\n  margin-top: -3px;\n\n  cursor: e-resize;\n}\n\n.cropper-point.point-n {\n  top: -3px;\n  left: 50%;\n\n  margin-left: -3px;\n\n  cursor: n-resize;\n}\n\n.cropper-point.point-w {\n  top: 50%;\n  left: -3px;\n\n  margin-top: -3px;\n\n  cursor: w-resize;\n}\n\n.cropper-point.point-s {\n  bottom: -3px;\n  left: 50%;\n\n  margin-left: -3px;\n\n  cursor: s-resize;\n}\n\n.cropper-point.point-ne {\n  top: -3px;\n  right: -3px;\n\n  cursor: ne-resize;\n}\n\n.cropper-point.point-nw {\n  top: -3px;\n  left: -3px;\n\n  cursor: nw-resize;\n}\n\n.cropper-point.point-sw {\n  bottom: -3px;\n  left: -3px;\n\n  cursor: sw-resize;\n}\n\n.cropper-point.point-se {\n  right: -3px;\n  bottom: -3px;\n\n  width: 20px;\n  height: 20px;\n\n  cursor: se-resize;\n\n  opacity: 1;\n\n  filter: alpha(opacity=100);\n}\n\n.cropper-point.point-se:before {\n  position: absolute;\n  right: -50%;\n  bottom: -50%;\n\n  display: block;\n\n  width: 200%;\n  height: 200%;\n\n  content: ' ';\n\n  opacity: 0;\n  background-color: #39f;\n\n  filter: alpha(opacity=0);\n}\n\n@media (min-width: 768px) {\n  .cropper-point.point-se {\n    width: 15px;\n    height: 15px;\n  }\n}\n\n@media (min-width: 992px) {\n  .cropper-point.point-se {\n    width: 10px;\n    height: 10px;\n  }\n}\n\n@media (min-width: 1200px) {\n  .cropper-point.point-se {\n    width: 5px;\n    height: 5px;\n\n    opacity: .75;\n\n    filter: alpha(opacity=75);\n  }\n}\n\n.cropper-invisible {\n  opacity: 0;\n\n  filter: alpha(opacity=0);\n}\n\n.cropper-bg {\n  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC');\n}\n\n.cropper-hide {\n  position: absolute;\n\n  display: block;\n\n  width: 0;\n  height: 0;\n}\n\n.cropper-hidden {\n  display: none !important;\n}\n\n.cropper-move {\n  cursor: move;\n}\n\n.cropper-crop {\n  cursor: crosshair;\n}\n\n.cropper-disabled .cropper-drag-box,\n.cropper-disabled .cropper-face,\n.cropper-disabled .cropper-line,\n.cropper-disabled .cropper-point {\n  cursor: not-allowed;\n}\n", ""]);

	// exports


/***/ },

/***/ 379:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var modalFactory = __webpack_require__(380);
	var insertKeyframesRule = __webpack_require__(385);
	var appendVendorPrefix = __webpack_require__(382);

	var animation = {
	    show: {
	        animationDuration: '0.4s',
	        animationTimingFunction: 'cubic-bezier(0.7,0,0.3,1)'
	    },

	    hide: {
	        animationDuration: '0.4s',
	        animationTimingFunction: 'cubic-bezier(0.7,0,0.3,1)'
	    },

	    showModalAnimation: insertKeyframesRule({
	        '0%': {
	            opacity: 0,
	            transform: 'translate3d(-50%, -300px, 0)'
	        },
	        '100%': {
	            opacity: 1,
	            transform: 'translate3d(-50%, -50%, 0)'
	        }
	    }),

	    hideModalAnimation: insertKeyframesRule({
	        '0%': {
	            opacity: 1,
	            transform: 'translate3d(-50%, -50%, 0)'
	        },
	        '100%': {
	            opacity: 0,
	            transform: 'translate3d(-50%, 100px, 0)'
	        }
	    }),

	    showBackdropAnimation: insertKeyframesRule({
	        '0%': {
	            opacity: 0
	        },
	        '100%': {
	            opacity: 0.9
	        }
	    }),

	    hideBackdropAnimation: insertKeyframesRule({
	        '0%': {
	            opacity: 0.9
	        },
	        '100%': {
	            opacity: 0
	        }
	    }),

	    showContentAnimation: insertKeyframesRule({
	        '0%': {
	            opacity: 0,
	            transform: 'translate3d(0, -20px, 0)'
	        },
	        '100%': {
	            opacity: 1,
	            transform: 'translate3d(0, 0, 0)'
	        }
	    }),

	    hideContentAnimation: insertKeyframesRule({
	        '0%': {
	            opacity: 1,
	            transform: 'translate3d(0, 0, 0)'
	        },
	        '100%': {
	            opacity: 0,
	            transform: 'translate3d(0, 50px, 0)'
	        }
	    })
	};

	var showAnimation = animation.show;
	var hideAnimation = animation.hide;
	var showModalAnimation = animation.showModalAnimation;
	var hideModalAnimation = animation.hideModalAnimation;
	var showBackdropAnimation = animation.showBackdropAnimation;
	var hideBackdropAnimation = animation.hideBackdropAnimation;
	var showContentAnimation = animation.showContentAnimation;
	var hideContentAnimation = animation.hideContentAnimation;

	module.exports = modalFactory({
	    getRef: function getRef(willHidden) {
	        return 'modal';
	    },
	    getModalStyle: function getModalStyle(willHidden) {
	        return appendVendorPrefix({
	            position: "fixed",
	            width: "500px",
	            transform: "translate3d(-50%, -50%, 0)",
	            top: "50%",
	            left: "50%",
	            backgroundColor: "white",
	            zIndex: 1050,
	            animationDuration: (willHidden ? hideAnimation : showAnimation).animationDuration,
	            animationFillMode: 'forwards',
	            animationName: willHidden ? hideModalAnimation : showModalAnimation,
	            animationTimingFunction: (willHidden ? hideAnimation : showAnimation).animationTimingFunction
	        });
	    },
	    getBackdropStyle: function getBackdropStyle(willHidden) {
	        return appendVendorPrefix({
	            position: "fixed",
	            top: 0,
	            right: 0,
	            bottom: 0,
	            left: 0,
	            zIndex: 1040,
	            backgroundColor: "#373A47",
	            animationDuration: (willHidden ? hideAnimation : showAnimation).animationDuration,
	            animationFillMode: 'forwards',
	            animationName: willHidden ? hideBackdropAnimation : showBackdropAnimation,
	            animationTimingFunction: (willHidden ? hideAnimation : showAnimation).animationTimingFunction
	        });
	    },
	    getContentStyle: function getContentStyle(willHidden) {
	        return appendVendorPrefix({
	            margin: 0,
	            opacity: 0,
	            animationDuration: (willHidden ? hideAnimation : showAnimation).animationDuration,
	            animationFillMode: 'forwards',
	            animationDelay: '0.25s',
	            animationName: showContentAnimation,
	            animationTimingFunction: (willHidden ? hideAnimation : showAnimation).animationTimingFunction
	        });
	    }
	});

/***/ },

/***/ 380:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var transitionEvents = __webpack_require__(381);
	var appendVendorPrefix = __webpack_require__(382);

	module.exports = function (animation) {

	    return React.createClass({
	        propTypes: {
	            className: React.PropTypes.string,
	            // Close the modal when esc is pressed? Defaults to true.
	            keyboard: React.PropTypes.bool,
	            onShow: React.PropTypes.func,
	            onHide: React.PropTypes.func,
	            animation: React.PropTypes.object,
	            backdrop: React.PropTypes.bool,
	            closeOnClick: React.PropTypes.bool,
	            modalStyle: React.PropTypes.object,
	            backdropStyle: React.PropTypes.object,
	            contentStyle: React.PropTypes.object
	        },

	        getDefaultProps: function getDefaultProps() {
	            return {
	                className: "",
	                onShow: function onShow() {},
	                onHide: function onHide() {},
	                animation: animation,
	                keyboard: true,
	                backdrop: true,
	                closeOnClick: true,
	                modalStyle: {},
	                backdropStyle: {},
	                contentStyle: {}
	            };
	        },

	        getInitialState: function getInitialState() {
	            return {
	                willHidden: false,
	                hidden: true
	            };
	        },

	        hasHidden: function hasHidden() {
	            return this.state.hidden;
	        },

	        addTransitionListener: function addTransitionListener(node, handle) {
	            if (node) {
	                var endListener = function endListener(e) {
	                    if (e && e.target !== node) {
	                        return;
	                    }
	                    transitionEvents.removeEndEventListener(node, endListener);
	                    handle();
	                };
	                transitionEvents.addEndEventListener(node, endListener);
	            }
	        },

	        handleBackdropClick: function handleBackdropClick() {
	            return;
	        },

	        render: function render() {

	            var hidden = this.hasHidden();
	            if (hidden) return null;

	            var willHidden = this.state.willHidden;
	            var animation = this.props.animation;
	            var modalStyle = animation.getModalStyle(willHidden);
	            var backdropStyle = animation.getBackdropStyle(willHidden);
	            var contentStyle = animation.getContentStyle(willHidden);
	            var ref = animation.getRef(willHidden);
	            var sharp = animation.getSharp && animation.getSharp(willHidden);

	            // Apply custom style properties
	            if (this.props.modalStyle) {
	                var prefixedModalStyle = appendVendorPrefix(this.props.modalStyle);
	                for (var style in prefixedModalStyle) {
	                    modalStyle[style] = prefixedModalStyle[style];
	                }
	            }

	            if (this.props.backdropStyle) {
	                var prefixedBackdropStyle = appendVendorPrefix(this.props.backdropStyle);
	                for (var style in prefixedBackdropStyle) {
	                    backdropStyle[style] = prefixedBackdropStyle[style];
	                }
	            }

	            if (this.props.contentStyle) {
	                var prefixedContentStyle = appendVendorPrefix(this.props.contentStyle);
	                for (var style in prefixedContentStyle) {
	                    contentStyle[style] = prefixedContentStyle[style];
	                }
	            }

	            var backdrop = this.props.backdrop ? React.createElement("div", { style: backdropStyle, onClick: this.props.closeOnClick ? this.handleBackdropClick : null }) : undefined;

	            if (willHidden) {
	                var node = this.refs[ref];
	                this.addTransitionListener(node, this.leave);
	            }

	            return React.createElement("span", null, React.createElement("div", { ref: "modal", style: modalStyle, className: this.props.className }, sharp, React.createElement("div", { ref: "content", tabIndex: "-1", style: contentStyle }, this.props.children)), backdrop);
	        },

	        leave: function leave() {
	            this.setState({
	                hidden: true
	            });
	            this.props.onHide();
	        },

	        enter: function enter() {
	            this.props.onShow();
	        },

	        show: function show() {
	            if (!this.hasHidden()) return;

	            this.setState({
	                willHidden: false,
	                hidden: false
	            });

	            setTimeout(function () {
	                var ref = this.props.animation.getRef();
	                var node = this.refs[ref];
	                this.addTransitionListener(node, this.enter);
	            }.bind(this), 0);
	        },

	        hide: function hide() {
	            if (this.hasHidden()) return;

	            this.setState({
	                willHidden: true
	            });
	        },

	        toggle: function toggle() {
	            if (this.hasHidden()) this.show();else this.hide();
	        },

	        listenKeyboard: function listenKeyboard(event) {
	            if (this.props.keyboard && (event.key === "Escape" || event.keyCode === 27)) {
	                this.hide();
	            }
	        },

	        componentDidMount: function componentDidMount() {
	            window.addEventListener("keydown", this.listenKeyboard, true);
	        },

	        componentWillUnmount: function componentWillUnmount() {
	            window.removeEventListener("keydown", this.listenKeyboard, true);
	        }
	    });
	};

/***/ },

/***/ 381:
/***/ function(module, exports) {

	'use strict';

	/**
	 * EVENT_NAME_MAP is used to determine which event fired when a
	 * transition/animation ends, based on the style property used to
	 * define that event.
	 */

	var EVENT_NAME_MAP = {
	  transitionend: {
	    'transition': 'transitionend',
	    'WebkitTransition': 'webkitTransitionEnd',
	    'MozTransition': 'mozTransitionEnd',
	    'OTransition': 'oTransitionEnd',
	    'msTransition': 'MSTransitionEnd'
	  },

	  animationend: {
	    'animation': 'animationend',
	    'WebkitAnimation': 'webkitAnimationEnd',
	    'MozAnimation': 'mozAnimationEnd',
	    'OAnimation': 'oAnimationEnd',
	    'msAnimation': 'MSAnimationEnd'
	  }
	};

	var endEvents = [];

	function detectEvents() {
	  var testEl = document.createElement('div');
	  var style = testEl.style;

	  // On some platforms, in particular some releases of Android 4.x,
	  // the un-prefixed "animation" and "transition" properties are defined on the
	  // style object but the events that fire will still be prefixed, so we need
	  // to check if the un-prefixed events are useable, and if not remove them
	  // from the map
	  if (!('AnimationEvent' in window)) {
	    delete EVENT_NAME_MAP.animationend.animation;
	  }

	  if (!('TransitionEvent' in window)) {
	    delete EVENT_NAME_MAP.transitionend.transition;
	  }

	  for (var baseEventName in EVENT_NAME_MAP) {
	    var baseEvents = EVENT_NAME_MAP[baseEventName];
	    for (var styleName in baseEvents) {
	      if (styleName in style) {
	        endEvents.push(baseEvents[styleName]);
	        break;
	      }
	    }
	  }
	}

	if (typeof window !== 'undefined') {
	  detectEvents();
	}

	// We use the raw {add|remove}EventListener() call because EventListener
	// does not know how to remove event listeners and we really should
	// clean up. Also, these events are not triggered in older browsers
	// so we should be A-OK here.

	function addEventListener(node, eventName, eventListener) {
	  node.addEventListener(eventName, eventListener, false);
	}

	function removeEventListener(node, eventName, eventListener) {
	  node.removeEventListener(eventName, eventListener, false);
	}

	module.exports = {
	  addEndEventListener: function addEndEventListener(node, eventListener) {
	    if (endEvents.length === 0) {
	      // If CSS transitions are not supported, trigger an "end animation"
	      // event immediately.
	      window.setTimeout(eventListener, 0);
	      return;
	    }
	    endEvents.forEach(function (endEvent) {
	      addEventListener(node, endEvent, eventListener);
	    });
	  },

	  removeEndEventListener: function removeEndEventListener(node, eventListener) {
	    if (endEvents.length === 0) {
	      return;
	    }
	    endEvents.forEach(function (endEvent) {
	      removeEventListener(node, endEvent, eventListener);
	    });
	  }
	};

/***/ },

/***/ 382:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var getVendorPropertyName = __webpack_require__(383);

	module.exports = function (target, sources) {
	  var to = Object(target);
	  var hasOwnProperty = Object.prototype.hasOwnProperty;

	  for (var nextIndex = 1; nextIndex < arguments.length; nextIndex++) {
	    var nextSource = arguments[nextIndex];
	    if (nextSource == null) {
	      continue;
	    }

	    var from = Object(nextSource);

	    for (var key in from) {
	      if (hasOwnProperty.call(from, key)) {
	        to[key] = from[key];
	      }
	    }
	  }

	  var prefixed = {};
	  for (var key in to) {
	    prefixed[getVendorPropertyName(key)] = to[key];
	  }

	  return prefixed;
	};

/***/ },

/***/ 383:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var builtinStyle = __webpack_require__(384);
	var prefixes = ['Moz', 'Webkit', 'O', 'ms'];
	var domVendorPrefix;

	// Helper function to get the proper vendor property name. (transition => WebkitTransition)
	module.exports = function (prop, isSupportTest) {

	  var vendorProp;
	  if (prop in builtinStyle) return prop;

	  var UpperProp = prop.charAt(0).toUpperCase() + prop.substr(1);

	  if (domVendorPrefix) {

	    vendorProp = domVendorPrefix + UpperProp;
	    if (vendorProp in builtinStyle) {
	      return vendorProp;
	    }
	  } else {

	    for (var i = 0; i < prefixes.length; ++i) {
	      vendorProp = prefixes[i] + UpperProp;
	      if (vendorProp in builtinStyle) {
	        domVendorPrefix = prefixes[i];
	        return vendorProp;
	      }
	    }
	  }

	  // if support test, not fallback to origin prop name
	  if (!isSupportTest) {
	    return prop;
	  }
	};

/***/ },

/***/ 384:
/***/ function(module, exports) {

	'use strict';

	module.exports = document.createElement('div').style;

/***/ },

/***/ 385:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var insertRule = __webpack_require__(386);
	var vendorPrefix = __webpack_require__(387)();
	var index = 0;

	module.exports = function (keyframes) {
	  // random name
	  var name = 'anim_' + ++index + +new Date();
	  var css = "@" + vendorPrefix + "keyframes " + name + " {";

	  for (var key in keyframes) {
	    css += key + " {";

	    for (var property in keyframes[key]) {
	      var part = ":" + keyframes[key][property] + ";";
	      // We do vendor prefix for every property
	      css += vendorPrefix + property + part;
	      css += property + part;
	    }

	    css += "}";
	  }

	  css += "}";

	  insertRule(css);

	  return name;
	};

/***/ },

/***/ 386:
/***/ function(module, exports) {

	'use strict';

	var extraSheet;

	module.exports = function (css) {

	  if (!extraSheet) {
	    // First time, create an extra stylesheet for adding rules
	    extraSheet = document.createElement('style');
	    document.getElementsByTagName('head')[0].appendChild(extraSheet);
	    // Keep reference to actual StyleSheet object (`styleSheet` for IE < 9)
	    extraSheet = extraSheet.sheet || extraSheet.styleSheet;
	  }

	  var index = (extraSheet.cssRules || extraSheet.rules).length;
	  extraSheet.insertRule(css, index);

	  return extraSheet;
	};

/***/ },

/***/ 387:
/***/ function(module, exports) {

	'use strict';

	var cssVendorPrefix;

	module.exports = function () {

	  if (cssVendorPrefix) return cssVendorPrefix;

	  var styles = window.getComputedStyle(document.documentElement, '');
	  var pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || styles.OLink === '' && ['', 'o'])[1];

	  return cssVendorPrefix = '-' + pre + '-';
	};

/***/ },

/***/ 454:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _superagent = __webpack_require__(160);

	var _superagent2 = _interopRequireDefault(_superagent);

	var _DropModal = __webpack_require__(379);

	var _DropModal2 = _interopRequireDefault(_DropModal);

	var _input = __webpack_require__(243);

	var _input2 = _interopRequireDefault(_input);

	var _textarea = __webpack_require__(246);

	var _textarea2 = _interopRequireDefault(_textarea);

	var _cancel_button = __webpack_require__(260);

	var _cancel_button2 = _interopRequireDefault(_cancel_button);

	var _submit_button = __webpack_require__(263);

	var _submit_button2 = _interopRequireDefault(_submit_button);

	var _upload_head = __webpack_require__(455);

	var _upload_head2 = _interopRequireDefault(_upload_head);

	__webpack_require__(458);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*遮罩层组件*/


	var Edit_profile = function (_React$Component) {
		_inherits(Edit_profile, _React$Component);

		function Edit_profile(props) {
			_classCallCheck(this, Edit_profile);

			var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Edit_profile).call(this, props));

			_this2.state = {
				/*用户资料数据*/
				img: null,
				name: "",
				introduction: "",
				contacts: "",
				phone: "",
				address: "",

				/*error message*/
				nameErr: null,
				introductionErr: null,
				contactsErr: null,
				phoneErr: null,
				addressErr: null,

				forbidClose: false, /*遮罩层的关闭按钮是否禁止？false为不禁止，true为禁止*/

				errMess: null /*错误提示*/
			};
			return _this2;
		}

		_createClass(Edit_profile, [{
			key: "componentDidMount",
			value: function componentDidMount() {
				var _this = this;
				_superagent2.default.get("/initProfile") /*加载用户资料信息*/
				.accept('application/json').end(function (err, res) {
					if (err || !res.ok) {
						console.log(err);
						return false;
					};
					console.log("用户资料初始化");
					_this.setState({
						img: "../../../images/1459782264000.jpg",
						name: "初恋婚介所",
						introduction: "秉着诚信，负责任的原则，初恋婚介所一直在尽自己十分的努力为年轻的男女们寻找心目中的她（他）.",
						contacts: "夏天",
						phone: "13531957084",
						address: "深圳高新科技园..."
					});
				});
			}

			/*checked*/

		}, {
			key: "handleBlur",
			value: function handleBlur(event, type) {
				var value = event.currentTarget.value;

				switch (type) {
					case "name":
						if (value.length == 0) {
							this.setState({
								nameErr: "婚介所名字不能为空"
							});
							this.refs.nameErr.style.display = "inline-block";
							break;
						};
						if (value.length > 15) {
							this.setState({
								nameErr: "婚介所名字不能超过十五个字符"
							});
							this.refs.nameErr.style.display = "inline-block";
							break;
						};
						this.setState({
							nameErr: null
						});
						this.refs.nameErr.style.display = "none";
						break;
					case "introduction":
						if (value.length == 0) {
							this.setState({
								introductionErr: "婚介所介绍不能为空"
							});
							this.refs.introductionErr.style.display = "inline-block";
							break;
						};
						if (value.length > 200) {
							this.setState({
								introductionErr: "婚介所介绍不能超过200个字符"
							});
							this.refs.introductionErr.style.display = "inline-block";
							break;
						};
						this.setState({
							introductionErr: null
						});
						this.refs.introductionErr.style.display = "none";
						break;
					case "contacts":
						if (value.length == 0) {
							this.setState({
								contactsErr: "联系人不能为空"
							});
							this.refs.contactsErr.style.display = "inline-block";
							break;
						};
						this.setState({
							contactsErr: null
						});
						this.refs.contactsErr.style.display = "none";
						break;
					case "phone":
						if (value.length == 0) {
							this.setState({
								phoneErr: "联系电话不能为空"
							});
							this.refs.phoneErr.style.display = "inline-block";
							break;
						} else if (isNaN(value)) {
							this.setState({
								phoneErr: "电话格式错误"
							});
							this.refs.phoneErr.style.display = "inline-block";
							break;
						};
						this.setState({
							phoneErr: null
						});
						this.refs.phoneErr.style.display = "none";
						break;
					case "address":
						if (value.length == 0) {
							this.setState({
								addressErr: "地址不能为空"
							});
							this.refs.addressErr.style.display = "inline-block";
							break;
						};
						this.setState({
							addressErr: null
						});
						this.refs.addressErr.style.display = "none";
						break;
				};
			}

			/*获取头像*/

		}, {
			key: "get_header",
			value: function get_header(head) {
				this.setState({
					img: head
				});
			}

			/*提取各输入框的输入值*/

		}, {
			key: "collect_value",
			value: function collect_value(event, type) {
				var value = event.currentTarget.value;

				this.setState(_defineProperty({}, type, value));
				//console.log( typeof( type ) ); => string
				//console.log( typeof( [ type ] ) ); => object
			}

			/*将一段二进制数据流封装为一个数据流对象*/
			//**dataURL to blob**

		}, {
			key: "dataURLtoBlob",
			value: function dataURLtoBlob(dataurl) {
				var arr = dataurl.split(','),
				    mime = arr[0].match(/:(.*?);/)[1],
				    bstr = atob(arr[1]),
				    n = bstr.length,
				    u8arr = new Uint8Array(n);
				while (n--) {
					u8arr[n] = bstr.charCodeAt(n);
				}
				return new Blob([u8arr], { type: mime });
			}

			/*封装formdata对象*/

		}, {
			key: "toFormData",
			value: function toFormData(form) {
				// 封装formdata对象，formdata对象可以包含json
				form.append("name", this.state.name); /*婚介所的名字*/
				form.append("introduction", this.state.introduction); /*婚介所的简介*/
				form.append("contacts", this.state.contacts); /*婚介所的联系人*/
				form.append("phone", this.state.phone); /*婚介所的联系电话*/
				form.append("address", this.state.address); /*婚介所的地址*/

				/*检测为base64字符串时*/
				if (this.state.img.indexOf("base64") > 0) {
					form.append('image', this.dataURLtoBlob(this.state.img), Date.parse(new Date()) + ".jpg");
				} else {
					/*若检测到图片不是base64数据流，则说明头像并没有修改，把原图片路径反传回去即可*/
					form.append('image', this.state.img);
				};
				return form;
			}
		}, {
			key: "handleCancel",
			value: function handleCancel() {
				this.props.history.replaceState(null, '/marriage_app');
			}
		}, {
			key: "handleEdit",
			value: function handleEdit() {
				var _this = this;
				var form = new FormData();
				/*检测表单错误信息是否存在，若存在则禁止修改*/
				if (this.state.nameErr || this.state.introductionErr || this.state.contactsErr || this.state.phoneErr || this.state.addressErr) {
					return false;
				};
				this.setState({
					errMess: "请稍等一下~"
				});
				this.showModal(true); /*禁止关闭按钮*/
				this.toFormData(form);
				_superagent2.default.post("/editProfile") /*保险起见替换为jquery的ajax？*/
				.send(form).end(function (err, res) {
					if (err || !res.ok) {
						console.log(err);
						_this.setState({
							errMess: "修改失败"
						});
						_this.showModal(false);
						return false;
					};
					_this.setState({
						errMess: "修改成功"
					});
					_this.showModal(true);
					setTimeout(function () {
						_this.props.history.replaceState(null, '/marriage_app');
					}, 2000);
				});
			}

			/*提示遮罩层出现*/

		}, {
			key: "showModal",
			value: function showModal(forbidState) {
				this.setState({
					forbidClose: forbidState
				});
				this.refs.modal.show();
			}

			/*提示遮罩层消失*/

		}, {
			key: "hideModal",
			value: function hideModal() {
				this.refs.modal.hide();
			}
		}, {
			key: "render",
			value: function render() {
				var _this3 = this;

				return _react2.default.createElement(
					"div",
					{ className: "edit_profile" },
					_react2.default.createElement(
						_DropModal2.default,
						{ ref: "modal" },
						_react2.default.createElement(
							"div",
							{ className: "errMessCloseBox" },
							this.state.forbidClose == true ? "" : _react2.default.createElement("span", { className: "errMessClose", onClick: function onClick() {
									return _this3.hideModal();
								} })
						),
						_react2.default.createElement(
							"div",
							{ className: "errMess" },
							this.state.errMess
						)
					),
					_react2.default.createElement(
						"div",
						{ className: "edit_profile_header" },
						_react2.default.createElement(
							"span",
							null,
							"修改资料"
						)
					),
					_react2.default.createElement(
						"form",
						{ className: "edit_profile_main", ref: "edit_profile_main", action: "#", method: "post" },
						_react2.default.createElement(
							"div",
							{ className: "head edit_profile_main_list" },
							_react2.default.createElement(
								"span",
								{ className: "title" },
								"头像"
							),
							_react2.default.createElement(
								"div",
								{ className: "list_main" },
								_react2.default.createElement(
									"div",
									{ className: "list_main_content" },
									_react2.default.createElement(_upload_head2.default, { get_header: function get_header(head) {
											return _this3.get_header(head);
										}, img: this.state.img })
								)
							)
						),
						_react2.default.createElement(
							"div",
							{ className: "name edit_profile_main_list" },
							_react2.default.createElement(
								"span",
								{ className: "title" },
								"名称"
							),
							_react2.default.createElement(
								"div",
								{ className: "list_main" },
								_react2.default.createElement(
									"div",
									{ className: "list_main_content" },
									_react2.default.createElement(
										"label",
										{ htmlFor: "name_input" },
										"输入婚介所的名字："
									),
									_react2.default.createElement(_input2.default, { ref: "name",
										placeholder: "不超过十五个字符",
										onValue: function onValue(event) {
											return _this3.collect_value(event, "name");
										},
										onBlur: function onBlur(event) {
											return _this3.handleBlur(event, "name");
										},
										init_value: this.state.name }),
									_react2.default.createElement(
										"span",
										{ className: "checkedErr", ref: "nameErr" },
										this.state.nameErr
									)
								)
							)
						),
						_react2.default.createElement(
							"div",
							{ className: " Introduction edit_profile_main_list" },
							_react2.default.createElement(
								"span",
								{ className: "title" },
								"简介"
							),
							_react2.default.createElement(
								"div",
								{ className: "list_main" },
								_react2.default.createElement(
									"div",
									{ className: "list_main_content" },
									_react2.default.createElement(
										"label",
										{ htmlFor: "introduction_input" },
										"输入婚介所的简介："
									),
									_react2.default.createElement(_textarea2.default, { ref: "introduction",
										placeholder: "请输入两百字以内",
										onValue: function onValue(event) {
											return _this3.collect_value(event, "introduction");
										},
										onBlur: function onBlur(event) {
											return _this3.handleBlur(event, "introduction");
										},
										init_value: this.state.introduction }),
									_react2.default.createElement(
										"span",
										{ className: "checkedErr", ref: "introductionErr" },
										this.state.introductionErr
									)
								)
							)
						),
						_react2.default.createElement(
							"div",
							{ className: "contacts edit_profile_main_list" },
							_react2.default.createElement(
								"span",
								{ className: "title" },
								"联系人"
							),
							_react2.default.createElement(
								"div",
								{ className: "list_main" },
								_react2.default.createElement(
									"div",
									{ className: "list_main_content" },
									_react2.default.createElement(
										"label",
										{ htmlFor: "contacts_input" },
										"输入联系人的名字："
									),
									_react2.default.createElement(_input2.default, { ref: "contacts",
										placeholder: "",
										onValue: function onValue(event) {
											return _this3.collect_value(event, "contacts");
										},
										onBlur: function onBlur(event) {
											return _this3.handleBlur(event, "contacts");
										},
										init_value: this.state.contacts }),
									_react2.default.createElement(
										"span",
										{ className: "checkedErr", ref: "contactsErr" },
										this.state.contactsErr
									)
								)
							)
						),
						_react2.default.createElement(
							"div",
							{ className: "phone_num edit_profile_main_list" },
							_react2.default.createElement(
								"span",
								{ className: "title" },
								"联系电话"
							),
							_react2.default.createElement(
								"div",
								{ className: "list_main" },
								_react2.default.createElement(
									"div",
									{ className: "list_main_content" },
									_react2.default.createElement(
										"label",
										{ htmlFor: "phone_num_input" },
										"输入联系人的电话："
									),
									_react2.default.createElement(_input2.default, { ref: "phone",
										placeholder: "",
										onValue: function onValue(event) {
											return _this3.collect_value(event, "phone");
										},
										onBlur: function onBlur(event) {
											return _this3.handleBlur(event, "phone");
										},
										init_value: this.state.phone }),
									_react2.default.createElement(
										"span",
										{ className: "checkedErr", ref: "phoneErr" },
										this.state.phoneErr
									)
								)
							)
						),
						_react2.default.createElement(
							"div",
							{ className: "address edit_profile_main_list" },
							_react2.default.createElement(
								"span",
								{ className: "title" },
								"地址"
							),
							_react2.default.createElement(
								"div",
								{ className: "list_main" },
								_react2.default.createElement(
									"div",
									{ className: "list_main_content" },
									_react2.default.createElement(
										"label",
										{ htmlFor: "address_input" },
										"输入婚介所的详细地址："
									),
									_react2.default.createElement(_input2.default, { ref: "address",
										placeholder: "",
										onValue: function onValue(event) {
											return _this3.collect_value(event, "address");
										},
										onBlur: function onBlur(event) {
											return _this3.handleBlur(event, "address");
										},
										init_value: this.state.address }),
									_react2.default.createElement(
										"span",
										{ className: "checkedErr", ref: "addressErr" },
										this.state.addressErr
									)
								)
							)
						),
						_react2.default.createElement(
							"div",
							{ className: "button_zone edit_profile_main_list" },
							_react2.default.createElement(
								"div",
								{ className: "button_zone_mian" },
								_react2.default.createElement(_cancel_button2.default, { onClick: function onClick() {
										return _this3.handleCancel();
									} }),
								_react2.default.createElement(_submit_button2.default, { onClick: function onClick() {
										return _this3.handleEdit();
									} })
							)
						)
					)
				);
			}
		}]);

		return Edit_profile;
	}(_react2.default.Component);

	;

	exports.default = Edit_profile;

/***/ },

/***/ 455:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _upload = __webpack_require__(372);

	var _upload2 = _interopRequireDefault(_upload);

	var _reactCropper = __webpack_require__(375);

	var _reactCropper2 = _interopRequireDefault(_reactCropper);

	var _DropModal = __webpack_require__(379);

	var _DropModal2 = _interopRequireDefault(_DropModal);

	__webpack_require__(456);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*图片剪裁组件*/
	/*遮罩层组件*/


	/*修改资料 上传头像*/

	var Upload_head = function (_React$Component) {
		_inherits(Upload_head, _React$Component);

		function Upload_head(props) {
			_classCallCheck(this, Upload_head);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Upload_head).call(this, props));

			_this.state = {
				src: null,
				cropResult: null
			};
			return _this;
		}

		/*用户头像*/


		_createClass(Upload_head, [{
			key: "componentWillReceiveProps",
			value: function componentWillReceiveProps(nextProps) {
				if (nextProps.img) {
					this.setState({
						cropResult: nextProps.img
					});
				}
			}
		}, {
			key: "_cropImage",
			value: function _cropImage() {
				if (typeof this.refs.cropper.getCroppedCanvas() === 'undefined') {
					return;
				}
				this.setState({
					cropResult: this.refs.cropper.getCroppedCanvas().toDataURL()
				});
				/*传递头像给父组件*/
				this.props.get_header(this.refs.cropper.getCroppedCanvas().toDataURL("image/jpeg", "0.9"));
				this.hideModal();
			}
		}, {
			key: "_onChange",
			value: function _onChange(e) {
				var _this2 = this;

				e.preventDefault();
				var files = void 0;
				if (e.dataTransfer) {
					files = e.dataTransfer.files;
				} else if (e.target) {
					files = e.target.files;
				}
				var reader = new FileReader();
				reader.onload = function () {
					_this2.setState({ src: reader.result });
				};
				reader.readAsDataURL(files[0]);
				this.showModal();
			}
		}, {
			key: "showModal",
			value: function showModal() {
				this.refs.modal.show();
			}
		}, {
			key: "hideModal",
			value: function hideModal() {
				this.refs.modal.hide();
			}
		}, {
			key: "render",
			value: function render() {
				return _react2.default.createElement(
					"div",
					{ className: "upload_head" },
					_react2.default.createElement(
						_DropModal2.default,
						{ ref: "modal" },
						_react2.default.createElement(_reactCropper2.default, {
							style: { height: '400', width: '100%' },
							aspectRatio: 105 / 105,
							preview: "",
							guides: false,
							src: this.state.src,
							ref: "cropper",
							crop: this._crop }),
						_react2.default.createElement("input", { type: "button", id: "crop", value: "剪裁", onClick: this._cropImage.bind(this) }),
						_react2.default.createElement("input", { type: "button", id: "close", value: "关闭", onClick: this.hideModal.bind(this) })
					),
					_react2.default.createElement(
						"div",
						{ className: "img" },
						_react2.default.createElement(
							"div",
							{ className: "img_container" },
							_react2.default.createElement("img", { src: this.state.cropResult })
						)
					),
					_react2.default.createElement(
						"div",
						{ className: "upload" },
						_react2.default.createElement(_upload2.default, { value: "上传头像", onChange: this._onChange.bind(this) })
					)
				);
			}
		}]);

		return Upload_head;
	}(_react2.default.Component);

	;
	exports.default = Upload_head;

/***/ },

/***/ 456:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(457);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(173)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./upload_head.css", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./upload_head.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 457:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(169)();
	// imports


	// module
	exports.push([module.id, ".head .img{\r\n\twidth: 120px;\r\n\theight: 120px;\r\n\tborder: 1px solid #a6d7b1;\r\n\tfloat: left;\r\n}\r\n.head .img .img_container{\r\n\twidth: 105px;\r\n\theight: 105px;\r\n\tmargin: 7.5px;\r\n\tbackground-color: #a3e0d1;\r\n}\r\n.head .img .img_container img{\r\n\twidth: 105px;\r\n\theight: 105px;\r\n}\r\n.head .upload{\r\n\tline-height: 120px;\r\n\tfloat: right;\r\n}", ""]);

	// exports


/***/ },

/***/ 458:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(459);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(173)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./edit_profile.css", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./edit_profile.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 459:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(169)();
	// imports


	// module
	exports.push([module.id, "*{\r\n\tmargin: 0;\r\n\tpadding: 0;\r\n}\r\n\r\n.edit_profile_header{\r\n\twidth: 100%;\r\n\theight: 65px;\r\n\tline-height: 65px;\r\n\tborder-bottom: 1px solid #dcdcdc;\r\n}\r\n.edit_profile_header span{\r\n\tmargin-left: 35px;\r\n\tfont-size: 22px;\r\n\tcolor: #333;\r\n}\r\n.edit_profile_main{\r\n\twidth: 852px;\r\n\tmin-height: 600px;\r\n\tmargin: 0 auto;\r\n}\r\n.edit_profile_main_list{\r\n\twidth: 100%;\r\n\tmin-height: 130px;\r\n\tmargin-top: 20px;\r\n\t/*border: 1px solid #a6d7b1;*/\r\n}\r\n.edit_profile_main_list .title{\r\n\tcolor: #666;\r\n\tfont-size: 18px;\r\n\ttext-decoration:underline;\r\n}\r\n.edit_profile_main_list .list_main{\r\n\tmin-width: 810px;\r\n\tmin-height: 70px;\r\n\tmargin: 20px auto;\r\n\t/*border: 1px solid #a6d7b1;*/\r\n}\r\n.edit_profile_main_list .list_main .list_main_content{\r\n\twidth: 470px;\r\n\theight: 100%;\r\n\tmargin-left: 50px;\r\n\tmargin-top: 20px;\r\n\t/*border: 1px solid #a6d7b1;*/\r\n\toverflow: hidden;\r\n}\r\n.edit_profile_main_list .list_main label{\r\n\tfont-size: 15px;\r\n\tcolor: #292727;\r\n\tline-height: 30px;\r\n\tmargin-top:5px;\r\n\tfloat: left;\r\n}\r\n.edit_profile_main_list .list_main .input_component{\r\n\tmargin: 5px;\r\n\tfloat: right;\r\n}\r\n\r\n/*头像*/\r\n.head .list_main{\r\n\tborder:none !important;\r\n}\r\n.head .list_main_content{\r\n\twidth: 350px !important;\r\n\tmargin-top: 0 !important;\r\n}\r\n\r\n/*名称*/\r\n\r\n\r\n/*简介*/\r\n.Introduction .list_main_content{\r\n\twidth: 555px !important;\r\n}\r\n.Introduction .textarea_component{\r\n\twidth: 360px;\r\n\theight: 160px;\r\n\tmargin: 5px;\r\n\tfloat: right;\r\n}\r\n\r\n/*联系人*/\r\n\r\n\r\n/*联系电话*/\r\n\r\n\r\n/*地址*/\r\n\r\n/*err message*/\r\n.edit_profile .checkedErr{\r\n\tdisplay:none;\r\n\tbackground-image:url(" + __webpack_require__(460) + ");\r\n\tbackground-repeat:no-repeat;\r\n\tbackground-position:left;\r\n\tmargin-left:175px;\r\n\tpadding-left:20px;\r\n\tcolor:#FE0202;\r\n\tfont-size:14px;\r\n}\r\n\r\n/*按钮区域*/\r\n.button_zone{\r\n\t/*border: 1px solid #a6d7b1;*/\r\n}\r\n.button_zone .button_zone_mian{\r\n\twidth: 300px;\r\n\theight: 50px;\r\n\tmargin-top: 40px;\r\n\tline-height:50px;\r\n\tfloat: right;\r\n\t/*border: 1px solid #a6d7b1;*/\r\n}", ""]);

	// exports


/***/ },

/***/ 460:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAp0lEQVQ4jd3SwQ3DIAxAUY+QEToCl8aeAnuUjNANGIEROgIjdIwqNRIj0EtALWlRklNVX9H7wgiA/xoVnCKT/3SWxAxq0T3kbLoBZcrKFFocmbwy5VlG6d/ComsjBatFt2mVV1CDW/EqcgQDvL3H/kDFFt3u/QuOTD6JGQAAlCkoU54tXbp4llGUMSnjreAaXiIqOH0N3IVOkfHaYoDlIzGFQw/62/MEQJ13qsDwJRcAAAAASUVORK5CYII="

/***/ }

});