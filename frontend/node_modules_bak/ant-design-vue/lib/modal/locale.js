"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.changeConfirmLocale = changeConfirmLocale;
exports.getConfirmLocale = getConfirmLocale;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _en_US = _interopRequireDefault(require("../locale/en_US"));
let runtimeLocale = (0, _extends2.default)({}, _en_US.default.Modal);
function changeConfirmLocale(newLocale) {
  if (newLocale) {
    runtimeLocale = (0, _extends2.default)((0, _extends2.default)({}, runtimeLocale), newLocale);
  } else {
    runtimeLocale = (0, _extends2.default)({}, _en_US.default.Modal);
  }
}
function getConfirmLocale() {
  return runtimeLocale;
}