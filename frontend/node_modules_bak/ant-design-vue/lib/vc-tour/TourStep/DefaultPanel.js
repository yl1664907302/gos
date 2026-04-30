"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _classNames = _interopRequireDefault(require("../../_util/classNames"));
var _interface = require("../interface");
const DefaultPanel = (0, _vue.defineComponent)({
  name: 'DefaultPanel',
  inheritAttrs: false,
  props: (0, _interface.tourStepProps)(),
  setup(props, _ref) {
    let {
      attrs
    } = _ref;
    return () => {
      const {
        prefixCls,
        current,
        total,
        title,
        description,
        onClose,
        onPrev,
        onNext,
        onFinish
      } = props;
      return (0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "class": (0, _classNames.default)(`${prefixCls}-content`, attrs.class)
      }), [(0, _vue.createVNode)("div", {
        "class": `${prefixCls}-inner`
      }, [(0, _vue.createVNode)("button", {
        "type": "button",
        "onClick": onClose,
        "aria-label": "Close",
        "class": `${prefixCls}-close`
      }, [(0, _vue.createVNode)("span", {
        "class": `${prefixCls}-close-x`
      }, [(0, _vue.createTextVNode)("\xD7")])]), (0, _vue.createVNode)("div", {
        "class": `${prefixCls}-header`
      }, [(0, _vue.createVNode)("div", {
        "class": `${prefixCls}-title`
      }, [title])]), (0, _vue.createVNode)("div", {
        "class": `${prefixCls}-description`
      }, [description]), (0, _vue.createVNode)("div", {
        "class": `${prefixCls}-footer`
      }, [(0, _vue.createVNode)("div", {
        "class": `${prefixCls}-sliders`
      }, [total > 1 ? [...Array.from({
        length: total
      }).keys()].map((item, index) => {
        return (0, _vue.createVNode)("span", {
          "key": item,
          "class": index === current ? 'active' : ''
        }, null);
      }) : null]), (0, _vue.createVNode)("div", {
        "class": `${prefixCls}-buttons`
      }, [current !== 0 ? (0, _vue.createVNode)("button", {
        "class": `${prefixCls}-prev-btn`,
        "onClick": onPrev
      }, [(0, _vue.createTextVNode)("Prev")]) : null, current === total - 1 ? (0, _vue.createVNode)("button", {
        "class": `${prefixCls}-finish-btn`,
        "onClick": onFinish
      }, [(0, _vue.createTextVNode)("Finish")]) : (0, _vue.createVNode)("button", {
        "class": `${prefixCls}-next-btn`,
        "onClick": onNext
      }, [(0, _vue.createTextVNode)("Next")])])])])]);
    };
  }
});
var _default = exports.default = DefaultPanel;