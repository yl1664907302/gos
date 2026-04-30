"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _KeyCode = _interopRequireDefault(require("./KeyCode"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

/**
 * Wrap of sub component which need use as Button capacity (like Icon component).
 * This helps accessibility reader to tread as a interactive button to operation.
 */

const inlineStyle = {
  border: 0,
  background: 'transparent',
  padding: 0,
  lineHeight: 'inherit',
  display: 'inline-block'
};
const TransButton = (0, _vue.defineComponent)({
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
    const domRef = (0, _vue.shallowRef)();
    const onKeyDown = event => {
      const {
        keyCode
      } = event;
      if (keyCode === _KeyCode.default.ENTER) {
        event.preventDefault();
      }
    };
    const onKeyUp = event => {
      const {
        keyCode
      } = event;
      if (keyCode === _KeyCode.default.ENTER) {
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
    (0, _vue.onMounted)(() => {
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
        mergedStyle = (0, _extends2.default)({}, inlineStyle);
      }
      if (disabled) {
        mergedStyle.pointerEvents = 'none';
      }
      return (0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({
        "role": "button",
        "tabindex": 0,
        "ref": domRef
      }, restProps), attrs), {}, {
        "onClick": onClick,
        "onKeydown": onKeyDown,
        "onKeyup": onKeyUp,
        "style": (0, _extends2.default)((0, _extends2.default)({}, mergedStyle), attrs.style || {})
      }), [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]);
    };
  }
});
var _default = exports.default = TransButton;