"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _button = _interopRequireDefault(require("../button"));
const PickerButton = (props, _ref) => {
  let {
    attrs,
    slots
  } = _ref;
  return (0, _vue.createVNode)(_button.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({
    "size": "small",
    "type": "primary"
  }, props), attrs), slots);
};
var _default = exports.default = PickerButton;