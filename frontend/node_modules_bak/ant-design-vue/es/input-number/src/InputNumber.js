import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode, resolveDirective as _resolveDirective } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import getMiniDecimal, { toFixed } from './utils/MiniDecimal';
import StepHandler from './StepHandler';
import { getNumberPrecision, num2str, validateNumber } from './utils/numberUtil';
import useCursor from './hooks/useCursor';
import useFrame from './hooks/useFrame';
import { watch, computed, shallowRef, defineComponent } from 'vue';
import KeyCode from '../../_util/KeyCode';
import classNames from '../../_util/classNames';
import { booleanType, stringType, someType, functionType } from '../../_util/type';
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
  const decimal = getMiniDecimal(value);
  return decimal.isInvalidate() ? null : decimal;
};
export const inputNumberProps = () => ({
  /** value will show as string */
  stringMode: booleanType(),
  defaultValue: someType([String, Number]),
  value: someType([String, Number]),
  prefixCls: stringType(),
  min: someType([String, Number]),
  max: someType([String, Number]),
  step: someType([String, Number], 1),
  tabindex: Number,
  controls: booleanType(true),
  readonly: booleanType(),
  disabled: booleanType(),
  autofocus: booleanType(),
  keyboard: booleanType(true),
  /** Parse display value to validate number */
  parser: functionType(),
  /** Transform `value` to display value show in input */
  formatter: functionType(),
  /** Syntactic sugar of `formatter`. Config precision of display. */
  precision: Number,
  /** Syntactic sugar of `formatter`. Config decimal separator of display. */
  decimalSeparator: String,
  onInput: functionType(),
  onChange: functionType(),
  onPressEnter: functionType(),
  onStep: functionType(),
  onBlur: functionType(),
  onFocus: functionType()
});
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'InnerInputNumber',
  inheritAttrs: false,
  props: _extends(_extends({}, inputNumberProps()), {
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
    const inputRef = shallowRef();
    const focus = shallowRef(false);
    const userTypingRef = shallowRef(false);
    const compositionRef = shallowRef(false);
    const decimalValue = shallowRef(getMiniDecimal(props.value));
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
      return Math.max(getNumberPrecision(numStr), getNumberPrecision(props.step));
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
    const inputValue = shallowRef('');
    const mergedFormatter = (number, userTyping) => {
      if (props.formatter) {
        return props.formatter(number, {
          userTyping,
          input: String(inputValue.value)
        });
      }
      let str = typeof number === 'number' ? num2str(number) : number;
      // User typing will not auto format with precision directly
      if (!userTyping) {
        const mergedPrecision = getPrecision(str, userTyping);
        if (validateNumber(str) && (props.decimalSeparator || mergedPrecision >= 0)) {
          // Separator
          const separatorStr = props.decimalSeparator || '.';
          str = toFixed(str, separatorStr, mergedPrecision);
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
    const maxDecimal = computed(() => getDecimalIfValidate(props.max));
    const minDecimal = computed(() => getDecimalIfValidate(props.min));
    const upDisabled = computed(() => {
      if (!maxDecimal.value || !decimalValue.value || decimalValue.value.isInvalidate()) {
        return false;
      }
      return maxDecimal.value.lessEquals(decimalValue.value);
    });
    const downDisabled = computed(() => {
      if (!minDecimal.value || !decimalValue.value || decimalValue.value.isInvalidate()) {
        return false;
      }
      return decimalValue.value.lessEquals(minDecimal.value);
    });
    // Cursor controller
    const [recordCursor, restoreCursor] = useCursor(inputRef, focus);
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
          updateValue = getMiniDecimal(toFixed(numStr, '.', mergedPrecision));
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
    const onNextPromise = useFrame();
    // >>> Collect input value
    const collectInputValue = inputStr => {
      var _a;
      recordCursor();
      // Update inputValue incase input can not parse as number
      inputValue.value = inputStr;
      // Parse number
      if (!compositionRef.value) {
        const finalValue = mergedParser(inputStr);
        const finalDecimal = getMiniDecimal(finalValue);
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
      let stepDecimal = getMiniDecimal(props.step);
      if (!up) {
        stepDecimal = stepDecimal.negate();
      }
      const target = (decimalValue.value || getMiniDecimal(0)).add(stepDecimal.toString());
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
      const parsedValue = getMiniDecimal(mergedParser(inputValue.value));
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
      if (which === KeyCode.ENTER) {
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
      if (!compositionRef.value && [KeyCode.UP, KeyCode.DOWN].includes(which)) {
        onInternalStep(KeyCode.UP === which);
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
    watch(() => props.precision, () => {
      if (!decimalValue.value.isInvalidate()) {
        setInputValue(decimalValue.value, false);
      }
    }, {
      flush: 'post'
    });
    // Input by value
    watch(() => props.value, () => {
      const newValue = getMiniDecimal(props.value);
      decimalValue.value = newValue;
      const currentParsedValue = getMiniDecimal(mergedParser(inputValue.value));
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
    watch(inputValue, () => {
      if (props.formatter) {
        restoreCursor();
      }
    }, {
      flush: 'post'
    });
    watch(() => props.disabled, val => {
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
      const _a = _extends(_extends({}, attrs), props),
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
      return _createVNode("div", {
        "class": classNames(prefixCls, className, {
          [`${prefixCls}-focused`]: focus.value,
          [`${prefixCls}-disabled`]: disabled,
          [`${prefixCls}-readonly`]: readonly,
          [`${prefixCls}-not-a-number`]: decimalValue.value.isNaN(),
          [`${prefixCls}-out-of-range`]: !decimalValue.value.isInvalidate() && !isInRange(decimalValue.value)
        }),
        "style": style,
        "onKeydown": onKeyDown,
        "onKeyup": onKeyUp
      }, [controls && _createVNode(StepHandler, {
        "prefixCls": prefixCls,
        "upDisabled": upDisabled.value,
        "downDisabled": downDisabled.value,
        "onStep": onInternalStep
      }, {
        upNode: upHandler,
        downNode: downHandler
      }), _createVNode("div", {
        "class": `${inputClassName}-wrap`
      }, [_createVNode("input", _objectSpread(_objectSpread(_objectSpread({
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