webpackJsonp([14,17],{

/***/ 864:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	__webpack_require__(865);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Select = function (_React$Component) {
		_inherits(Select, _React$Component);

		function Select(props) {
			_classCallCheck(this, Select);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Select).call(this, props));

			_this.state = {
				value: null,
				show: false
			};
			return _this;
		}

		_createClass(Select, [{
			key: "componentDidMount",
			value: function componentDidMount() {
				this.setState({
					value: this.props.initValue
				});
			}
		}, {
			key: "handleClick",
			value: function handleClick() {
				this.setState({
					show: !this.state.show
				});
			}
		}, {
			key: "handleSelect",
			value: function handleSelect(event) {
				this.setState({
					value: event.target.innerHTML,
					show: !this.state.show
				});
				this.props.onSelectOption(event.target.innerHTML);
			}
		}, {
			key: "render",
			value: function render() {
				var _this2 = this;

				var display = {
					display: this.state.show ? "block" : "none"
				};
				var background = {
					backgroundImage: this.state.show ? "url(" + "../../../images/up.png" + ")" : "url(" + "../../../images/down.png" + ")"
				};
				return _react2.default.createElement(
					"div",
					{ className: "select", ref: "select" },
					_react2.default.createElement(
						"a",
						{ className: "select_value", style: background, onClick: this.handleClick.bind(this) },
						this.state.value
					),
					_react2.default.createElement(
						"ul",
						{ className: "options", style: display },
						_react2.default.Children.map(this.props.children, function (element, index) {
							return _react2.default.createElement(
								"li",
								{ key: index, onClick: _this2.handleSelect.bind(_this2) },
								element.props.option
							);
						})
					)
				);
			}
		}]);

		return Select;
	}(_react2.default.Component);

	;

	exports.default = Select;

/***/ },

/***/ 865:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(866);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(251)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./select.css", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./select.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 866:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(250)();
	// imports


	// module
	exports.push([module.id, ".select{\r\n\twidth:140px;\r\n\tposition:relative;\r\n\t/* top: 10px; */\r\n}\r\n.select_value{\r\n\ttext-decoration: none;\r\n\tdisplay: inline-block;\r\n\twidth: 100px;\r\n\theight: 35px;\r\n\tcolor: #434343;\r\n\tbackground-color: #FFF;\r\n\tbackground-repeat: no-repeat;\r\n\tbackground-position: 115px;\r\n\tborder: 1px solid #b6b6b6;\r\n\tfont-size: 14px;\r\n\tline-height: 35px;\r\n\tpadding-left:10px;\r\n\tpadding-right:30px;\r\n\tcursor:pointer;\r\n\t/* white-space:nowrap;\r\n\toverflow:hidden;\r\n\ttext-overflow:ellipsis; */\r\n}\r\n.options{\r\n\twidth:140px;\r\n\theight:70px;\r\n\tposition:absolute;\r\n\tz-index:100;\r\n}\r\n.options li{\r\n\t/* margin-top: -2px; */\r\n\tlist-style-type: none;\r\n\tdisplay: inline-block;\r\n\twidth: 130px;\r\n\theight: 35px;\r\n\tcolor: #434343;\r\n\tbackground-color: #FFF;\r\n\tborder: 1px solid #b6b6b6;\r\n\tfont-size: 14px;\r\n\tline-height: 35px;\r\n\tpadding-left:10px;\r\n\tborder-top:none;\r\n\tcursor:pointer;\r\n\t/* white-space:nowrap;\r\n\toverflow:hidden;\r\n\ttext-overflow:ellipsis;\r\n\t-webkit-transition: all .5s;\r\n\t-moz-transition: all .5s;\r\n\t-webkit-transition: all .5s;\r\n\t-ms-transition: all .5s; */\r\n}\r\n.options li:hover{\r\n\tcolor: #FFF !important;\r\n\tbackground-color: #ee1e6c;\r\n\tborder-bottom: 1px solid #ee1e6c;\r\n\t/* -webkit-transform: scale(1.5,1.2);\r\n\t-moz-transform: scale(1.5,1.2);\r\n\t-ms-transform: scale(1.5,1.2);\r\n\tz-index: 1000;\r\n\tbox-shadow: 2px 2px 4px #000;\r\n\tborder: none;\r\n\tfont-size:14px; */\r\n}", ""]);

	// exports


/***/ },

