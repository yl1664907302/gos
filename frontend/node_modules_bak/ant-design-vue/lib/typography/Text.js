"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.textProps = exports.default = void 0;
var _vue = require("vue");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _omit = _interopRequireDefault(require("../_util/omit"));
var _warning = _interopRequireDefault(require("../_util/warning"));
var _Base = _interopRequireWildcard(require("./Base"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const textProps = () => (0, _extends2.default)((0, _extends2.default)({}, (0, _omit.default)((0, _Base.baseProps)(), ['component'])), {
  ellipsis: {
    type: [Boolean, Object],
    default: undefined
  }
});
exports.textProps = textProps;
const Text = (props, _ref) => {
  let {
    slots,
    attrs
  } = _ref;
  const {
    ellipsis
  } = props;
  (0, _warning.default)(typeof ellipsis !== 'object' || !ellipsis || !('expandable' in ellipsis) && !('rows' in ellipsis), 'Typography.Text', '`ellipsis` do not support `expandable` or `rows` props.');
  const textProps = (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, props), {
    ellipsis: ellipsis && typeof ellipsis === 'object' ? (0, _omit.default)(ellipsis, ['expandable', 'rows']) : ellipsis,
    component: 'span'
  }), attrs);
  return (0, _vue.createVNode)(_Base.default, textProps, slots);
};
Text.displayName = 'ATypographyText';
Text.inheritAttrs = false;
Text.props = textProps();
var _default = exports.default = Text;