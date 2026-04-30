"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inputNumberProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _UpOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/UpOutlined"));
var _DownOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/DownOutlined"));
var _InputNumber = _interopRequireWildcard(require("./src/InputNumber"));
var _FormItemContext = require("../form/FormItemContext");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _vnode = require("../_util/vnode");
var _omit = _interopRequireDefault(require("../_util/omit"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _isValidValue = _interopRequireDefault(require("../_util/isValidValue"));
var _statusUtils = require("../_util/statusUtils");
var _type = require("../_util/type");
var _style = _interopRequireDefault(require("./style"));
var _Compact = require("../space/Compact");
var _DisabledContext = require("../config-provider/DisabledContext");
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

// CSSINJS

const baseProps = (0, _InputNumber.inputNumberProps)();
const inputNumberProps = () => (0, _extends2.default)((0, _extends2.default)({}, baseProps), {
  size: (0, _type.stringType)(),
  bordered: (0, _type.booleanType)(true),
  placeholder: String,
  name: String,
  id: String,
  type: String,
  addonBefore: _vueTypes.default.any,
  addonAfter: _vueTypes.default.any,
  prefix: _vueTypes.default.any,
  'onUpdate:value': baseProps.onChange,
  valueModifiers: Object,
  status: (0, _type.stringType)()
});
exports.inputNumberProps = inputNumberProps;
const InputNumber = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'AInputNumber',
  inheritAttrs: false,
  props: inputNumberProps(),
  // emits: ['focus', 'blur', 'change', 'input', 'update:value'],
  slots: Object,
  setup(props, _ref) {
    let {
      emit,
      expose,
      attrs,
      slots
    } = _ref;
    var _a;
    const formItemContext = (0, _FormItemContext.useInjectFormItemContext)();
    const formItemInputContext = _FormItemContext.FormItemInputContext.useInject();
    const mergedStatus = (0, _vue.computed)(() => (0, _statusUtils.getMergedStatus)(formItemInputContext.status, props.status));
    const {
      prefixCls,
      size,
      direction,
      disabled
    } = (0, _useConfigInject.default)('input-number', props);
    const {
      compactSize,
      compactItemClassnames
    } = (0, _Compact.useCompactItemContext)(prefixCls, direction);
    const disabledContext = (0, _DisabledContext.useInjectDisabled)();
    const mergedDisabled = (0, _vue.computed)(() => {
      var _a;
      return (_a = disabled.value) !== null && _a !== void 0 ? _a : disabledContext.value;
    });
    // Style
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const mergedSize = (0, _vue.computed)(() => compactSize.value || size.value);
    const mergedValue = (0, _vue.shallowRef)((_a = props.value) !== null && _a !== void 0 ? _a : props.defaultValue);
    const focused = (0, _vue.shallowRef)(false);
    (0, _vue.watch)(() => props.value, () => {
      mergedValue.value = props.value;
    });
    const inputNumberRef = (0, _vue.shallowRef)(null);
    const focus = () => {
      var _a;
      (_a = inputNumberRef.value) === null || _a === void 0 ? void 0 : _a.focus();
    };
    const blur = () => {
      var _a;
      (_a = inputNumberRef.value) === null || _a === void 0 ? void 0 : _a.blur();
    };
    expose({
      focus,
      blur
    });
    const handleChange = val => {
      if (props.value === undefined) {
        mergedValue.value = val;
      }
      emit('update:value', val);
      emit('change', val);
      formItemContext.onFieldChange();
    };
    const handleBlur = e => {
      focused.value = false;
      emit('blur', e);
      formItemContext.onFieldBlur();
    };
    const handleFocus = e => {
      focused.value = true;
      emit('focus', e);
    };
    return () => {
      var _a, _b, _c, _d;
      const {
        hasFeedback,
        isFormItemInput,
        feedbackIcon
      } = formItemInputContext;
      const id = (_a = props.id) !== null && _a !== void 0 ? _a : formItemContext.id.value;
      const _e = (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, attrs), props), {
          id,
          disabled: mergedDisabled.value
        }),
        {
          class: className,
          bordered,
          readonly,
          style,
          addonBefore = (_b = slots.addonBefore) === null || _b === void 0 ? void 0 : _b.call(slots),
          addonAfter = (_c = slots.addonAfter) === null || _c === void 0 ? void 0 : _c.call(slots),
          prefix = (_d = slots.prefix) === null || _d === void 0 ? void 0 : _d.call(slots),
          valueModifiers = {}
        } = _e,
        others = __rest(_e, ["class", "bordered", "readonly", "style", "addonBefore", "addonAfter", "prefix", "valueModifiers"]);
      const preCls = prefixCls.value;
      const inputNumberClass = (0, _classNames.default)({
        [`${preCls}-lg`]: mergedSize.value === 'large',
        [`${preCls}-sm`]: mergedSize.value === 'small',
        [`${preCls}-rtl`]: direction.value === 'rtl',
        [`${preCls}-readonly`]: readonly,
        [`${preCls}-borderless`]: !bordered,
        [`${preCls}-in-form-item`]: isFormItemInput
      }, (0, _statusUtils.getStatusClassNames)(preCls, mergedStatus.value), className, compactItemClassnames.value, hashId.value);
      let element = (0, _vue.createVNode)(_InputNumber.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, (0, _omit.default)(others, ['size', 'defaultValue'])), {}, {
        "ref": inputNumberRef,
        "lazy": !!valueModifiers.lazy,
        "value": mergedValue.value,
        "class": inputNumberClass,
        "prefixCls": preCls,
        "readonly": readonly,
        "onChange": handleChange,
        "onBlur": handleBlur,
        "onFocus": handleFocus
      }), {
        upHandler: slots.upIcon ? () => (0, _vue.createVNode)("span", {
          "class": `${preCls}-handler-up-inner`
        }, [slots.upIcon()]) : () => (0, _vue.createVNode)(_UpOutlined.default, {
          "class": `${preCls}-handler-up-inner`
        }, null),
        downHandler: slots.downIcon ? () => (0, _vue.createVNode)("span", {
          "class": `${preCls}-handler-down-inner`
        }, [slots.downIcon()]) : () => (0, _vue.createVNode)(_DownOutlined.default, {
          "class": `${preCls}-handler-down-inner`
        }, null)
      });
      const hasAddon = (0, _isValidValue.default)(addonBefore) || (0, _isValidValue.default)(addonAfter);
      const hasPrefix = (0, _isValidValue.default)(prefix);
      if (hasPrefix || hasFeedback) {
        const affixWrapperCls = (0, _classNames.default)(`${preCls}-affix-wrapper`, (0, _statusUtils.getStatusClassNames)(`${preCls}-affix-wrapper`, mergedStatus.value, hasFeedback), {
          [`${preCls}-affix-wrapper-focused`]: focused.value,
          [`${preCls}-affix-wrapper-disabled`]: mergedDisabled.value,
          [`${preCls}-affix-wrapper-sm`]: mergedSize.value === 'small',
          [`${preCls}-affix-wrapper-lg`]: mergedSize.value === 'large',
          [`${preCls}-affix-wrapper-rtl`]: direction.value === 'rtl',
          [`${preCls}-affix-wrapper-readonly`]: readonly,
          [`${preCls}-affix-wrapper-borderless`]: !bordered,
          // className will go to addon wrapper
          [`${className}`]: !hasAddon && className
        }, hashId.value);
        element = (0, _vue.createVNode)("div", {
          "class": affixWrapperCls,
          "style": style,
          "onClick": focus
        }, [hasPrefix && (0, _vue.createVNode)("span", {
          "class": `${preCls}-prefix`
        }, [prefix]), element, hasFeedback && (0, _vue.createVNode)("span", {
          "class": `${preCls}-suffix`
        }, [feedbackIcon])]);
      }
      if (hasAddon) {
        const wrapperClassName = `${preCls}-group`;
        const addonClassName = `${wrapperClassName}-addon`;
        const addonBeforeNode = addonBefore ? (0, _vue.createVNode)("div", {
          "class": addonClassName
        }, [addonBefore]) : null;
        const addonAfterNode = addonAfter ? (0, _vue.createVNode)("div", {
          "class": addonClassName
        }, [addonAfter]) : null;
        const mergedWrapperClassName = (0, _classNames.default)(`${preCls}-wrapper`, wrapperClassName, {
          [`${wrapperClassName}-rtl`]: direction.value === 'rtl'
        }, hashId.value);
        const mergedGroupClassName = (0, _classNames.default)(`${preCls}-group-wrapper`, {
          [`${preCls}-group-wrapper-sm`]: mergedSize.value === 'small',
          [`${preCls}-group-wrapper-lg`]: mergedSize.value === 'large',
          [`${preCls}-group-wrapper-rtl`]: direction.value === 'rtl'
        }, (0, _statusUtils.getStatusClassNames)(`${prefixCls}-group-wrapper`, mergedStatus.value, hasFeedback), className, hashId.value);
        element = (0, _vue.createVNode)("div", {
          "class": mergedGroupClassName,
          "style": style
        }, [(0, _vue.createVNode)("div", {
          "class": mergedWrapperClassName
        }, [addonBeforeNode && (0, _vue.createVNode)(_Compact.NoCompactStyle, null, {
          default: () => [(0, _vue.createVNode)(_FormItemContext.NoFormStatus, null, {
            default: () => [addonBeforeNode]
          })]
        }), element, addonAfterNode && (0, _vue.createVNode)(_Compact.NoCompactStyle, null, {
          default: () => [(0, _vue.createVNode)(_FormItemContext.NoFormStatus, null, {
            default: () => [addonAfterNode]
          })]
        })])]);
      }
      return wrapSSR((0, _vnode.cloneElement)(element, {
        style
      }));
    };
  }
});
var _default = exports.default = (0, _extends2.default)(InputNumber, {
  install: app => {
    app.component(InputNumber.name, InputNumber);
    return app;
  }
});