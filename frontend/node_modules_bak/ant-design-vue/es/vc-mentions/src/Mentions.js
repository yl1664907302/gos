import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import { toRef, watchEffect, defineComponent, provide, ref, reactive, onUpdated, nextTick, computed } from 'vue';
import classNames from '../../_util/classNames';
import KeyCode from '../../_util/KeyCode';
import { initDefaultProps } from '../../_util/props-util';
import { getBeforeSelectionText, getLastMeasureIndex, replaceWithMeasure, setInputSelection } from './util';
import KeywordTrigger from './KeywordTrigger';
import { vcMentionsProps, defaultProps } from './mentionsProps';
import MentionsContextKey from './MentionsContext';
import omit from '../../_util/omit';
import BaseInput from '../../_util/BaseInput';
function noop() {}
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'Mentions',
  inheritAttrs: false,
  props: initDefaultProps(vcMentionsProps, defaultProps),
  emits: ['change', 'select', 'search', 'focus', 'blur', 'pressenter'],
  setup(props, _ref) {
    let {
      emit,
      attrs,
      expose,
      slots
    } = _ref;
    const measure = ref(null);
    const textarea = ref(null);
    const focusId = ref();
    const state = reactive({
      value: props.value || '',
      measuring: false,
      measureLocation: 0,
      measureText: null,
      measurePrefix: '',
      activeIndex: 0,
      isFocus: false
    });
    watchEffect(() => {
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
      _extends(state, {
        measuring: true,
        measureText,
        measurePrefix,
        measureLocation,
        activeIndex: 0
      });
    };
    const stopMeasure = callback => {
      _extends(state, {
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
      if (which === KeyCode.UP || which === KeyCode.DOWN) {
        // Control arrow function
        const optionLen = options.value.length;
        const offset = which === KeyCode.UP ? -1 : 1;
        const newActiveIndex = (state.activeIndex + offset + optionLen) % optionLen;
        state.activeIndex = newActiveIndex;
        event.preventDefault();
      } else if (which === KeyCode.ESC) {
        stopMeasure();
      } else if (which === KeyCode.ENTER) {
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
      const selectionStartText = getBeforeSelectionText(target);
      const {
        location: measureIndex,
        prefix: measurePrefix
      } = getLastMeasureIndex(selectionStartText, prefix);
      // Skip if match the white key list
      if ([KeyCode.ESC, KeyCode.UP, KeyCode.DOWN, KeyCode.ENTER].indexOf(which) !== -1) {
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
      } = replaceWithMeasure(state.value, {
        measureLocation: state.measureLocation,
        targetText: mentionValue,
        prefix: state.measurePrefix,
        selectionStart: textarea.value.getSelectionStart(),
        split
      });
      triggerChange(text);
      stopMeasure(() => {
        // We need restore the selection position
        setInputSelection(textarea.value.input, selectionLocation);
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
    const options = computed(() => {
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
    provide(MentionsContextKey, {
      activeIndex: toRef(state, 'activeIndex'),
      setActiveIndex,
      selectOption,
      onFocus,
      onBlur,
      loading: toRef(props, 'loading')
    });
    onUpdated(() => {
      nextTick(() => {
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
      const inputProps = omit(restProps, ['value', 'prefix', 'split', 'validateSearch', 'filterOption', 'options', 'loading']);
      const textareaProps = _extends(_extends(_extends({}, inputProps), otherAttrs), {
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
      return _createVNode("div", {
        "class": classNames(prefixCls, className),
        "style": style
      }, [_createVNode(BaseInput, _objectSpread(_objectSpread({}, textareaProps), {}, {
        "ref": textarea,
        "tag": "textarea"
      }), null), measuring && _createVNode("div", {
        "ref": measure,
        "class": `${prefixCls}-measure`
      }, [state.value.slice(0, measureLocation), _createVNode(KeywordTrigger, {
        "prefixCls": prefixCls,
        "transitionName": transitionName,
        "dropdownClassName": props.dropdownClassName,
        "placement": placement,
        "options": measuring ? options.value : [],
        "visible": true,
        "direction": direction,
        "getPopupContainer": getPopupContainer
      }, {
        default: () => [_createVNode("span", null, [measurePrefix])],
        notFoundContent: slots.notFoundContent,
        option: slots.option
      }), state.value.slice(measureLocation + measurePrefix.length)])]);
    };
  }
});