"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.LayoutSider = exports.LayoutHeader = exports.LayoutFooter = exports.LayoutContent = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _layout = _interopRequireWildcard(require("./layout"));
var _Sider = _interopRequireDefault(require("./Sider"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/* istanbul ignore next */
const LayoutHeader = exports.LayoutHeader = _layout.Header;
const LayoutFooter = exports.LayoutFooter = _layout.Footer;
const LayoutSider = exports.LayoutSider = _Sider.default;
const LayoutContent = exports.LayoutContent = _layout.Content;
var _default = exports.default = (0, _extends2.default)(_layout.default, {
  Header: _layout.Header,
  Footer: _layout.Footer,
  Content: _layout.Content,
  Sider: _Sider.default,
  install: app => {
    app.component(_layout.default.name, _layout.default);
    app.component(_layout.Header.name, _layout.Header);
    app.component(_layout.Footer.name, _layout.Footer);
    app.component(_Sider.default.name, _Sider.default);
    app.component(_layout.Content.name, _layout.Content);
    return app;
  }
});