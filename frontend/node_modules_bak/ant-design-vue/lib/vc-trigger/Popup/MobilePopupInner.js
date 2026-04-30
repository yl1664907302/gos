"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _propsUtil = require("../../_util/props-util");
var _classNames = _interopRequireDefault(require("../../_util/classNames"));
var _interface = require("./interface");
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'MobilePopupInner',
  inheritAttrs: false,
  props: _interface.mobileProps,
  emits: ['mouseenter', 'mouseleave', 'mousedown', 'touchstart', 'align'],
  setup(props, _ref) {
    let {
      expose,
      slots
    } = _ref;
    const elementRef = (0, _vue.ref)();
    expose({
      forceAlign: () => {},
      getElement: () => elementRef.value
    });
    return () => {
      var _a;
      const {
        zIndex,
        visible,
        prefixCls,
        mobile: {
          popupClassName,
          popupStyle,
          popupMotion = {},
          popupRender
        } = {}
      } = props;
      // ======================== Render ========================
      const mergedStyle = (0, _extends2.default)({
        zIndex
      }, popupStyle);
      let childNode = (0, _propsUtil.flattenChildren)((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots));
      // Wrapper when multiple children
      if (childNode.length > 1) {
        const _childNode = function () {
          return childNode;
        }();
        childNode = (0, _vue.createVNode)("div", {
          "class": `${prefixCls}-content`
        }, [childNode]);
      }
      // Mobile support additional render
      if (popupRender) {
        childNode = popupRender(childNode);
      }
      const mergedClassName = (0, _classNames.default)(prefixCls, popupClassName);
      return (0, _vue.createVNode)(_vue.Transition, (0, _objectSpread2.default)({
        "ref": elementRef
      }, popupMotion), {
        default: () => [visible ? (0, _vue.createVNode)("div", {
          "class": mergedClassName,
          "style": mergedStyle
        }, [childNode]) : null]
      });
    };
  }
});