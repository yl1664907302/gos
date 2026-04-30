"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _context = require("../config-provider/context");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _style = _interopRequireDefault(require("./style"));
var _gapSize = require("../_util/gapSize");
var _omit = _interopRequireDefault(require("../_util/omit"));
var _type = require("../_util/type");
var _interface = require("./interface");
var _utils = _interopRequireDefault(require("./utils"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const AFlex = (0, _vue.defineComponent)({
  name: 'AFlex',
  inheritAttrs: false,
  props: (0, _interface.flexProps)(),
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const {
      flex: ctxFlex,
      direction: ctxDirection
    } = (0, _context.useConfigContextInject)();
    const {
      prefixCls
    } = (0, _useConfigInject.default)('flex', props);
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const mergedCls = (0, _vue.computed)(() => {
      var _a;
      return [prefixCls.value, hashId.value, (0, _utils.default)(prefixCls.value, props), {
        [`${prefixCls.value}-rtl`]: ctxDirection.value === 'rtl',
        [`${prefixCls.value}-gap-${props.gap}`]: (0, _gapSize.isPresetSize)(props.gap),
        [`${prefixCls.value}-vertical`]: (_a = props.vertical) !== null && _a !== void 0 ? _a : ctxFlex === null || ctxFlex === void 0 ? void 0 : ctxFlex.value.vertical
      }];
    });
    return () => {
      var _a;
      const {
          flex,
          gap,
          component: Component = 'div'
        } = props,
        othersProps = __rest(props, ["flex", "gap", "component"]);
      const mergedStyle = {};
      if (flex) {
        mergedStyle.flex = flex;
      }
      if (gap && !(0, _gapSize.isPresetSize)(gap)) {
        mergedStyle.gap = `${gap}px`;
      }
      return wrapSSR((0, _vue.createVNode)(Component, (0, _objectSpread2.default)({
        "class": [attrs.class, mergedCls.value],
        "style": [attrs.style, mergedStyle]
      }, (0, _omit.default)(othersProps, ['justify', 'wrap', 'align', 'vertical'])), {
        default: () => [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]
      }));
    };
  }
});
var _default = exports.default = (0, _type.withInstall)(AFlex);