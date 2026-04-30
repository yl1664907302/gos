"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _transition = require("../_util/transition");
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'DialogMask',
  props: {
    prefixCls: String,
    visible: Boolean,
    motionName: String,
    maskProps: Object
  },
  setup(props, _ref) {
    let {} = _ref;
    return () => {
      const {
        prefixCls,
        visible,
        maskProps,
        motionName
      } = props;
      const transitionProps = (0, _transition.getTransitionProps)(motionName);
      return (0, _vue.createVNode)(_vue.Transition, transitionProps, {
        default: () => [(0, _vue.withDirectives)((0, _vue.createVNode)("div", (0, _objectSpread2.default)({
          "class": `${prefixCls}-mask`
        }, maskProps), null), [[_vue.vShow, visible]])]
      });
    };
  }
});