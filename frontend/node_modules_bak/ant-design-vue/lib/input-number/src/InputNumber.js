"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inputNumberProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _MiniDecimal = _interopRequireWildcard(require("./utils/MiniDecimal"));
var _StepHandler = _interopRequireDefault(require("./StepHandler"));
var _numberUtil = require("./utils/numberUtil");
var _useCursor = _interopRequireDefault(require("./hooks/useCursor"));
var _useFrame = _interopRequireDefault(require("./hooks/useFrame"));
var _KeyCode = _interopRequireDefault(require("../../_util/KeyCode"));
var _classNames = _interopRequireDefault(require("../../_util/classNames"));
var _type = require("../../_util/type");
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
/**
 * We support `stringMode` which need handle correct type when user call in onChange
 * format max or min value
 * 1. if isInvalid return null
 * 2. if precision is undefined, return decimal
 * 3. format with precision
 *    I. if max > 0, round down with precision. Example: max= 3.5, precision=0  afterFormat: 3
 *    II. if max < 0, round up with precision. Example: max= -3.5, precision=0  afterFormat: -4
 *    III. if min > 0, round up with precision. Example: min= 3.5, precision=0  afterFormat: 4
 *    IV. if min < 0, round down with precision. Example: max= -3.5, precision=0  afterFormat: -3
 */
