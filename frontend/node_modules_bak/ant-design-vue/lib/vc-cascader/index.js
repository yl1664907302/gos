"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "SHOW_CHILD", {
  enumerable: true,
  get: function () {
    return _Cascader.SHOW_CHILD;
  }
});
Object.defineProperty(exports, "SHOW_PARENT", {
  enumerable: true,
  get: function () {
    return _Cascader.SHOW_PARENT;
  }
});
Object.defineProperty(exports, "cascaderProps", {
  enumerable: true,
  get: function () {
    return _Cascader.internalCascaderProps;
  }
});
exports.default = void 0;
var _Cascader = _interopRequireWildcard(require("./Cascader"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// rc-cascader@3.4.2
var _default = exports.default = _Cascader.default;