/***/ 880:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _select = __webpack_require__(864);

	var _select2 = _interopRequireDefault(_select);

	var _superagent = __webpack_require__(241);

	var _superagent2 = _interopRequireDefault(_superagent);

	__webpack_require__(881);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Activity_Grow = function (_React$Component) {
		_inherits(Activity_Grow, _React$Component);

		function Activity_Grow(props) {
			_classCallCheck(this, Activity_Grow);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Activity_Grow).call(this, props));

			window.scrollTo(0, 0);
			var data = [{
				img: "../../../images/xiaode.jpg",
				title: "冬日恋歌",
				visited: 45,
				visitor: 45,
				visited_average: 45,
				signed: 45,
				rate: "60%",
				comment: 45,
				commenter: 45,
				comment_average: 45,
				agree: 45
			}, {
				img: "../../../images/xiaode.jpg",
				title: "冬日恋歌",
				visited: 45,
				visitor: 45,
				visited_average: 45,
				signed: 45,
				rate: "60%",
				comment: 45,
				commenter: 45,
				comment_average: 45,
				agree: 45
			}, {
				img: "../../../images/xiaode.jpg",
				title: "冬日恋歌",
				visited: 45,
				visitor: 45,
				visited_average: 45,
				signed: 45,
				rate: "60%",
				comment: 45,
				commenter: 45,
				comment_average: 45,
				agree: 45
			}, {
				img: "../../../images/xiaode.jpg",
				title: "冬日恋歌",
				visited: 45,
				visitor: 45,
				visited_average: 45,
				signed: 45,
				rate: "60%",
				comment: 45,
				commenter: 45,
				comment_average: 45,
				agree: 45
			}];
			_this.state = {
				activity_data: data
			};
			return _this;
		}

		_createClass(Activity_Grow, [{
			key: "componentDidMount",
			value: function componentDidMount() {
				/*初始化活动增长数据(默认获取近七天)*/
				_superagent2.default.get("/initActivityGrow").end(function (err, res) {
					if (err || !res.ok) {
						console.log(err);
						console.log(res);
						return false;
					};
					console.log("初始化活动增长数据");
				});
			}

			/*select选择日期时的执行此回调*/

		}, {
			key: "onSelectDate",
			value: function onSelectDate(value) {
				_superagent2.default.get("/getActivityByDate").accept('application/json') /*接收什么类型的数据*/
				.query({ SelectDate: value }).end(function (err, res) {
					if (err || !res.ok) {
						console.log(err);
						console.log(res);
						return false;
					};
					console.log("选择加载:  " + value + "  的数据");
				});
			}
		}, {
			key: "render",
			value: function render() {
				var _this2 = this;

				return _react2.default.createElement(
					"div",
					{ className: "activity_flow" },
					_react2.default.createElement(
						"div",
						{ className: "activity_flow_title" },
						"流量统计"
					),
					_react2.default.createElement(
						"div",
						{ className: "date_option" },
						_react2.default.createElement(
							"label",
							null,
							"活动发布时间"
						),
						_react2.default.createElement(
							_select2.default,
							{ initValue: "最近七天", onSelectOption: function onSelectOption(value) {
									return _this2.onSelectDate(value);
								} },
							_react2.default.createElement("div", { option: "最近七天" }),
							_react2.default.createElement("div", { option: "最近十四天" })
						),
						_react2.default.createElement(
							"div",
							{ className: "note" },
							"注:转化率=报名人数/阅读人数"
						)
					),
					_react2.default.createElement(
						"div",
						{ className: "activities" },
						this.state.activity_data.map(function (element, index) {
							return _react2.default.createElement(
								"div",
								{ className: "activities_item", key: index },
								_react2.default.createElement(
									"div",
									{ className: "activities_item_title_and_img" },
									_react2.default.createElement(
										"div",
										{ className: "activities_item_img" },
										_react2.default.createElement("img", { src: element.img })
									),
									_react2.default.createElement(
										"div",
										{ className: "activities_item_title" },
										_react2.default.createElement(
											"h2",
											null,
											element.title
										)
									)
								),
								_react2.default.createElement(
									"div",
									{ className: "activities_item_flow" },
									_react2.default.createElement(
										"div",
										{ className: "flow_stats" },
										_react2.default.createElement(
											"div",
											{ className: "flow_stats_left" },
											_react2.default.createElement(
												"div",
												null,
												_react2.default.createElement(
													"label",
													null,
													"阅读次数"
												),
												_react2.default.createElement(
													"span",
													null,
													element.visited
												)
											),
											_react2.default.createElement(
												"div",
												null,
												_react2.default.createElement(
													"label",
													null,
													"阅读人数"
												),
												_react2.default.createElement(
													"span",
													null,
													element.visitor
												)
											),
											_react2.default.createElement(
												"div",
												null,
												_react2.default.createElement(
													"label",
													null,
													"人均阅读次数"
												),
												_react2.default.createElement(
													"span",
													null,
													element.visited_average
												)
											),
											_react2.default.createElement(
												"div",
												null,
												_react2.default.createElement(
													"label",
													null,
													"报名人数"
												),
												_react2.default.createElement(
													"span",
													null,
													element.signed
												)
											),
											_react2.default.createElement(
												"div",
												null,
												_react2.default.createElement(
													"label",
													null,
													"转化率"
												),
												_react2.default.createElement(
													"span",
													null,
													element.rate
												)
											)
										),
										_react2.default.createElement(
											"div",
											{ className: "flow_stats_right" },
											_react2.default.createElement(
												"div",
												null,
												_react2.default.createElement(
													"label",
													null,
													"评论次数"
												),
												_react2.default.createElement(
													"span",
													null,
													element.comment
												)
											),
											_react2.default.createElement(
												"div",
												null,
												_react2.default.createElement(
													"label",
													null,
													"评论人数"
												),
												_react2.default.createElement(
													"span",
													null,
													element.commenter
												)
											),
											_react2.default.createElement(
												"div",
												null,
												_react2.default.createElement(
													"label",
													null,
													"人均评论次数"
												),
												_react2.default.createElement(
													"span",
													null,
													element.comment_average
												)
											),
											_react2.default.createElement(
												"div",
												null,
												_react2.default.createElement(
													"label",
													null,
													"点赞人数"
												),
												_react2.default.createElement(
													"span",
													null,
													element.agree
												)
											)
										)
									)
								)
							);
						})
					)
				);
			}
		}]);

		return Activity_Grow;
	}(_react2.default.Component);

	;

	exports.default = Activity_Grow;

