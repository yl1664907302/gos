"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _warning = require("../../vc-util/warning");
var _valueUtil = require("./valueUtil");
function warningProps(props) {
  const {
    searchPlaceholder,
    treeCheckStrictly,
    treeCheckable,
    labelInValue,
    value,
    multiple
  } = props;
  (0, _warning.warning)(!searchPlaceholder, '`searchPlaceholder` has been removed, please use `placeholder` instead');
  if (treeCheckStrictly && labelInValue === false) {
    (0, _warning.warning)(false, '`treeCheckStrictly` will force set `labelInValue` to `true`.');
  }
  if (labelInValue || treeCheckStrictly) {
    (0, _warning.warning)((0, _valueUtil.toArray)(value).every(val => val && typeof val === 'object' && 'value' in val), 'Invalid prop `value` supplied to `TreeSelect`. You should use { label: string, value: string | number } or [{ label: string, value: string | number }] instead.');
  }
  if (treeCheckStrictly || multiple || treeCheckable) {
    (0, _warning.warning)(!value || Array.isArray(value), '`value` should be an array when `TreeSelect` is checkable or multiple.');
  } else {
    (0, _warning.warning)(!Array.isArray(value), '`value` should not be array when `TreeSelect` is single mode.');
  }
}
var _default = exports.default = warningProps;