"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _vueTypes = _interopRequireDefault(require("./vue-types"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const BaseInputInner = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  // inheritAttrs: false,
  props: {
    disabled: _vueTypes.default.looseBool,
    type: _vueTypes.default.string,
    value: _vueTypes.default.any,
    tag: {
      type: String,
      default: 'input'
    },
    size: _vueTypes.default.string,
    onChange: Function,
    onInput: Function,
    onBlur: Function,
    onFocus: Function,
    onKeydown: Function,
    onCompositionstart: Function,
    onCompositionend: Function,
    onKeyup: Function,
    onPaste: Function,
    onMousedown: Function
  },
  emits: ['change', 'input', 'blur', 'keydown', 'focus', 'compositionstart', 'compositionend', 'keyup', 'paste', 'mousedown'],
  setup(props, _ref) {
    let {
      expose
    } = _ref;
    const inputRef = (0, _vue.shallowRef)(null);
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
      select,
      getSelectionStart: () => {
        var _a;
        return (_a = inputRef.value) === null || _a === void 0 ? void 0 : _a.selectionStart;
      },
      getSelectionEnd: () => {
        var _a;
        return (_a = inputRef.value) === null || _a === void 0 ? void 0 : _a.selectionEnd;
      },
      getScrollTop: () => {
        var _a;
        return (_a = inputRef.value) === null || _a === void 0 ? void 0 : _a.scrollTop;
      }
    });
    return () => {
      const {
          tag: Tag,
          value
        } = props,
        restProps = __rest(props, ["tag", "value"]);
      return (0, _vue.createVNode)(Tag, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, restProps), {}, {
        "ref": inputRef,
        "value": value
      }), null);
    };
  }
});
var _default = exports.default = BaseInputInner;