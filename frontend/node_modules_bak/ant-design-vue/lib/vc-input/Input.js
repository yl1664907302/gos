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
var _omit = _interopRequireDefault(require("../_util/omit"));
var _inputProps = require("./inputProps");
var _commonUtils = require("./utils/commonUtils");
var _BaseInput = _interopRequireDefault(require("./BaseInput"));
var _BaseInput2 = _interopRequireDefault(require("../_util/BaseInput"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
var _default = exports.default = (0, _vue.defineComponent)({
  name: 'VCInput',
  inheritAttrs: false,
  props: (0, _inputProps.inputProps)(),
  setup(props, _ref) {
    let {
      slots,
      attrs,
      expose,
      emit
    } = _ref;
    const stateValue = (0, _vue.shallowRef)(props.value === undefined ? props.defaultValue : props.value);
    const focused = (0, _vue.shallowRef)(false);
    const inputRef = (0, _vue.shallowRef)();
    const rootRef = (0, _vue.shallowRef)();
    (0, _vue.watch)(() => props.value, () => {
      stateValue.value = props.value;
    });
    (0, _vue.watch)(() => props.disabled, () => {
      if (props.disabled) {
        focused.value = false;
      }
    });
    const focus = option => {
      if (inputRef.value) {
        (0, _commonUtils.triggerFocus)(inputRef.value.input, option);
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
      input: (0, _vue.computed)(() => {
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
        (0, _vue.nextTick)(() => {
          var _a;
          if (inputRef.value.input.value !== stateValue.value) {
            (_a = rootRef.value) === null || _a === void 0 ? void 0 : _a.$forceUpdate();
          }
        });
      }
      (0, _vue.nextTick)(() => {
        callback && callback();
      });
    };
    const handleChange = e => {
      const {
        value
      } = e.target;
      if (stateValue.value === value) return;
      const newVal = e.target.value;
      (0, _commonUtils.resolveOnChange)(inputRef.value.input, e, triggerChange);
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
      (0, _commonUtils.resolveOnChange)(inputRef.value.input, e, triggerChange);
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
      const otherProps = (0, _omit.default)(props, ['prefixCls', 'onPressEnter', 'addonBefore', 'addonAfter', 'prefix', 'suffix', 'allowClear',
      // Input elements must be either controlled or uncontrolled,
      // specify either the value prop, or the defaultValue prop, but not both.
      'defaultValue', 'size', 'bordered', 'htmlSize', 'lazy', 'showCount', 'valueModifiers', 'showCount', 'affixWrapperClassName', 'groupClassName', 'inputClassName', 'wrapperClassName']);
      const inputProps = (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, otherProps), attrs), {
        autocomplete,
        onChange: handleChange,
        onInput: handleChange,
        onFocus: handleFocus,
        onBlur: handleBlur,
        onKeydown: handleKeyDown,
        class: (0, _classNames.default)(prefixCls, {
          [`${prefixCls}-disabled`]: disabled
        }, inputClassName, !(0, _commonUtils.hasAddon)({
          addonAfter,
          addonBefore
        }) && !(0, _commonUtils.hasPrefixSuffix)({
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
      const inputNode = (0, _vue.createVNode)(_BaseInput2.default, (0, _omit.default)(inputProps, ['size']), null);
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
        const valueLength = [...(0, _commonUtils.fixControlledValue)(stateValue.value)].length;
        const dataCount = typeof showCount === 'object' ? showCount.formatter({
          count: valueLength,
          maxlength
        }) : `${valueLength}${hasMaxLength ? ` / ${maxlength}` : ''}`;
        return (0, _vue.createVNode)(_vue.Fragment, null, [!!showCount && (0, _vue.createVNode)("span", {
          "class": (0, _classNames.default)(`${prefixCls}-show-count-suffix`, {
            [`${prefixCls}-show-count-has-suffix`]: !!suffix
          })
        }, [dataCount]), suffix]);
      }
      return null;
    };
    (0, _vue.onMounted)(() => {
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
      return (0, _vue.createVNode)(_BaseInput.default, (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, rest), attrs), {}, {
        "ref": rootRef,
        "prefixCls": prefixCls,
        "inputElement": getInputElement(),
        "handleReset": handleReset,
        "value": (0, _commonUtils.fixControlledValue)(stateValue.value),
        "focused": focused.value,
        "triggerFocus": focus,
        "suffix": getSuffix(),
        "disabled": disabled
      }), slots);
    };
  }
});