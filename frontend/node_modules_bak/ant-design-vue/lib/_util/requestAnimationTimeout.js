"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requestAnimationTimeout = exports.cancelAnimationTimeout = void 0;
var _getRequestAnimationFrame = _interopRequireWildcard(require("./getRequestAnimationFrame"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const raf = (0, _getRequestAnimationFrame.default)();
const cancelAnimationTimeout = frame => (0, _getRequestAnimationFrame.cancelRequestAnimationFrame)(frame.id);
exports.cancelAnimationTimeout = cancelAnimationTimeout;
const requestAnimationTimeout = function (callback) {
  let delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  const start = Date.now();
  function timeout() {
    if (Date.now() - start >= delay) {
      callback.call();
    } else {
      frame.id = raf(timeout);
    }
  }
  const frame = {
    id: raf(timeout)
  };
  return frame;
};
exports.requestAnimationTimeout = requestAnimationTimeout;