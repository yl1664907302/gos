"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasAddon = hasAddon;
exports.hasPrefixSuffix = hasPrefixSuffix;
var _propsUtil = require("../_util/props-util");
const isValid = value => {
  return value !== undefined && value !== null && (Array.isArray(value) ? (0, _propsUtil.filterEmpty)(value).length : true);
};
function hasPrefixSuffix(propsAndSlots) {
  return isValid(propsAndSlots.prefix) || isValid(propsAndSlots.suffix) || isValid(propsAndSlots.allowClear);
}
function hasAddon(propsAndSlots) {
  return isValid(propsAndSlots.addonBefore) || isValid(propsAndSlots.addonAfter);
}