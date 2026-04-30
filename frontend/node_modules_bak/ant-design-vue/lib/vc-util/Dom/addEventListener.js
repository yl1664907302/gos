"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = addEventListenerWrap;
var _supportsPassive = _interopRequireDefault(require("../../_util/supportsPassive"));
function addEventListenerWrap(target, eventType, cb, option) {
  if (target && target.addEventListener) {
    let opt = option;
    if (opt === undefined && _supportsPassive.default && (eventType === 'touchstart' || eventType === 'touchmove' || eventType === 'wheel')) {
      opt = {
        passive: false
      };
    }
    target.addEventListener(eventType, cb, opt);
  }
  return {
    remove: () => {
      if (target && target.removeEventListener) {
        target.removeEventListener(eventType, cb);
      }
    }
  };
}