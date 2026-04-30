"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unrefElement = unrefElement;
var _resolveUnref = require("./resolveUnref");
/**
 * Get the dom element of a ref of element or Vue component instance
 *
 * @param elRef
 */
function unrefElement(elRef) {
  var _a;
  const plain = (0, _resolveUnref.resolveUnref)(elRef);
  return (_a = plain === null || plain === void 0 ? void 0 : plain.$el) !== null && _a !== void 0 ? _a : plain;
}