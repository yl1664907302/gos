"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ribbonProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _style = _interopRequireDefault(require("./style"));
var _colors = require("../_util/colors");
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const ribbonProps = () => ({
  prefix: String,
  color: {
    type: String
  },
  text: _vueTypes.default.any,
  placement: {
    type: String,
    default: 'end'
  }
});
exports.ribbonProps = ribbonProps;
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ABadgeRibbon',
  inheritAttrs: false,
  props: ribbonProps(),
  slots: Object,
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const {
      prefixCls,
      direction
    } = (0, _useConfigInject.default)('ribbon', props);
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const colorInPreset = (0, _vue.computed)(() => (0, _colors.isPresetColor)(props.color, false));
    const ribbonCls = (0, _vue.computed)(() => [prefixCls.value, `${prefixCls.value}-placement-${props.placement}`, {
      [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
      [`${prefixCls.value}-color-${props.color}`]: colorInPreset.value
    }]);
    return () => {
      var _a, _b;
      const {
          class: className,
          style
        } = attrs,
        restAttrs = __rest(attrs, ["class", "style"]);
      const colorStyle = {};
      const cornerColorStyle = {};
      if (props.color && !colorInPreset.value) {
        colorStyle.background = props.color;
        cornerColorStyle.color = props.color;
      }
      return wrapSSR((0, _vue.createVNode)("div", (0, _objectSpread2.default)({
        "class": `${prefixCls.value}-wrapper ${hashId.value}`
      }, restAttrs), [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots), (0, _vue.createVNode)("div", {
        "class": [ribbonCls.value, className, hashId.value],
        "style": (0, _extends2.default)((0, _extends2.default)({}, colorStyle), style)
      }, [(0, _vue.createVNode)("span", {
        "class": `${prefixCls.value}-text`
      }, [props.text || ((_b = slots.text) === null || _b === void 0 ? void 0 : _b.call(slots))]), (0, _vue.createVNode)("div", {
        "class": `${prefixCls.value}-corner`,
        "style": cornerColorStyle
      }, null)])]));
    };
  }
});