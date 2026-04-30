import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import { computed, defineComponent, shallowRef, ref, watch } from 'vue';
import PropTypes from './vue-types';
import BaseInputInner from './BaseInputInner';
import { styleObjectToString } from '../vc-util/Dom/css';
const BaseInput = defineComponent({
  compatConfig: {
    MODE: 3
  },
  inheritAttrs: false,
  props: {
    disabled: PropTypes.looseBool,
    type: PropTypes.string,
    value: PropTypes.any,
    lazy: PropTypes.bool.def(true),
    tag: {
      type: String,
      default: 'input'
    },
    size: PropTypes.string,
    style: PropTypes.oneOfType([String, Object]),
    class: PropTypes.string
  },
  emits: ['change', 'input', 'blur', 'keydown', 'focus', 'compositionstart', 'compositionend', 'keyup', 'paste', 'mousedown'],
  setup(props, _ref) {
    let {
      emit,
      attrs,
      expose
    } = _ref;
    const inputRef = shallowRef(null);
    const renderValue = ref();
    const isComposing = ref(false);
    watch([() => props.value, isComposing], () => {
      if (isComposing.value) return;
      renderValue.value = props.value;
    }, {
      immediate: true
    });
    const handleChange = e => {
      emit('change', e);
    };
    const onCompositionstart = e => {
      isComposing.value = true;
      e.target.composing = true;
      emit('compositionstart', e);
    };
    const onCompositionend = e => {
      isComposing.value = false;
      e.target.composing = false;
      emit('compositionend', e);
      const event = document.createEvent('HTMLEvents');
      event.initEvent('input', true, true);
      e.target.dispatchEvent(event);
      handleChange(e);
    };
    const handleInput = e => {
      if (isComposing.value && props.lazy) {
        renderValue.value = e.target.value;
        return;
      }
      emit('input', e);
    };
    const handleBlur = e => {
      emit('blur', e);
    };
    const handleFocus = e => {
      emit('focus', e);
    };
    const focus = () => {
      if (inputRef.value) {
        inputRef.value.focus();
      }
    };
    const blur = () => {
      if (inputRef.value) {
        inputRef.value.blur();
      }
    };
    const handleKeyDown = e => {
      emit('keydown', e);
    };
    const handleKeyUp = e => {
      emit('keyup', e);
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
      input: computed(() => {
        var _a;
        return (_a = inputRef.value) === null || _a === void 0 ? void 0 : _a.input;
      }),
      setSelectionRange,
      select,
      getSelectionStart: () => {
        var _a;
        return (_a = inputRef.value) === null || _a === void 0 ? void 0 : _a.getSelectionStart();
      },
      getSelectionEnd: () => {
        var _a;
        return (_a = inputRef.value) === null || _a === void 0 ? void 0 : _a.getSelectionEnd();
      },
      getScrollTop: () => {
        var _a;
        return (_a = inputRef.value) === null || _a === void 0 ? void 0 : _a.getScrollTop();
      }
    });
    const handleMousedown = e => {
      emit('mousedown', e);
    };
    const handlePaste = e => {
      emit('paste', e);
    };
    const styleString = computed(() => {
      return props.style && typeof props.style !== 'string' ? styleObjectToString(props.style) : props.style;
    });
    return () => {
      const {
          style,
          lazy
        } = props,
        restProps = __rest(props, ["style", "lazy"]);
      return _createVNode(BaseInputInner, _objectSpread(_objectSpread(_objectSpread({}, restProps), attrs), {}, {
        "style": styleString.value,
        "onInput": handleInput,
        "onChange": handleChange,
        "onBlur": handleBlur,
        "onFocus": handleFocus,
        "ref": inputRef,
        "value": renderValue.value,
        "onCompositionstart": onCompositionstart,
        "onCompositionend": onCompositionend,
        "onKeyup": handleKeyUp,
        "onKeydown": handleKeyDown,
        "onPaste": handlePaste,
        "onMousedown": handleMousedown
      }), null);
    };
  }
});
export default BaseInput;