const getDecimalValue = (stringMode, decimalValue) => {
  if (stringMode || decimalValue.isEmpty()) {
    return decimalValue.toString();
  }
  return decimalValue.toNumber();
};
const getDecimalIfValidate = value => {
  const decimal = (0, _MiniDecimal.default)(value);
  return decimal.isInvalidate() ? null : decimal;
};
const inputNumberProps = () => ({
  /** value will show as string */
  stringMode: (0, _type.booleanType)(),
  defaultValue: (0, _type.someType)([String, Number]),
  value: (0, _type.someType)([String, Number]),
  prefixCls: (0, _type.stringType)(),
  min: (0, _type.someType)([String, Number]),
  max: (0, _type.someType)([String, Number]),
  step: (0, _type.someType)([String, Number], 1),
  tabindex: Number,
  controls: (0, _type.booleanType)(true),
  readonly: (0, _type.booleanType)(),
  disabled: (0, _type.booleanType)(),
  autofocus: (0, _type.booleanType)(),
  keyboard: (0, _type.booleanType)(true),
  /** Parse display value to validate number */
  parser: (0, _type.functionType)(),
  /** Transform `value` to display value show in input */
  formatter: (0, _type.functionType)(),
  /** Syntactic sugar of `formatter`. Config precision of display. */
  precision: Number,
  /** Syntactic sugar of `formatter`. Config decimal separator of display. */
  decimalSeparator: String,
  onInput: (0, _type.functionType)(),
  onChange: (0, _type.functionType)(),
  onPressEnter: (0, _type.functionType)(),
  onStep: (0, _type.functionType)(),
  onBlur: (0, _type.functionType)(),
  onFocus: (0, _type.functionType)()
});
exports.inputNumberProps = inputNumberProps;
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'InnerInputNumber',
  inheritAttrs: false,
  props: (0, _extends2.default)((0, _extends2.default)({}, inputNumberProps()), {
    lazy: Boolean
  }),
  slots: Object,
  setup(props, _ref) {
    let {
      attrs,
      slots,
      emit,
      expose
    } = _ref;
    const inputRef = (0, _vue.shallowRef)();
    const focus = (0, _vue.shallowRef)(false);
    const userTypingRef = (0, _vue.shallowRef)(false);
    const compositionRef = (0, _vue.shallowRef)(false);
    const decimalValue = (0, _vue.shallowRef)((0, _MiniDecimal.default)(props.value));
    function setUncontrolledDecimalValue(newDecimal) {
      if (props.value === undefined) {
        decimalValue.value = newDecimal;
      }
    }
    // ====================== Parser & Formatter ======================
    /**
     * `precision` is used for formatter & onChange.
     * It will auto generate by `value` & `step`.
     * But it will not block user typing.
     *
     * Note: Auto generate `precision` is used for legacy logic.
     * We should remove this since we already support high precision with BigInt.
     *
     * @param number  Provide which number should calculate precision
     * @param userTyping  Change by user typing
     */
    const getPrecision = (numStr, userTyping) => {
      if (userTyping) {
        return undefined;
      }
      if (props.precision >= 0) {
        return props.precision;
      }
      return Math.max((0, _numberUtil.getNumberPrecision)(numStr), (0, _numberUtil.getNumberPrecision)(props.step));
    };
    // >>> Parser
    const mergedParser = num => {
      const numStr = String(num);
      if (props.parser) {
        return props.parser(numStr);
      }
      let parsedStr = numStr;
      if (props.decimalSeparator) {
        parsedStr = parsedStr.replace(props.decimalSeparator, '.');
      }
      // [Legacy] We still support auto convert `$ 123,456` to `123456`
      return parsedStr.replace(/[^\w.-]+/g, '');
    };
    // >>> Formatter
    const inputValue = (0, _vue.shallowRef)('');
    const mergedFormatter = (number, userTyping) => {
      if (props.formatter) {
        return props.formatter(number, {
          userTyping,
          input: String(inputValue.value)
        });
      }
      let str = typeof number === 'number' ? (0, _numberUtil.num2str)(number) : number;
      // User typing will not auto format with precision directly
      if (!userTyping) {
        const mergedPrecision = getPrecision(str, userTyping);
        if ((0, _numberUtil.validateNumber)(str) && (props.decimalSeparator || mergedPrecision >= 0)) {
          // Separator
          const separatorStr = props.decimalSeparator || '.';
          str = (0, _MiniDecimal.toFixed)(str, separatorStr, mergedPrecision);
        }
      }
      return str;
    };
    // ========================== InputValue ==========================
    /**
     * Input text value control
     *
     * User can not update input content directly. It update with follow rules by priority:
     *  1. controlled `value` changed
     *    * [SPECIAL] Typing like `1.` should not immediately convert to `1`
     *  2. User typing with format (not precision)
     *  3. Blur or Enter trigger revalidate
     */
    const initValue = (() => {
      const initValue = props.value;
      if (decimalValue.value.isInvalidate() && ['string', 'number'].includes(typeof initValue)) {
        return Number.isNaN(initValue) ? '' : initValue;
      }
      return mergedFormatter(decimalValue.value.toString(), false);
    })();
    inputValue.value = initValue;
    // Should always be string
    function setInputValue(newValue, userTyping) {
      inputValue.value = mergedFormatter(
      // Invalidate number is sometime passed by external control, we should let it go
      // Otherwise is controlled by internal interactive logic which check by userTyping
      // You can ref 'show limited value when input is not focused' test for more info.
      newValue.isInvalidate() ? newValue.toString(false) : newValue.toString(!userTyping), userTyping);
    }
    // >>> Max & Min limit
    const maxDecimal = (0, _vue.computed)(() => getDecimalIfValidate(props.max));
    const minDecimal = (0, _vue.computed)(() => getDecimalIfValidate(props.min));
    const upDisabled = (0, _vue.computed)(() => {
      if (!maxDecimal.value || !decimalValue.value || decimalValue.value.isInvalidate()) {
        return false;
      }
      return maxDecimal.value.lessEquals(decimalValue.value);
    });
    const downDisabled = (0, _vue.computed)(() => {
      if (!minDecimal.value || !decimalValue.value || decimalValue.value.isInvalidate()) {
        return false;
      }
      return decimalValue.value.lessEquals(minDecimal.value);
    });
    // Cursor controller
    const [recordCursor, restoreCursor] = (0, _useCursor.default)(inputRef, focus);
    // ============================= Data =============================
    /**
     * Find target value closet within range.
     * e.g. [11, 28]:
     *    3  => 11
     *    23 => 23
     *    99 => 28
     */
    const getRangeValue = target => {
      // target > max
      if (maxDecimal.value && !target.lessEquals(maxDecimal.value)) {
        return maxDecimal.value;
      }
      // target < min
      if (minDecimal.value && !minDecimal.value.lessEquals(target)) {
        return minDecimal.value;
      }
      return null;
    };
    /**
     * Check value is in [min, max] range
     */
    const isInRange = target => !getRangeValue(target);
    /**
     * Trigger `onChange` if value validated and not equals of origin.
     * Return the value that re-align in range.
     */
    const triggerValueUpdate = (newValue, userTyping) => {
      var _a;
      let updateValue = newValue;
      let isRangeValidate = isInRange(updateValue) || updateValue.isEmpty();
      // Skip align value when trigger value is empty.
      // We just trigger onChange(null)
      // This should not block user typing
      if (!updateValue.isEmpty() && !userTyping) {
        // Revert value in range if needed
        updateValue = getRangeValue(updateValue) || updateValue;
        isRangeValidate = true;
      }
      if (!props.readonly && !props.disabled && isRangeValidate) {
        const numStr = updateValue.toString();
        const mergedPrecision = getPrecision(numStr, userTyping);
        if (mergedPrecision >= 0) {
          updateValue = (0, _MiniDecimal.default)((0, _MiniDecimal.toFixed)(numStr, '.', mergedPrecision));
        }
        // Trigger event
        if (!updateValue.equals(decimalValue.value)) {
          setUncontrolledDecimalValue(updateValue);
          (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, updateValue.isEmpty() ? null : getDecimalValue(props.stringMode, updateValue));
          // Reformat input if value is not controlled
          if (props.value === undefined) {
            setInputValue(updateValue, userTyping);
          }
        }
        return updateValue;
      }
      return decimalValue.value;
    };
    // ========================== User Input ==========================
    const onNextPromise = (0, _useFrame.default)();
    // >>> Collect input value
    const collectInputValue = inputStr => {
      var _a;
      recordCursor();
      // Update inputValue incase input can not parse as number
      inputValue.value = inputStr;
      // Parse number
      if (!compositionRef.value) {
        const finalValue = mergedParser(inputStr);
        const finalDecimal = (0, _MiniDecimal.default)(finalValue);
        if (!finalDecimal.isNaN()) {
          triggerValueUpdate(finalDecimal, true);
        }
      }
      // Trigger onInput later to let user customize value if they want do handle something after onChange
      (_a = props.onInput) === null || _a === void 0 ? void 0 : _a.call(props, inputStr);
      // optimize for chinese input experience
      // https://github.com/ant-design/ant-design/issues/8196
      onNextPromise(() => {
        let nextInputStr = inputStr;
        if (!props.parser) {
          nextInputStr = inputStr.replace(/。/g, '.');
        }
        if (nextInputStr !== inputStr) {
          collectInputValue(nextInputStr);
        }
      });
    };
    // >>> Composition
    const onCompositionStart = () => {
      compositionRef.value = true;
    };
    const onCompositionEnd = () => {
      compositionRef.value = false;
      collectInputValue(inputRef.value.value);
    };
    // >>> Input
    const onInternalInput = e => {
      collectInputValue(e.target.value);
    };
    // ============================= Step =============================
    const onInternalStep = up => {
      var _a, _b;
      // Ignore step since out of range
      if (up && upDisabled.value || !up && downDisabled.value) {
        return;
      }
      // Clear typing status since it may caused by up & down key.
      // We should sync with input value.
      userTypingRef.value = false;
      let stepDecimal = (0, _MiniDecimal.default)(props.step);
      if (!up) {
        stepDecimal = stepDecimal.negate();
      }
      const target = (decimalValue.value || (0, _MiniDecimal.default)(0)).add(stepDecimal.toString());
      const updatedValue = triggerValueUpdate(target, false);
      (_a = props.onStep) === null || _a === void 0 ? void 0 : _a.call(props, getDecimalValue(props.stringMode, updatedValue), {
        offset: props.step,
        type: up ? 'up' : 'down'
      });
      (_b = inputRef.value) === null || _b === void 0 ? void 0 : _b.focus();
    };
    // ============================ Flush =============================
    /**
     * Flush current input content to trigger value change & re-formatter input if needed
     */
    const flushInputValue = userTyping => {
      const parsedValue = (0, _MiniDecimal.default)(mergedParser(inputValue.value));
      let formatValue = parsedValue;
      if (!parsedValue.isNaN()) {
        // Only validate value or empty value can be re-fill to inputValue
        // Reassign the formatValue within ranged of trigger control
        formatValue = triggerValueUpdate(parsedValue, userTyping);
      } else {
        formatValue = decimalValue.value;
      }
      if (props.value !== undefined) {
        // Reset back with controlled value first
        setInputValue(decimalValue.value, false);
      } else if (!formatValue.isNaN()) {
        // Reset input back since no validate value
        setInputValue(formatValue, false);
      }
    };
    // Solve the issue of the event triggering sequence when entering numbers in chinese input (Safari)
    const onBeforeInput = () => {
      userTypingRef.value = true;
    };
    const onKeyDown = event => {
      var _a;
      const {
        which
      } = event;
      userTypingRef.value = true;
      if (which === _KeyCode.default.ENTER) {
        if (!compositionRef.value) {
          userTypingRef.value = false;
        }
        flushInputValue(false);
        (_a = props.onPressEnter) === null || _a === void 0 ? void 0 : _a.call(props, event);
      }
      if (props.keyboard === false) {
        return;
      }
      // Do step
      if (!compositionRef.value && [_KeyCode.default.UP, _KeyCode.default.DOWN].includes(which)) {
        onInternalStep(_KeyCode.default.UP === which);
        event.preventDefault();
      }
    };
    const onKeyUp = () => {
      userTypingRef.value = false;
    };
    // >>> Focus & Blur
    const onBlur = e => {
      flushInputValue(false);
      focus.value = false;
      userTypingRef.value = false;
      emit('blur', e);
    };
    // ========================== Controlled ==========================
    // Input by precision
    (0, _vue.watch)(() => props.precision, () => {
      if (!decimalValue.value.isInvalidate()) {
        setInputValue(decimalValue.value, false);
      }
    }, {
      flush: 'post'
    });
    // Input by value
    (0, _vue.watch)(() => props.value, () => {
      const newValue = (0, _MiniDecimal.default)(props.value);
      decimalValue.value = newValue;
      const currentParsedValue = (0, _MiniDecimal.default)(mergedParser(inputValue.value));
      // When user typing from `1.2` to `1.`, we should not convert to `1` immediately.
      // But let it go if user set `formatter`
      if (!newValue.equals(currentParsedValue) || !userTypingRef.value || props.formatter) {
        // Update value as effect
        setInputValue(newValue, userTypingRef.value);
      }
    }, {
      flush: 'post'
    });
    // ============================ Cursor ============================
    (0, _vue.watch)(inputValue, () => {
      if (props.formatter) {
        restoreCursor();
      }
    }, {
      flush: 'post'
    });
    (0, _vue.watch)(() => props.disabled, val => {
      if (val) {
        focus.value = false;
      }
    });
    expose({
      focus: () => {
        var _a;
        (_a = inputRef.value) === null || _a === void 0 ? void 0 : _a.focus();
      },
      blur: () => {
        var _a;
        (_a = inputRef.value) === null || _a === void 0 ? void 0 : _a.blur();
      }
    });
    return () => {
      const _a = (0, _extends2.default)((0, _extends2.default)({}, attrs), props),
        {
          prefixCls = 'rc-input-number',
          min,
          max,
          step = 1,
          defaultValue,
          value,
          disabled,
          readonly,
          keyboard,
          controls = true,
          autofocus,
          stringMode,
          parser,
          formatter,
          precision,
          decimalSeparator,
          onChange,
          onInput,
          onPressEnter,
          onStep,
          lazy,
          class: className,
          style
        } = _a,
        inputProps = __rest(_a, ["prefixCls", "min", "max", "step", "defaultValue", "value", "disabled", "readonly", "keyboard", "controls", "autofocus", "stringMode", "parser", "formatter", "precision", "decimalSeparator", "onChange", "onInput", "onPressEnter", "onStep", "lazy", "class", "style"]);
      const {
        upHandler,
        downHandler
      } = slots;
      const inputClassName = `${prefixCls}-input`;
      const eventProps = {};
      if (lazy) {
        eventProps.onChange = onInternalInput;
      } else {
        eventProps.onInput = onInternalInput;
      }
      return (0, _vue.createVNode)("div", {
        "class": (0, _classNames.default)(prefixCls, className, {
          [`${prefixCls}-focused`]: focus.value,
          [`${prefixCls}-disabled`]: disabled,
          [`${prefixCls}-readonly`]: readonly,
          [`${prefixCls}-not-a-number`]: decimalValue.value.isNaN(),
          [`${prefixCls}-out-of-range`]: !decimalValue.value.isInvalidate() && !isInRange(decimalValue.value)
        }),
        "style": style,
        "onKeydown": onKeyDown,
        "onKeyup": onKeyUp
      }, [controls && (0, _vue.createVNode)(_StepHandler.default, {
        "prefixCls": prefixCls,
        "upDisabled": upDisabled.value,
        "downDisabled": downDisabled.value,
        "onStep": onInternalStep
      }, {
        upNode: upHandler,
        downNode: downHandler
      }), (0, _vue.createVNode)("div", {
        "class": `${inputClassName}-wrap`
      }, [(0, _vue.createVNode)("input", (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({
        "autofocus": autofocus,
        "autocomplete": "off",
        "role": "spinbutton",
        "aria-valuemin": min,
        "aria-valuemax": max,
        "aria-valuenow": decimalValue.value.isInvalidate() ? null : decimalValue.value.toString(),
        "step": step
      }, inputProps), {}, {
        "ref": inputRef,
        "class": inputClassName,
        "value": inputValue.value,
        "disabled": disabled,
        "readonly": readonly,
        "onFocus": e => {
          focus.value = true;
          emit('focus', e);
        }
      }, eventProps), {}, {
        "onBlur": onBlur,
        "onCompositionstart": onCompositionStart,
        "onCompositionend": onCompositionEnd,
        "onBeforeinput": onBeforeInput
      }), null)])]);
    };
  }
});