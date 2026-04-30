"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _classNames = _interopRequireDefault(require("../../_util/classNames"));
var _KeyCode = _interopRequireDefault(require("../../_util/KeyCode"));
var _propsUtil = require("../../_util/props-util");
var _util = require("./util");
var _KeywordTrigger = _interopRequireDefault(require("./KeywordTrigger"));
var _mentionsProps = require("./mentionsProps");
var _MentionsContext = _interopRequireDefault(require("./MentionsContext"));
var _omit = _interopRequireDefault(require("../../_util/omit"));
var _BaseInput = _interopRequireDefault(require("../../_util/BaseInput"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
function noop() {}
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'Mentions',
  inheritAttrs: false,
  props: (0, _propsUtil.initDefaultProps)(_mentionsProps.vcMentionsProps, _mentionsProps.defaultProps),
  emits: ['change', 'select', 'search', 'focus', 'blur', 'pressenter'],
  setup(props, _ref) {
    let {
      emit,
      attrs,
      expose,
      slots
    } = _ref;
    const measure = (0, _vue.ref)(null);
    const textarea = (0, _vue.ref)(null);
    const focusId = (0, _vue.ref)();
    const state = (0, _vue.reactive)({
      value: props.value || '',
      measuring: false,
      measureLocation: 0,
      measureText: null,
      measurePrefix: '',
      activeIndex: 0,
      isFocus: false
    });
    (0, _vue.watchEffect)(() => {
      state.value = props.value;
    });
    const triggerChange = val => {
      emit('change', val);
    };
    const onChange = _ref2 => {
      let {
        target: {
          value
        }
      } = _ref2;
      triggerChange(value);
    };
    const startMeasure = (measureText, measurePrefix, measureLocation) => {
      (0, _extends2.default)(state, {
        measuring: true,
        measureText,
        measurePrefix,
        measureLocation,
        activeIndex: 0
      });
    };
    const stopMeasure = callback => {
      (0, _extends2.default)(state, {
        measuring: false,
        measureLocation: 0,
        measureText: null
      });
      callback === null || callback === void 0 ? void 0 : callback();
    };
    const onKeyDown = event => {
      const {
        which
      } = event;
      // Skip if not measuring
      if (!state.measuring) {
        return;
      }
      if (which === _KeyCode.default.UP || which === _KeyCode.default.DOWN) {
        // Control arrow function
        const optionLen = options.value.length;
        const offset = which === _KeyCode.default.UP ? -1 : 1;
        const newActiveIndex = (state.activeIndex + offset + optionLen) % optionLen;
        state.activeIndex = newActiveIndex;
        event.preventDefault();
      } else if (which === _KeyCode.default.ESC) {
        stopMeasure();
      } else if (which === _KeyCode.default.ENTER) {
        // Measure hit
        event.preventDefault();
        if (!options.value.length) {
          stopMeasure();
          return;
        }
        const option = options.value[state.activeIndex];
        selectOption(option);
      }
    };
    const onKeyUp = event => {
      const {
        key,
        which
      } = event;
      const {
        measureText: prevMeasureText,
        measuring
      } = state;
      const {
        prefix,
        validateSearch
      } = props;
      const target = event.target;
      if (target.composing) {
        return;
      }
      const selectionStartText = (0, _util.getBeforeSelectionText)(target);
      const {
        location: measureIndex,
        prefix: measurePrefix
      } = (0, _util.getLastMeasureIndex)(selectionStartText, prefix);
      // Skip if match the white key list
      if ([_KeyCode.default.ESC, _KeyCode.default.UP, _KeyCode.default.DOWN, _KeyCode.default.ENTER].indexOf(which) !== -1) {
        return;
      }
      if (measureIndex !== -1) {
        const measureText = selectionStartText.slice(measureIndex + measurePrefix.length);
        const validateMeasure = validateSearch(measureText, props);
        const matchOption = !!getOptions(measureText).length;
        if (validateMeasure) {
          if (key === measurePrefix || key === 'Shift' || measuring || measureText !== prevMeasureText && matchOption) {
            startMeasure(measureText, measurePrefix, measureIndex);
          }
        } else if (measuring) {
          // Stop if measureText is invalidate
          stopMeasure();
        }
        /**
         * We will trigger `onSearch` to developer since they may use for async update.
         * If met `space` means user finished searching.
         */
        if (validateMeasure) {
          emit('search', measureText, measurePrefix);
        }
      } else if (measuring) {
        stopMeasure();
      }
    };
    const onPressEnter = event => {
      if (!state.measuring) {
        emit('pressenter', event);
      }
    };
    const onInputFocus = event => {
      onFocus(event);
    };
    const onInputBlur = event => {
      onBlur(event);
    };
    const onFocus = event => {
      clearTimeout(focusId.value);
      const {
        isFocus
      } = state;
      if (!isFocus && event) {
        emit('focus', event);
      }
      state.isFocus = true;
    };
    const onBlur = event => {
      focusId.value = setTimeout(() => {
        state.isFocus = false;
        stopMeasure();
        emit('blur', event);
      }, 100);
    };
    const selectOption = option => {
      const {
        split
      } = props;
      const {
        value: mentionValue = ''
      } = option;
      const {
        text,
        selectionLocation
      } = (0, _util.replaceWithMeasure)(state.value, {
        measureLocation: state.measureLocation,
        targetText: mentionValue,
        prefix: state.measurePrefix,
        selectionStart: textarea.value.getSelectionStart(),
        split
      });
      triggerChange(text);
      stopMeasure(() => {
        // We need restore the selection position
        (0, _util.setInputSelection)(textarea.value.input, selectionLocation);
      });
      emit('select', option, state.measurePrefix);
    };
    const setActiveIndex = activeIndex => {
      state.activeIndex = activeIndex;
    };
    const getOptions = measureText => {
      const targetMeasureText = measureText || state.measureText || '';
      const {
        filterOption
      } = props;
      const list = props.options.filter(option => {
        /** Return all result if `filterOption` is false. */
        if (!!filterOption === false) {
          return true;
        }
        return filterOption(targetMeasureText, option);
      });
      return list;
    };
    const options = (0, _vue.computed)(() => {
      return getOptions();
    });
    const focus = () => {
      textarea.value.focus();
    };
    const blur = () => {
      textarea.value.blur();
    };
    expose({
      blur,
      focus
    });
    (0, _vue.provide)(_MentionsContext.default, {
      activeIndex: (0, _vue.toRef)(state, 'activeIndex'),
      setActiveIndex,
      selectOption,
      onFocus,
      onBlur,
      loading: (0, _vue.toRef)(props, 'loading')
    });
    (0, _vue.onUpdated)(() => {
      (0, _vue.nextTick)(() => {
        if (state.measuring) {
          measure.value.scrollTop = textarea.value.getScrollTop();
        }
      });
    });
    return () => {
      const {
        measureLocation,
        measurePrefix,
        measuring
      } = state;
      const {
          prefixCls,
          placement,
          transitionName,
          getPopupContainer,
          direction
        } = props,
        restProps = __rest(props, ["prefixCls", "placement", "transitionName", "getPopupContainer", "direction"]);
      const {
          class: className,
          style
        } = attrs,
        otherAttrs = __rest(attrs, ["class", "style"]);
      const inputProps = (0, _omit.default)(restProps, ['value', 'prefix', 'split', 'validateSearch', 'filterOption', 'options', 'loading']);
      const textareaProps = (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, inputProps), otherAttrs), {
        onChange: noop,
        onSelect: noop,
        value: state.value,
        onInput: onChange,
        onBlur: onInputBlur,
        onKeydown: onKeyDown,
        onKeyup: onKeyUp,
        onFocus: onInputFocus,
        onPressenter: onPressEnter
      });
      return (0, _vue.createVNode)("div", {
        "class": (0, _classNames.default)(prefixCls, className),
        "style": style
      }, [(0, _vue.createVNode)(_BaseInput.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, textareaProps), {}, {
        "ref": textarea,
        "tag": "textarea"
      }), null), measuring && (0, _vue.createVNode)("div", {
        "ref": measure,
        "class": `${prefixCls}-measure`
      }, [state.value.slice(0, measureLocation), (0, _vue.createVNode)(_KeywordTrigger.default, {
        "prefixCls": prefixCls,
        "transitionName": transitionName,
        "dropdownClassName": props.dropdownClassName,
        "placement": placement,
        "options": measuring ? options.value : [],
        "visible": true,
        "direction": direction,
        "getPopupContainer": getPopupContainer
      }, {
        default: () => [(0, _vue.createVNode)("span", null, [measurePrefix])],
        notFoundContent: slots.notFoundContent,
        option: slots.option
      }), state.value.slice(measureLocation + measurePrefix.length)])]);
    };
  }
});