"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "CollapsePanel", {
  enumerable: true,
  get: function () {
    return _CollapsePanel.default;
  }
});
Object.defineProperty(exports, "collapsePanelProps", {
  enumerable: true,
  get: function () {
    return _CollapsePanel.collapsePanelProps;
  }
});
Object.defineProperty(exports, "collapseProps", {
  enumerable: true,
  get: function () {
    return _Collapse.collapseProps;
  }
});
exports.default = void 0;
var _Collapse = _interopRequireWildcard(require("./Collapse"));
var _CollapsePanel = _interopRequireWildcard(require("./CollapsePanel"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
_Collapse.default.Panel = _CollapsePanel.default;
/* istanbul ignore next */
_Collapse.default.install = function (app) {
  app.component(_Collapse.default.name, _Collapse.default);
  app.component(_CollapsePanel.default.name, _CollapsePanel.default);
  return app;
};
var _default = exports.default = _Collapse.default;