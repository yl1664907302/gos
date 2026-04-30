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
var _Input = _interopRequireDefault(require("./Input"));
var _SearchOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/SearchOutlined"));
var _button = _interopRequireDefault(require("../button"));
var _vnode = require("../_util/vnode");
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _isPlainObject = _interopRequireDefault(require("lodash/isPlainObject"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _omit = _interopRequireDefault(require("../_util/omit"));
var _inputProps = _interopRequireDefault(require("./inputProps"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'AInputSearch',
  inheritAttrs: false,
  props: (0, _extends2.default)((0, _extends2.default)({}, (0, _inputProps.default)()), {
    inputPrefixCls: String,
    // 不能设置默认值 https://github.com/vueComponent/ant-design-vue/issues/1916
    enterButton: _vueTypes.default.any,
    onSearch: {
      type: Function
    }
  }),
  setup(props, _ref) {
    let {
      slots,
      attrs,
      expose,
      emit
    } = _ref;
    const inputRef = (0, _vue.shallowRef)();
    const composedRef = (0, _vue.shallowRef)(false);
    const focus = () => {
      var _a;
      (_a = inputRef.value) === null || _a === void 0 ? void 0 : _a.focus();
    };
    const blur = () => {
      var _a;
      (_a = inputRef.value) === null || _a === void 0 ? void 0 : _a.blur();
    };
    expose({
      focus,
      blur
    });
    const onChange = e => {
      emit('update:value', e.target.value);
      if (e && e.target && e.type === 'click') {
        emit('search', e.target.value, e);
      }
      emit('change', e);
    };
    const onMousedown = e => {
      var _a;
      if (document.activeElement === ((_a = inputRef.value) === null || _a === void 0 ? void 0 : _a.input)) {
        e.preventDefault();
      }
    };
    const onSearch = e => {
      var _a, _b;
      emit('search', (_b = (_a = inputRef.value) === null || _a === void 0 ? void 0 : _a.input) === null || _b === void 0 ? void 0 : _b.stateValue, e);
    };
    const onPressEnter = e => {
      if (composedRef.value || props.loading) {
        return;
      }
      onSearch(e);
    };
    const handleOnCompositionStart = e => {
      composedRef.value = true;
      emit('compositionstart', e);
    };
    const handleOnCompositionEnd = e => {
      composedRef.value = false;
      emit('compositionend', e);
    };
    const {
      prefixCls,
      getPrefixCls,
      direction,
      size
    } = (0, _useConfigInject.default)('input-search', props);
    const inputPrefixCls = (0, _vue.computed)(() => getPrefixCls('input', props.inputPrefixCls));
    return () => {
      var _a, _b, _c, _d;
      const {
          disabled,
          loading,
          addonAfter = (_a = slots.addonAfter) === null || _a === void 0 ? void 0 : _a.call(slots),
          suffix = (_b = slots.suffix) === null || _b === void 0 ? void 0 : _b.call(slots)
        } = props,
        restProps = __rest(props, ["disabled", "loading", "addonAfter", "suffix"]);
      let {
        enterButton = (_d = (_c = slots.enterButton) === null || _c === void 0 ? void 0 : _c.call(slots)) !== null && _d !== void 0 ? _d : false
      } = props;
      enterButton = enterButton || enterButton === '';
      const searchIcon = typeof enterButton === 'boolean' ? (0, _vue.createVNode)(_SearchOutlined.default, null, null) : null;
      const btnClassName = `${prefixCls.value}-button`;
      const enterButtonAsElement = Array.isArray(enterButton) ? enterButton[0] : enterButton;
      let button;
      const isAntdButton = enterButtonAsElement.type && (0, _isPlainObject.default)(enterButtonAsElement.type) && enterButtonAsElement.type.__ANT_BUTTON;
      if (isAntdButton || enterButtonAsElement.tagName === 'button') {
        button = (0, _vnode.cloneElement)(enterButtonAsElement, (0, _extends2.default)({
          onMousedown,
          onClick: onSearch,
          key: 'enterButton'
        }, isAntdButton ? {
          class: btnClassName,
          size: size.value
        } : {}), false);
      } else {
        const iconOnly = searchIcon && !enterButton;
        button = (0, _vue.createVNode)(_button.default, {
          "class": btnClassName,
          "type": enterButton ? 'primary' : undefined,
          "size": size.value,
          "disabled": disabled,
          "key": "enterButton",
          "onMousedown": onMousedown,
          "onClick": onSearch,
          "loading": loading,
          "icon": iconOnly ? searchIcon : null
        }, {
          default: () => [iconOnly ? null : searchIcon || enterButton]
        });
      }
      if (addonAfter) {
        button = [button, addonAfter];
      }
      const cls = (0, _classNames.default)(prefixCls.value, {
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        [`${prefixCls.value}-${size.value}`]: !!size.value,
        [`${prefixCls.value}-with-button`]: !!enterButton
      }, attrs.class);
      return (0, _vue.createVNode)(_Input.default, (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({
        "ref": inputRef
      }, (0, _omit.default)(restProps, ['onUpdate:value', 'onSearch', 'enterButton'])), attrs), {}, {
        "onPressEnter": onPressEnter,
        "onCompositionstart": handleOnCompositionStart,
        "onCompositionend": handleOnCompositionEnd,
        "size": size.value,
        "prefixCls": inputPrefixCls.value,
        "addonAfter": button,
        "suffix": suffix,
        "onChange": onChange,
        "class": cls,
        "disabled": disabled
      }), slots);
    };
  }
});