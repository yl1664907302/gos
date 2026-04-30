"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typographyProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _style = _interopRequireDefault(require("./style"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

// CSSINJS

const typographyProps = () => ({
  prefixCls: String,
  direction: String,
  // Form Internal use
  component: String
});
exports.typographyProps = typographyProps;
const Typography = (0, _vue.defineComponent)({
  name: 'ATypography',
  inheritAttrs: false,
  props: typographyProps(),
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const {
      prefixCls,
      direction
    } = (0, _useConfigInject.default)('typography', props);
    // Style
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    return () => {
      var _a;
      const _b = (0, _extends2.default)((0, _extends2.default)({}, props), attrs),
        {
          prefixCls: _prefixCls,
          direction: _direction,
          component: Component = 'article'
        } = _b,
        restProps = __rest(_b, ["prefixCls", "direction", "component"]);
      return wrapSSR((0, _vue.createVNode)(Component, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, restProps), {}, {
        "class": (0, _classNames.default)(prefixCls.value, {
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl'
        }, attrs.class, hashId.value)
      }), {
        default: () => [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]
      }));
    };
  }
});
var _default = exports.default = Typography;