/***/ },

/***/ 881:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(882);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(251)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./activity_grow.css", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./activity_grow.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 882:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(250)();
	// imports


	// module
	exports.push([module.id, ".activity_flow_title{\r\n\tcolor:#434343;\r\n}\r\n/* 日期下拉样式补充*/\r\n.activity_flow .date_option{\r\n\twidth:100%;\r\n\theight:80px;\r\n\t/*border:1px solid #b6b6b6;*/\r\n}\r\n.activity_flow .date_option label{\r\n\tcolor:#434343;\r\n\tfont-size:15px;\r\n\tmargin-right:25px;\r\n\tmargin-top:20px;\r\n}\r\n.activity_flow .date_option .select{\r\n\tdisplay:inline-block;\r\n\tmargin-top:20px;\r\n}\r\n/* 日期下拉样式补充-end*/\r\n.activity_flow .note{\r\n\tdisplay:inline-block;\r\n\tfont-size:14px;\r\n\tcolor:#5a5a5a;\r\n\tfloat: right;\r\n\tmargin-right:20px;\r\n\tmargin-top:30px;\r\n}\r\n/*活动统计*/\r\n.activity_flow .activities_item{\r\n\twidth:100%;\r\n\theight:185px;\r\n\tmargin-top:5px;\r\n\tmargin-bottom:20px;\r\n\tborder:1px solid #e0e0e0;\r\n}\r\n\t/*左边图片和标题部分*/\r\n.activity_flow .activities_item_title_and_img{\r\n\twidth:40%;\r\n\theight:100%;\r\n\tfloat: left;\r\n}\r\n.activity_flow .activities_item_img{\r\n\twidth:50%;\r\n\theight:100%;\r\n\tfloat:left;\r\n}\r\n.activity_flow .activities_item_img img{\r\n\twidth:140px;\r\n\theight:140px;\r\n\tmargin-top:22px;\r\n\tmargin-left: 15px;\r\n}\r\n.activity_flow .activities_item_title{\r\n\twidth:50%;\r\n\theight:100%;\r\n\tfloat:right;\r\n\tline-height:100%;\r\n}\r\n.activity_flow .activities_item_title h2{\r\n\tfont-size:22px;\r\n\tcolor:#434343;\r\n\tmargin-top: 20px;\r\n\tmargin-left:10px;\r\n}\r\n\t/*左边图片和标题部分-end*/\r\n\r\n\t/*右边统计数值部分*/\r\n.activity_flow .activities_item_flow{\r\n\twidth:35%;\r\n\theight:100%;\r\n\tfloat:left;\r\n}\r\n.activity_flow .flow_stats{\r\n\twidth:100%;\r\n\theight:100%;\r\n}\r\n.activity_flow .flow_stats_left{\r\n\twidth:45%;\r\n\theight:100%;\r\n\tfloat:left;\r\n\tmargin-right: 10%;\r\n}\r\n.activity_flow .flow_stats_right{\r\n\twidth:45%;\r\n\theight:100%;\r\n\tfloat:right;\r\n}\r\n.activity_flow .flow_stats_left div{\r\n\twidth:100%;\r\n\theight:20px;\r\n\tmargin-top:15px;\r\n}\r\n.activity_flow .flow_stats_right div{\r\n\twidth:100%;\r\n\theight:20px;\r\n\tmargin-top:15px;\r\n}\r\n.activity_flow .flow_stats div label{\r\n\tfont-size:14px;\r\n\tcolor:#666;\r\n\tfloat:left;\r\n}\r\n.activity_flow .flow_stats div span{\r\n\tcolor:#434343;\r\n\tfont-size:14px;\r\n\tfloat:right;\r\n}\r\n\t/*右边统计数值部分-end*/\r\n/*活动统计-end'*/", ""]);

	// exports


/***/ }

});