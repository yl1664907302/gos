"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _vcResizeObserver = _interopRequireDefault(require("../vc-resize-observer"));
const Filter = (_ref, _ref2) => {
  let {
    height,
    offset,
    prefixCls,
    onInnerResize
  } = _ref;
  let {
    slots
  } = _ref2;
  var _a;
  let outerStyle = {};
  let innerStyle = {
    display: 'flex',
    flexDirection: 'column'
  };
  if (offset !== undefined) {
    outerStyle = {
      height: `${height}px`,
      position: 'relative',
      overflow: 'hidden'
    };
    innerStyle = (0, _extends2.default)((0, _extends2.default)({}, innerStyle), {
      transform: `translateY(${offset}px)`,
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0
    });
  }
  return (0, _vue.createVNode)("div", {
    "style": outerStyle
  }, [(0, _vue.createVNode)(_vcResizeObserver.default, {
    "onResize": _ref3 => {
      let {
        offsetHeight
      } = _ref3;
      if (offsetHeight && onInnerResize) {
        onInnerResize();
      }
    }
  }, {
    default: () => [(0, _vue.createVNode)("div", {
      "style": innerStyle,
      "class": (0, _classNames.default)({
        [`${prefixCls}-holder-inner`]: prefixCls
      })
    }, [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)])]
  })]);
};
Filter.displayName = 'Filter';
Filter.inheritAttrs = false;
Filter.props = {
  prefixCls: String,
  /** Virtual filler height. Should be `count * itemMinHeight` */
  height: Number,
  /** Set offset of visible items. Should be the top of start item position */
  offset: Number,
  onInnerResize: Function
};
var _default = exports.default = Filter;