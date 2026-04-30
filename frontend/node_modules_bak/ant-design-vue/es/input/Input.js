import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { resolveDirective as _resolveDirective, createVNode as _createVNode, Fragment as _Fragment } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import { onBeforeUpdate, computed, onBeforeUnmount, onMounted, ref, defineComponent } from 'vue';
import classNames from '../_util/classNames';
import { FormItemInputContext, NoFormStatus, useInjectFormItemContext } from '../form/FormItemContext';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { getMergedStatus, getStatusClassNames } from '../_util/statusUtils';
import { hasPrefixSuffix } from '../vc-input/utils/commonUtils';
import VcInput from '../vc-input/Input';
import inputProps from './inputProps';
import omit from '../_util/omit';
import CloseCircleFilled from "@ant-design/icons-vue/es/icons/CloseCircleFilled";
import { NoCompactStyle, useCompactItemContext } from '../space/Compact';
// CSSINJS
import useStyle from './style';
import { useInjectDisabled } from '../config-provider/DisabledContext';
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'AInput',
  inheritAttrs: false,
  props: inputProps(),
  setup(props, _ref) {
    let {
      slots,
      attrs,
      expose,
      emit
    } = _ref;
    const inputRef = ref();
    const formItemContext = useInjectFormItemContext();
    const formItemInputContext = FormItemInputContext.useInject();
    const mergedStatus = computed(() => getMergedStatus(formItemInputContext.status, props.status));
    const {
      direction,
      prefixCls,
      size,
      autocomplete
    } = useConfigInject('input', props);
    // ===================== Compact Item =====================
    const {
      compactSize,
      compactItemClassnames
    } = useCompactItemContext(prefixCls, direction);
    const mergedSize = computed(() => {
      return compactSize.value || size.value;
    });
    // Style
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const disabled = useInjectDisabled();
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
    const removePasswordTimeoutRef = ref([]);
    const removePasswordTimeout = () => {
      removePasswordTimeoutRef.value.push(setTimeout(() => {
        var _a, _b, _c, _d;
        if (((_a = inputRef.value) === null || _a === void 0 ? void 0 : _a.input) && ((_b = inputRef.value) === null || _b === void 0 ? void 0 : _b.input.getAttribute('type')) === 'password' && ((_c = inputRef.value) === null || _c === void 0 ? void 0 : _c.input.hasAttribute('value'))) {
          (_d = inputRef.value) === null || _d === void 0 ? void 0 : _d.input.removeAttribute('value');
        }
      }));
    };
    onMounted(() => {
      removePasswordTimeout();
    });
    onBeforeUpdate(() => {
      removePasswordTimeoutRef.value.forEach(item => clearTimeout(item));
    });
    onBeforeUnmount(() => {
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
      const suffixNode = (hasFeedback || suffix) && _createVNode(_Fragment, null, [suffix, hasFeedback && feedbackIcon]);
      const prefixClsValue = prefixCls.value;
      const inputHasPrefixSuffix = hasPrefixSuffix({
        prefix,
        suffix
      }) || !!hasFeedback;
      const clearIcon = slots.clearIcon || (() => _createVNode(CloseCircleFilled, null, null));
      return wrapSSR(_createVNode(VcInput, _objectSpread(_objectSpread(_objectSpread({}, attrs), omit(rest, ['onUpdate:value', 'onChange', 'onInput'])), {}, {
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
        "addonAfter": addonAfter && _createVNode(NoCompactStyle, null, {
          default: () => [_createVNode(NoFormStatus, null, {
            default: () => [addonAfter]
          })]
        }),
        "addonBefore": addonBefore && _createVNode(NoCompactStyle, null, {
          default: () => [_createVNode(NoFormStatus, null, {
            default: () => [addonBefore]
          })]
        }),
        "class": [attrs.class, compactItemClassnames.value],
        "inputClassName": classNames({
          [`${prefixClsValue}-sm`]: mergedSize.value === 'small',
          [`${prefixClsValue}-lg`]: mergedSize.value === 'large',
          [`${prefixClsValue}-rtl`]: direction.value === 'rtl',
          [`${prefixClsValue}-borderless`]: !bordered
        }, !inputHasPrefixSuffix && getStatusClassNames(prefixClsValue, mergedStatus.value), hashId.value),
        "affixWrapperClassName": classNames({
          [`${prefixClsValue}-affix-wrapper-sm`]: mergedSize.value === 'small',
          [`${prefixClsValue}-affix-wrapper-lg`]: mergedSize.value === 'large',
          [`${prefixClsValue}-affix-wrapper-rtl`]: direction.value === 'rtl',
          [`${prefixClsValue}-affix-wrapper-borderless`]: !bordered
        }, getStatusClassNames(`${prefixClsValue}-affix-wrapper`, mergedStatus.value, hasFeedback), hashId.value),
        "wrapperClassName": classNames({
          [`${prefixClsValue}-group-rtl`]: direction.value === 'rtl'
        }, hashId.value),
        "groupClassName": classNames({
          [`${prefixClsValue}-group-wrapper-sm`]: mergedSize.value === 'small',
          [`${prefixClsValue}-group-wrapper-lg`]: mergedSize.value === 'large',
          [`${prefixClsValue}-group-wrapper-rtl`]: direction.value === 'rtl'
        }, getStatusClassNames(`${prefixClsValue}-group-wrapper`, mergedStatus.value, hasFeedback), hashId.value)
      }), _extends(_extends({}, slots), {
        clearIcon
      })));
    };
  }
});