"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function canUseDom() {
  return !!(typeof window !== 'undefined' && window.document && window.document.createElement);
}
var _default = exports.default = canUseDom;