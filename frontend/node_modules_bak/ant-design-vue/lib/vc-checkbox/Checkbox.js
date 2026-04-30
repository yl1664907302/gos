"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.checkboxProps = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _propsUtil = require("../_util/props-util");
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const checkboxProps = exports.checkboxProps = {
  prefixCls: String,
  name: String,
  id: String,
  type: String,
  defaultChecked: {
    type: [Boolean, Number],
    default: undefined
  },
  checked: {
    type: [Boolean, Number],
    default: undefined
  },
  disabled: Boolean,
  tabindex: {
    type: [Number, String]
  },
  readonly: Boolean,
  autofocus: Boolean,
  value: _vueTypes.default.any,
  required: Boolean
};
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'Checkbox',
  inheritAttrs: false,
  props: (0, _propsUtil.initDefaultProps)(checkboxProps, {
    prefixCls: 'rc-checkbox',
    type: 'checkbox',
    defaultChecked: false
  }),
  emits: ['click', 'change'],
  setup(props, _ref) {
    let {
      attrs,
      emit,
      expose
    } = _ref;
    const checked = (0, _vue.ref)(props.checked === undefined ? props.defaultChecked : props.checked);
    const inputRef = (0, _vue.ref)();
    (0, _vue.watch)(() => props.checked, () => {
      checked.value = props.checked;
    });
    expose({
      focus() {
        var _a;
        (_a = inputRef.value) === null || _a === void 0 ? void 0 : _a.focus();
      },
      blur() {
        var _a;
        (_a = inputRef.value) === null || _a === void 0 ? void 0 : _a.blur();
      }
    });
    const eventShiftKey = (0, _vue.ref)();
    const handleChange = e => {
      if (props.disabled) {
        return;
      }
      if (props.checked === undefined) {
        checked.value = e.target.checked;
      }
      e.shiftKey = eventShiftKey.value;
      const eventObj = {
        target: (0, _extends2.default)((0, _extends2.default)({}, props), {
          checked: e.target.checked
        }),
        stopPropagation() {
          e.stopPropagation();
        },
        preventDefault() {
          e.preventDefault();
        },
        nativeEvent: e
      };
      // fix https://github.com/vueComponent/ant-design-vue/issues/3047
      // 受控模式下维持现有状态
      if (props.checked !== undefined) {
        inputRef.value.checked = !!props.checked;
      }
      emit('change', eventObj);
      eventShiftKey.value = false;
    };
    const onClick = e => {
      emit('click', e);
      // onChange没能获取到shiftKey，使用onClick hack
      eventShiftKey.value = e.shiftKey;
    };
    return () => {
      const {
          prefixCls,
          name,
          id,
          type,
          disabled,
          readonly,
          tabindex,
          autofocus,
          value,
          required
        } = props,
        others = __rest(props, ["prefixCls", "name", "id", "type", "disabled", "readonly", "tabindex", "autofocus", "value", "required"]);
      const {
        class: className,
        onFocus,
        onBlur,
        onKeydown,
        onKeypress,
        onKeyup
      } = attrs;
      const othersAndAttrs = (0, _extends2.default)((0, _extends2.default)({}, others), attrs);
      const globalProps = Object.keys(othersAndAttrs).reduce((prev, key) => {
        if (key.startsWith('data-') || key.startsWith('aria-') || key === 'role') {
          prev[key] = othersAndAttrs[key];
        }
        return prev;
      }, {});
      const classString = (0, _classNames.default)(prefixCls, className, {
        [`${prefixCls}-checked`]: checked.value,
        [`${prefixCls}-disabled`]: disabled
      });
      const inputProps = (0, _extends2.default)((0, _extends2.default)({
        name,
        id,
        type,
        readonly,
        disabled,
        tabindex,
        class: `${prefixCls}-input`,
        checked: !!checked.value,
        autofocus,
        value
      }, globalProps), {
        onChange: handleChange,
        onClick,
        onFocus,
        onBlur,
        onKeydown,
        onKeypress,
        onKeyup,
        required
      });
      return (0, _vue.createVNode)("span", {
        "class": classString
      }, [(0, _vue.createVNode)("input", (0, _objectSpread2.default)({
        "ref": inputRef
      }, inputProps), null), (0, _vue.createVNode)("span", {
        "class": `${prefixCls}-inner`
      }, null)]);
    };
  }
});