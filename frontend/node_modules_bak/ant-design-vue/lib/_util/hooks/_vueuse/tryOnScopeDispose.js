"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tryOnScopeDispose = tryOnScopeDispose;
var _vue = require("vue");
/**
 * Call onScopeDispose() if it's inside a effect scope lifecycle, if not, do nothing
 *
 * @param fn
 */
function tryOnScopeDispose(fn) {
  if ((0, _vue.getCurrentScope)()) {
    (0, _vue.onScopeDispose)(fn);
    return true;
  }
  return false;
}