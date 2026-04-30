import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { resolveDirective as _resolveDirective, Fragment as _Fragment, createVNode as _createVNode } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import { computed, onMounted, defineComponent, nextTick, shallowRef, watch } from 'vue';
import classNames from '../_util/classNames';
import omit from '../_util/omit';
import { inputProps } from './inputProps';
import { fixControlledValue, hasAddon, hasPrefixSuffix, resolveOnChange, triggerFocus } from './utils/commonUtils';
import BaseInput from './BaseInput';
import BaseInputCore from '../_util/BaseInput';
export default defineComponent({
  name: 'VCInput',
  inheritAttrs: false,
  props: inputProps(),
  setup(props, _ref) {
    let {
      slots,
      attrs,
      expose,
      emit
    } = _ref;
    const stateValue = shallowRef(props.value === undefined ? props.defaultValue : props.value);
    const focused = shallowRef(false);
    const inputRef = shallowRef();
    const rootRef = shallowRef();
    watch(() => props.value, () => {
      stateValue.value = props.value;
    });
    watch(() => props.disabled, () => {
      if (props.disabled) {
        focused.value = false;
      }
    });
    const focus = option => {
      if (inputRef.value) {
        triggerFocus(inputRef.value.input, option);
      }
    };
    const blur = () => {
      var _a;
      (_a = inputRef.value.input) === null || _a === void 0 ? void 0 : _a.blur();
    };
    const setSelectionRange = (start, end, direction) => {
      var _a;
      (_a = inputRef.value.input) === null || _a === void 0 ? void 0 : _a.setSelectionRange(start, end, direction);
    };
    const select = () => {
      var _a;
      (_a = inputRef.value.input) === null || _a === void 0 ? void 0 : _a.select();
    };
    expose({
      focus,
      blur,
      input: computed(() => {
        var _a;
        return (_a = inputRef.value.input) === null || _a === void 0 ? void 0 : _a.input;
      }),
      stateValue,
      setSelectionRange,
      select
    });
    const triggerChange = e => {
      emit('change', e);
    };
    const setValue = (value, callback) => {
      if (stateValue.value === value) {
        return;
      }
      if (props.value === undefined) {
        stateValue.value = value;
      } else {
        nextTick(() => {
          var _a;
          if (inputRef.value.input.value !== stateValue.value) {
            (_a = rootRef.value) === null || _a === void 0 ? void 0 : _a.$forceUpdate();
          }
        });
      }
      nextTick(() => {
        callback && callback();
      });
    };
    const handleChange = e => {
      const {
        value
      } = e.target;
      if (stateValue.value === value) return;
      const newVal = e.target.value;
      resolveOnChange(inputRef.value.input, e, triggerChange);
      setValue(newVal);
    };
    const handleKeyDown = e => {
      if (e.keyCode === 13) {
        emit('pressEnter', e);
      }
      emit('keydown', e);
    };
    const handleFocus = e => {
      focused.value = true;
      emit('focus', e);
    };
    const handleBlur = e => {
      focused.value = false;
      emit('blur', e);
    };
    const handleReset = e => {
      resolveOnChange(inputRef.value.input, e, triggerChange);
      setValue('', () => {
        focus();
      });
    };
    const getInputElement = () => {
      var _a, _b;
      const {
        addonBefore = slots.addonBefore,
        addonAfter = slots.addonAfter,
        disabled,
        valueModifiers = {},
        htmlSize,
        autocomplete,
        prefixCls,
        inputClassName,
        prefix = (_a = slots.prefix) === null || _a === void 0 ? void 0 : _a.call(slots),
        suffix = (_b = slots.suffix) === null || _b === void 0 ? void 0 : _b.call(slots),
        allowClear,
        type = 'text'
      } = props;
      const otherProps = omit(props, ['prefixCls', 'onPressEnter', 'addonBefore', 'addonAfter', 'prefix', 'suffix', 'allowClear',
      // Input elements must be either controlled or uncontrolled,
      // specify either the value prop, or the defaultValue prop, but not both.
      'defaultValue', 'size', 'bordered', 'htmlSize', 'lazy', 'showCount', 'valueModifiers', 'showCount', 'affixWrapperClassName', 'groupClassName', 'inputClassName', 'wrapperClassName']);
      const inputProps = _extends(_extends(_extends({}, otherProps), attrs), {
        autocomplete,
        onChange: handleChange,
        onInput: handleChange,
        onFocus: handleFocus,
        onBlur: handleBlur,
        onKeydown: handleKeyDown,
        class: classNames(prefixCls, {
          [`${prefixCls}-disabled`]: disabled
        }, inputClassName, !hasAddon({
          addonAfter,
          addonBefore
        }) && !hasPrefixSuffix({
          prefix,
          suffix,
          allowClear
        }) && attrs.class),
        ref: inputRef,
        key: 'ant-input',
        size: htmlSize,
        type,
        lazy: props.lazy
      });
      if (valueModifiers.lazy) {
        delete inputProps.onInput;
      }
      if (!inputProps.autofocus) {
        delete inputProps.autofocus;
      }
      const inputNode = _createVNode(BaseInputCore, omit(inputProps, ['size']), null);
      return inputNode;
    };
    const getSuffix = () => {
      var _a;
      const {
        maxlength,
        suffix = (_a = slots.suffix) === null || _a === void 0 ? void 0 : _a.call(slots),
        showCount,
        prefixCls
      } = props;
      // Max length value
      const hasMaxLength = Number(maxlength) > 0;
      if (suffix || showCount) {
        const valueLength = [...fixControlledValue(stateValue.value)].length;
        const dataCount = typeof showCount === 'object' ? showCount.formatter({
          count: valueLength,
          maxlength
        }) : `${valueLength}${hasMaxLength ? ` / ${maxlength}` : ''}`;
        return _createVNode(_Fragment, null, [!!showCount && _createVNode("span", {
          "class": classNames(`${prefixCls}-show-count-suffix`, {
            [`${prefixCls}-show-count-has-suffix`]: !!suffix
          })
        }, [dataCount]), suffix]);
      }
      return null;
    };
    onMounted(() => {
      if (process.env.NODE_ENV === 'test') {
        if (props.autofocus) {
          focus();
        }
      }
    });
    return () => {
      const {
          prefixCls,
          disabled
        } = props,
        rest = __rest(props, ["prefixCls", "disabled"]);
      return _createVNode(BaseInput, _objectSpread(_objectSpread(_objectSpread({}, rest), attrs), {}, {
        "ref": rootRef,
        "prefixCls": prefixCls,
        "inputElement": getInputElement(),
        "handleReset": handleReset,
        "value": fixControlledValue(stateValue.value),
        "focused": focused.value,
        "triggerFocus": focus,
        "suffix": getSuffix(),
        "disabled": disabled
      }), slots);
    };
  }
});