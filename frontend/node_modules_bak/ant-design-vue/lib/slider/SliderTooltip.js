"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _tooltip = _interopRequireWildcard(require("../tooltip"));
var _raf = _interopRequireDefault(require("../_util/raf"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'SliderTooltip',
  inheritAttrs: false,
  props: (0, _tooltip.tooltipProps)(),
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const innerRef = (0, _vue.ref)(null);
    const rafRef = (0, _vue.ref)(null);
    function cancelKeepAlign() {
      _raf.default.cancel(rafRef.value);
      rafRef.value = null;
    }
    function keepAlign() {
      rafRef.value = (0, _raf.default)(() => {
        var _a;
        (_a = innerRef.value) === null || _a === void 0 ? void 0 : _a.forcePopupAlign();
        rafRef.value = null;
      });
    }
    const align = () => {
      cancelKeepAlign();
      if (props.open) {
        keepAlign();
      }
    };
    (0, _vue.watch)([() => props.open, () => props.title], () => {
      align();
    }, {
      flush: 'post',
      immediate: true
    });
    (0, _vue.onActivated)(() => {
      align();
    });
    (0, _vue.onBeforeUnmount)(() => {
      cancelKeepAlign();
    });
    return () => {
      return (0, _vue.createVNode)(_tooltip.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({
        "ref": innerRef
      }, props), attrs), slots);
    };
  }
});