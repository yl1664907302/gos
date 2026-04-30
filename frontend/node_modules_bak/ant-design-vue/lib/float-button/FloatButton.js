"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.floatButtonPrefixCls = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _tooltip = _interopRequireDefault(require("../tooltip"));
var _badge = _interopRequireDefault(require("../badge"));
var _FloatButtonContent = _interopRequireDefault(require("./FloatButtonContent"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _context = require("./context");
var _warning = _interopRequireDefault(require("../_util/warning"));
var _propsUtil = require("../_util/props-util");
var _interface = require("./interface");
var _style = _interopRequireDefault(require("./style"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

// import { useCompactItemContext } from '../space/Compact';
// CSSINJS

const floatButtonPrefixCls = exports.floatButtonPrefixCls = 'float-btn';
const FloatButton = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'AFloatButton',
  inheritAttrs: false,
  props: (0, _propsUtil.initDefaultProps)((0, _interface.floatButtonProps)(), {
    type: 'default',
    shape: 'circle'
  }),
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const {
      prefixCls,
      direction
    } = (0, _useConfigInject.default)(floatButtonPrefixCls, props);
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const {
      shape: groupShape
    } = (0, _context.useInjectFloatButtonGroupContext)();
    const floatButtonRef = (0, _vue.ref)(null);
    const mergeShape = (0, _vue.computed)(() => {
      return (groupShape === null || groupShape === void 0 ? void 0 : groupShape.value) || props.shape;
    });
    return () => {
      var _a;
      const {
          prefixCls: customPrefixCls,
          type = 'default',
          shape = 'circle',
          description = (_a = slots.description) === null || _a === void 0 ? void 0 : _a.call(slots),
          tooltip,
          badge = {}
        } = props,
        restProps = __rest(props, ["prefixCls", "type", "shape", "description", "tooltip", "badge"]);
      const classString = (0, _classNames.default)(prefixCls.value, `${prefixCls.value}-${type}`, `${prefixCls.value}-${mergeShape.value}`, {
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl'
      }, attrs.class, hashId.value);
      const buttonNode = (0, _vue.createVNode)(_tooltip.default, {
        "placement": "left"
      }, {
        title: slots.tooltip || tooltip ? () => slots.tooltip && slots.tooltip() || tooltip : undefined,
        default: () => (0, _vue.createVNode)(_badge.default, badge, {
          default: () => [(0, _vue.createVNode)("div", {
            "class": `${prefixCls.value}-body`
          }, [(0, _vue.createVNode)(_FloatButtonContent.default, {
            "prefixCls": prefixCls.value
          }, {
            icon: slots.icon,
            description: () => description
          })])]
        })
      });
      if (process.env.NODE_ENV !== 'production') {
        (0, _warning.default)(!(shape === 'circle' && description), 'FloatButton', 'supported only when `shape` is `square`. Due to narrow space for text, short sentence is recommended.');
      }
      return wrapSSR(props.href ? (0, _vue.createVNode)("a", (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({
        "ref": floatButtonRef
      }, attrs), restProps), {}, {
        "class": classString
      }), [buttonNode]) : (0, _vue.createVNode)("button", (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({
        "ref": floatButtonRef
      }, attrs), restProps), {}, {
        "class": classString,
        "type": "button"
      }), [buttonNode]));
    };
  }
});
var _default = exports.default = FloatButton;