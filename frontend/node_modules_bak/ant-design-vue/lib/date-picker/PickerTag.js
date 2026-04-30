"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = PickerTag;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _tag = _interopRequireDefault(require("../tag"));
function PickerTag(props, _ref) {
  let {
    slots,
    attrs
  } = _ref;
  return (0, _vue.createVNode)(_tag.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({
    "color": "blue"
  }, props), attrs), slots);
}