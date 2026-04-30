"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Modal = _interopRequireDefault(require("./Modal"));
var _confirm = _interopRequireWildcard(require("./confirm"));
var _useModal = _interopRequireDefault(require("./useModal"));
var _destroyFns = _interopRequireDefault(require("./destroyFns"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function modalWarn(props) {
  return (0, _confirm.default)((0, _confirm.withWarn)(props));
}
_Modal.default.useModal = _useModal.default;
_Modal.default.info = function infoFn(props) {
  return (0, _confirm.default)((0, _confirm.withInfo)(props));
};
_Modal.default.success = function successFn(props) {
  return (0, _confirm.default)((0, _confirm.withSuccess)(props));
};
_Modal.default.error = function errorFn(props) {
  return (0, _confirm.default)((0, _confirm.withError)(props));
};
_Modal.default.warning = modalWarn;
_Modal.default.warn = modalWarn;
_Modal.default.confirm = function confirmFn(props) {
  return (0, _confirm.default)((0, _confirm.withConfirm)(props));
};
_Modal.default.destroyAll = function destroyAllFn() {
  while (_destroyFns.default.length) {
    const close = _destroyFns.default.pop();
    if (close) {
      close();
    }
  }
};
/* istanbul ignore next */
_Modal.default.install = function (app) {
  app.component(_Modal.default.name, _Modal.default);
  return app;
};
var _default = exports.default = _Modal.default;