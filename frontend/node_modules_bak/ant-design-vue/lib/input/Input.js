"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _FormItemContext = require("../form/FormItemContext");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _statusUtils = require("../_util/statusUtils");
var _commonUtils = require("../vc-input/utils/commonUtils");
var _Input = _interopRequireDefault(require("../vc-input/Input"));
var _inputProps = _interopRequireDefault(require("./inputProps"));
var _omit = _interopRequireDefault(require("../_util/omit"));
var _CloseCircleFilled = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CloseCircleFilled"));
var _Compact = require("../space/Compact");
var _style = _interopRequireDefault(require("./style"));
var _DisabledContext = require("../config-provider/DisabledContext");
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

// CSSINJS
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'AInput',
  inheritAttrs: false,
  props: (0, _inputProps.default)(),
  setup(props, _ref) {
    let {
      slots,
      attrs,
      expose,
      emit
    } = _ref;
    const inputRef = (0, _vue.ref)();
    const formItemContext = (0, _FormItemContext.useInjectFormItemContext)();
    const formItemInputContext = _FormItemContext.FormItemInputContext.useInject();
    const mergedStatus = (0, _vue.computed)(() => (0, _statusUtils.getMergedStatus)(formItemInputContext.status, props.status));
    const {
      direction,
      prefixCls,
      size,
      autocomplete
    } = (0, _useConfigInject.default)('input', props);
    // ===================== Compact Item =====================
    const {
      compactSize,
      compactItemClassnames
    } = (0, _Compact.useCompactItemContext)(prefixCls, direction);
    const mergedSize = (0, _vue.computed)(() => {
      return compactSize.value || size.value;
    });
    // Style
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const disabled = (0, _DisabledContext.useInjectDisabled)();
    const focus = option => {
      var _a;
      (_a = inputRef.value) === null || _a === void 0 ? void 0 : _a.focus(option);
    };
    const blur = () => {
      var _a;
      (_a = inputRef.value) === null || _a === void 0 ? void 0 : _a.blur();
    };
    const setSelectionRange = (start, end, direction) => {
      var _a;
      (_a = inputRef.value) === null || _a === void 0 ? void 0 : _a.setSelectionRange(start, end, direction);
    };
    const select = () => {
      var _a;
      (_a = inputRef.value) === null || _a === void 0 ? void 0 : _a.select();
    };
    expose({
      focus,
      blur,
      input: inputRef,
      setSelectionRange,
      select
    });
    // ===================== Remove Password value =====================
    const removePasswordTimeoutRef = (0, _vue.ref)([]);
    const removePasswordTimeout = () => {
      removePasswordTimeoutRef.value.push(setTimeout(() => {
        var _a, _b, _c, _d;
        if (((_a = inputRef.value) === null || _a === void 0 ? void 0 : _a.input) && ((_b = inputRef.value) === null || _b === void 0 ? void 0 : _b.input.getAttribute('type')) === 'password' && ((_c = inputRef.value) === null || _c === void 0 ? void 0 : _c.input.hasAttribute('value'))) {
          (_d = inputRef.value) === null || _d === void 0 ? void 0 : _d.input.removeAttribute('value');
        }
      }));
    };
    (0, _vue.onMounted)(() => {
      removePasswordTimeout();
    });
    (0, _vue.onBeforeUpdate)(() => {
      removePasswordTimeoutRef.value.forEach(item => clearTimeout(item));
    });
    (0, _vue.onBeforeUnmount)(() => {
      removePasswordTimeoutRef.value.forEach(item => clearTimeout(item));
    });
    const handleBlur = e => {
      removePasswordTimeout();
      emit('blur', e);
      formItemContext.onFieldBlur();
    };
    const handleFocus = e => {
      removePasswordTimeout();
      emit('focus', e);
    };
    const triggerChange = e => {
      emit('update:value', e.target.value);
      emit('change', e);
      emit('input', e);
      formItemContext.onFieldChange();
    };
    return () => {
      var _a, _b, _c, _d, _e, _f;
      const {
        hasFeedback,
        feedbackIcon
      } = formItemInputContext;
      const {
          allowClear,
          bordered = true,
          prefix = (_a = slots.prefix) === null || _a === void 0 ? void 0 : _a.call(slots),
          suffix = (_b = slots.suffix) === null || _b === void 0 ? void 0 : _b.call(slots),
          addonAfter = (_c = slots.addonAfter) === null || _c === void 0 ? void 0 : _c.call(slots),
          addonBefore = (_d = slots.addonBefore) === null || _d === void 0 ? void 0 : _d.call(slots),
          id = (_e = formItemContext.id) === null || _e === void 0 ? void 0 : _e.value
        } = props,
        rest = __rest(props, ["allowClear", "bordered", "prefix", "suffix", "addonAfter", "addonBefore", "id"]);
      const suffixNode = (hasFeedback || suffix) && (0, _vue.createVNode)(_vue.Fragment, null, [suffix, hasFeedback && feedbackIcon]);
      const prefixClsValue = prefixCls.value;
      const inputHasPrefixSuffix = (0, _commonUtils.hasPrefixSuffix)({
        prefix,
        suffix
      }) || !!hasFeedback;
      const clearIcon = slots.clearIcon || (() => (0, _vue.createVNode)(_CloseCircleFilled.default, null, null));
      return wrapSSR((0, _vue.createVNode)(_Input.default, (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), (0, _omit.default)(rest, ['onUpdate:value', 'onChange', 'onInput'])), {}, {
        "onChange": triggerChange,
        "id": id,
        "disabled": (_f = props.disabled) !== null && _f !== void 0 ? _f : disabled.value,
        "ref": inputRef,
        "prefixCls": prefixClsValue,
        "autocomplete": autocomplete.value,
        "onBlur": handleBlur,
        "onFocus": handleFocus,
        "prefix": prefix,
        "suffix": suffixNode,
        "allowClear": allowClear,
        "addonAfter": addonAfter && (0, _vue.createVNode)(_Compact.NoCompactStyle, null, {
          default: () => [(0, _vue.createVNode)(_FormItemContext.NoFormStatus, null, {
            default: () => [addonAfter]
          })]
        }),
        "addonBefore": addonBefore && (0, _vue.createVNode)(_Compact.NoCompactStyle, null, {
          default: () => [(0, _vue.createVNode)(_FormItemContext.NoFormStatus, null, {
            default: () => [addonBefore]
          })]
        }),
        "class": [attrs.class, compactItemClassnames.value],
        "inputClassName": (0, _classNames.default)({
          [`${prefixClsValue}-sm`]: mergedSize.value === 'small',
          [`${prefixClsValue}-lg`]: mergedSize.value === 'large',
          [`${prefixClsValue}-rtl`]: direction.value === 'rtl',
          [`${prefixClsValue}-borderless`]: !bordered
        }, !inputHasPrefixSuffix && (0, _statusUtils.getStatusClassNames)(prefixClsValue, mergedStatus.value), hashId.value),
        "affixWrapperClassName": (0, _classNames.default)({
          [`${prefixClsValue}-affix-wrapper-sm`]: mergedSize.value === 'small',
          [`${prefixClsValue}-affix-wrapper-lg`]: mergedSize.value === 'large',
          [`${prefixClsValue}-affix-wrapper-rtl`]: direction.value === 'rtl',
          [`${prefixClsValue}-affix-wrapper-borderless`]: !bordered
        }, (0, _statusUtils.getStatusClassNames)(`${prefixClsValue}-affix-wrapper`, mergedStatus.value, hasFeedback), hashId.value),
        "wrapperClassName": (0, _classNames.default)({
          [`${prefixClsValue}-group-rtl`]: direction.value === 'rtl'
        }, hashId.value),
        "groupClassName": (0, _classNames.default)({
          [`${prefixClsValue}-group-wrapper-sm`]: mergedSize.value === 'small',
          [`${prefixClsValue}-group-wrapper-lg`]: mergedSize.value === 'large',
          [`${prefixClsValue}-group-wrapper-rtl`]: direction.value === 'rtl'
        }, (0, _statusUtils.getStatusClassNames)(`${prefixClsValue}-group-wrapper`, mergedStatus.value, hasFeedback), hashId.value)
      }), (0, _extends2.default)((0, _extends2.default)({}, slots), {
        clearIcon
      })));
    };
  }
});