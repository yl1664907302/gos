"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "AvatarGroup", {
  enumerable: true,
  get: function () {
    return _Group.default;
  }
});
Object.defineProperty(exports, "avatarProps", {
  enumerable: true,
  get: function () {
    return _Avatar.avatarProps;
  }
});
exports.default = void 0;
var _Avatar = _interopRequireWildcard(require("./Avatar"));
var _Group = _interopRequireDefault(require("./Group"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
_Avatar.default.Group = _Group.default;
/* istanbul ignore next */
_Avatar.default.install = function (app) {
  app.component(_Avatar.default.name, _Avatar.default);
  app.component(_Group.default.name, _Group.default);
  return app;
};
var _default = exports.default = _Avatar.default;