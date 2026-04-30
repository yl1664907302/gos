"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _FormItemContext = require("../form/FormItemContext");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _style = _interopRequireDefault(require("./style"));
// CSSINJS
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'AInputGroup',
  inheritAttrs: false,
  props: {
    prefixCls: String,
    size: {
      type: String
    },
    compact: {
      type: Boolean,
      default: undefined
    }
  },
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const {
      prefixCls,
      direction,
      getPrefixCls
    } = (0, _useConfigInject.default)('input-group', props);
    const formItemInputContext = _FormItemContext.FormItemInputContext.useInject();
    _FormItemContext.FormItemInputContext.useProvide(formItemInputContext, {
      isFormItemInput: false
    });
    // style
    const inputPrefixCls = (0, _vue.computed)(() => getPrefixCls('input'));
    const [wrapSSR, hashId] = (0, _style.default)(inputPrefixCls);
    const cls = (0, _vue.computed)(() => {
      const pre = prefixCls.value;
      return {
        [`${pre}`]: true,
        [hashId.value]: true,
        [`${pre}-lg`]: props.size === 'large',
        [`${pre}-sm`]: props.size === 'small',
        [`${pre}-compact`]: props.compact,
        [`${pre}-rtl`]: direction.value === 'rtl'
      };
    });
    return () => {
      var _a;
      return wrapSSR((0, _vue.createVNode)("span", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "class": (0, _classNames.default)(cls.value, attrs.class)
      }), [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]));
    };
  }
});