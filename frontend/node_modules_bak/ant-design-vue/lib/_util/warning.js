"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.noop = noop;
Object.defineProperty(exports, "resetWarned", {
  enumerable: true,
  get: function () {
    return _warning.resetWarned;
  }
});
var _warning = _interopRequireWildcard(require("../vc-util/warning"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function noop() {}
// eslint-disable-next-line import/no-mutable-exports
let warning = noop;
if (process.env.NODE_ENV !== 'production') {
  warning = (valid, component, message) => {
    (0, _warning.default)(valid, `[ant-design-vue: ${component}] ${message}`);
    // StrictMode will inject console which will not throw warning in React 17.
    if (process.env.NODE_ENV === 'test') {
      (0, _warning.resetWarned)();
    }
  };
}
var _default = exports.default = warning;