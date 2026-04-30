"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _DefaultPanel = _interopRequireDefault(require("./DefaultPanel"));
var _interface = require("../interface");
const TourStep = (0, _vue.defineComponent)({
  name: 'TourStep',
  inheritAttrs: false,
  props: (0, _interface.tourStepProps)(),
  setup(props, _ref) {
    let {
      attrs
    } = _ref;
    return () => {
      const {
        current,
        renderPanel
      } = props;
      return (0, _vue.createVNode)(_vue.Fragment, null, [typeof renderPanel === 'function' ? renderPanel((0, _extends2.default)((0, _extends2.default)({}, attrs), props), current) : (0, _vue.createVNode)(_DefaultPanel.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), props), null)]);
    };
  }
});
var _default = exports.default = TourStep;