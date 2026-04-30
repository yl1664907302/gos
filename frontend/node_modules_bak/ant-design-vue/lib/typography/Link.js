"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.linkProps = exports.default = void 0;
var _vue = require("vue");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _warning = _interopRequireDefault(require("../_util/warning"));
var _Base = _interopRequireWildcard(require("./Base"));
var _omit = _interopRequireDefault(require("../_util/omit"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const linkProps = () => (0, _omit.default)((0, _extends2.default)((0, _extends2.default)({}, (0, _Base.baseProps)()), {
  ellipsis: {
    type: Boolean,
    default: undefined
  }
}), ['component']);
exports.linkProps = linkProps;
const Link = (props, _ref) => {
  let {
    slots,
    attrs
  } = _ref;
  const _a = (0, _extends2.default)((0, _extends2.default)({}, props), attrs),
    {
      ellipsis,
      rel
    } = _a,
    restProps = __rest(_a, ["ellipsis", "rel"]);
  (0, _warning.default)(typeof ellipsis !== 'object', 'Typography.Link', '`ellipsis` only supports boolean value.');
  const mergedProps = (0, _extends2.default)((0, _extends2.default)({}, restProps), {
    rel: rel === undefined && restProps.target === '_blank' ? 'noopener noreferrer' : rel,
    ellipsis: !!ellipsis,
    component: 'a'
  });
  // https://github.com/ant-design/ant-design/issues/26622
  // @ts-ignore
  delete mergedProps.navigate;
  return (0, _vue.createVNode)(_Base.default, mergedProps, slots);
};
Link.displayName = 'ATypographyLink';
Link.inheritAttrs = false;
Link.props = linkProps();
var _default = exports.default = Link;