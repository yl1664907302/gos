"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.MiddleSelect = void 0;
var _vue = require("vue");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _select = _interopRequireWildcard(require("../select"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
var _default = exports.default = (0, _vue.defineComponent)({
  name: 'MiniSelect',
  compatConfig: {
    MODE: 3
  },
  inheritAttrs: false,
  props: (0, _select.selectProps)(),
  Option: _select.default.Option,
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    return () => {
      const selelctProps = (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, props), {
        size: 'small'
      }), attrs);
      return (0, _vue.createVNode)(_select.default, selelctProps, slots);
    };
  }
});
const MiddleSelect = exports.MiddleSelect = (0, _vue.defineComponent)({
  name: 'MiddleSelect',
  inheritAttrs: false,
  props: (0, _select.selectProps)(),
  Option: _select.default.Option,
  setup(props, _ref2) {
    let {
      attrs,
      slots
    } = _ref2;
    return () => {
      const selelctProps = (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, props), {
        size: 'middle'
      }), attrs);
      return (0, _vue.createVNode)(_select.default, selelctProps, slots);
    };
  }
});