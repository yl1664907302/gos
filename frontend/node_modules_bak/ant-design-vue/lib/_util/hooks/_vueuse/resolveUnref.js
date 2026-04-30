"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveUnref = resolveUnref;
var _vue = require("vue");
/**
 * Get the value of value/ref/getter.
 */
function resolveUnref(r) {
  return typeof r === 'function' ? r() : (0, _vue.unref)(r);
}