"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  install: true,
  version: true,
  cssinjs: true,
  theme: true
};
Object.defineProperty(exports, "cssinjs", {
  enumerable: true,
  get: function () {
    return _cssinjs.default;
  }
});
exports.install = exports.default = void 0;
Object.defineProperty(exports, "theme", {
  enumerable: true,
  get: function () {
    return _theme.default;
  }
});
Object.defineProperty(exports, "version", {
  enumerable: true,
  get: function () {
    return _version.default;
  }
});
var components = _interopRequireWildcard(require("./components"));
Object.keys(components).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === components[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return components[key];
    }
  });
});
var _version = _interopRequireDefault(require("./version"));
var _cssinjs = _interopRequireWildcard(require("./_util/cssinjs"));
Object.keys(_cssinjs).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _cssinjs[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _cssinjs[key];
    }
  });
});
var _theme = _interopRequireDefault(require("./theme"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const install = function (app) {
  Object.keys(components).forEach(key => {
    const component = components[key];
    if (component.install) {
      app.use(component);
    }
  });
  app.use(_cssinjs.default.StyleProvider);
  app.config.globalProperties.$message = components.message;
  app.config.globalProperties.$notification = components.notification;
  app.config.globalProperties.$info = components.Modal.info;
  app.config.globalProperties.$success = components.Modal.success;
  app.config.globalProperties.$error = components.Modal.error;
  app.config.globalProperties.$warning = components.Modal.warning;
  app.config.globalProperties.$confirm = components.Modal.confirm;
  app.config.globalProperties.$destroyAll = components.Modal.destroyAll;
  return app;
};
exports.install = install;
var _default = exports.default = {
  version: _version.default,
  install
};