import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import { defineComponent, shallowRef, onMounted } from 'vue';
/**
 * Wrap of sub component which need use as Button capacity (like Icon component).
 * This helps accessibility reader to tread as a interactive button to operation.
 */
import KeyCode from './KeyCode';
const inlineStyle = {
  border: 0,
  background: 'transparent',
  padding: 0,
  lineHeight: 'inherit',
  display: 'inline-block'
};
const TransButton = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'TransButton',
  inheritAttrs: false,
  props: {
    noStyle: {
      type: Boolean,
      default: undefined
    },
    onClick: Function,
    disabled: {
      type: Boolean,
      default: undefined
    },
    autofocus: {
      type: Boolean,
      default: undefined
    }
  },
  setup(props, _ref) {
    let {
      slots,
      emit,
      attrs,
      expose
    } = _ref;
    const domRef = shallowRef();
    const onKeyDown = event => {
      const {
        keyCode
      } = event;
      if (keyCode === KeyCode.ENTER) {
        event.preventDefault();
      }
    };
    const onKeyUp = event => {
      const {
        keyCode
      } = event;
      if (keyCode === KeyCode.ENTER) {
        emit('click', event);
      }
    };
    const onClick = e => {
      emit('click', e);
    };
    const focus = () => {
      if (domRef.value) {
        domRef.value.focus();
      }
    };
    const blur = () => {
      if (domRef.value) {
        domRef.value.blur();
      }
    };
    onMounted(() => {
      if (props.autofocus) {
        focus();
      }
    });
    expose({
      focus,
      blur
    });
    return () => {
      var _a;
      const {
          noStyle,
          disabled
        } = props,
        restProps = __rest(props, ["noStyle", "disabled"]);
      let mergedStyle = {};
      if (!noStyle) {
        mergedStyle = _extends({}, inlineStyle);
      }
      if (disabled) {
        mergedStyle.pointerEvents = 'none';
      }
      return _createVNode("div", _objectSpread(_objectSpread(_objectSpread({
        "role": "button",
        "tabindex": 0,
        "ref": domRef
      }, restProps), attrs), {}, {
        "onClick": onClick,
        "onKeydown": onKeyDown,
        "onKeyup": onKeyUp,
        "style": _extends(_extends({}, mergedStyle), attrs.style || {})
      }), [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]);
    };
  }
});
export default TransButton;