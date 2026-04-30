"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Mask;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _motionUtil = require("../utils/motionUtil");
function Mask(props) {
  const {
    prefixCls,
    visible,
    zIndex,
    mask,
    maskAnimation,
    maskTransitionName
  } = props;
  if (!mask) {
    return null;
  }
  let motion = {};
  if (maskTransitionName || maskAnimation) {
    motion = (0, _motionUtil.getMotion)({
      prefixCls,
      transitionName: maskTransitionName,
      animation: maskAnimation
    });
  }
  return (0, _vue.createVNode)(_vue.Transition, (0, _objectSpread2.default)({
    "appear": true
  }, motion), {
    default: () => [(0, _vue.withDirectives)((0, _vue.createVNode)("div", {
      "style": {
        zIndex
      },
      "class": `${prefixCls}-mask`
    }, null), [[(0, _vue.resolveDirective)("if"), visible]])]
  });
}
Mask.displayName = 'Mask';