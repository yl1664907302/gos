"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _LeftOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/LeftOutlined"));
var _RightOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/RightOutlined"));
var _button = _interopRequireDefault(require("../button"));
function noop() {}
const Operation = props => {
  const {
    disabled,
    moveToLeft = noop,
    moveToRight = noop,
    leftArrowText = '',
    rightArrowText = '',
    leftActive,
    rightActive,
    class: className,
    style,
    direction,
    oneWay
  } = props;
  return (0, _vue.createVNode)("div", {
    "class": className,
    "style": style
  }, [(0, _vue.createVNode)(_button.default, {
    "type": "primary",
    "size": "small",
    "disabled": disabled || !rightActive,
    "onClick": moveToRight,
    "icon": direction !== 'rtl' ? (0, _vue.createVNode)(_RightOutlined.default, null, null) : (0, _vue.createVNode)(_LeftOutlined.default, null, null)
  }, {
    default: () => [rightArrowText]
  }), !oneWay && (0, _vue.createVNode)(_button.default, {
    "type": "primary",
    "size": "small",
    "disabled": disabled || !leftActive,
    "onClick": moveToLeft,
    "icon": direction !== 'rtl' ? (0, _vue.createVNode)(_LeftOutlined.default, null, null) : (0, _vue.createVNode)(_RightOutlined.default, null, null)
  }, {
    default: () => [leftArrowText]
  })]);
};
Operation.displayName = 'Operation';
Operation.inheritAttrs = false;
var _default = exports.default = Operation;