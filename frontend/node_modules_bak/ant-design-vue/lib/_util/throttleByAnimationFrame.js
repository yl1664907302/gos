"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _raf = _interopRequireDefault(require("./raf"));
function throttleByAnimationFrame(fn) {
  let requestId;
  const later = args => () => {
    requestId = null;
    fn(...args);
  };
  const throttled = function () {
    if (requestId == null) {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      requestId = (0, _raf.default)(later(args));
    }
  };
  throttled.cancel = () => {
    _raf.default.cancel(requestId);
    requestId = null;
  };
  return throttled;
}
var _default = exports.default = throttleByAnimationFrame;