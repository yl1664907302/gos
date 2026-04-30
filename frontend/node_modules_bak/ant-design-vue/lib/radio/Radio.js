"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.radioProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _Checkbox = _interopRequireDefault(require("../vc-checkbox/Checkbox"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _FormItemContext = require("../form/FormItemContext");
var _omit = _interopRequireDefault(require("../_util/omit"));
var _context = require("./context");
var _type = require("../_util/type");
var _style = _interopRequireDefault(require("./style"));
var _DisabledContext = require("../config-provider/DisabledContext");
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

// CSSINJS

const radioProps = () => ({
  prefixCls: String,
  checked: (0, _type.booleanType)(),
  disabled: (0, _type.booleanType)(),
  isGroup: (0, _type.booleanType)(),
  value: _vueTypes.default.any,
  name: String,
  id: String,
  autofocus: (0, _type.booleanType)(),
  onChange: (0, _type.functionType)(),
  onFocus: (0, _type.functionType)(),
  onBlur: (0, _type.functionType)(),
  onClick: (0, _type.functionType)(),
  'onUpdate:checked': (0, _type.functionType)(),
  'onUpdate:value': (0, _type.functionType)()
});
exports.radioProps = radioProps;
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ARadio',
  inheritAttrs: false,
  props: radioProps(),
  setup(props, _ref) {
    let {
      emit,
      expose,
      slots,
      attrs
    } = _ref;
    const formItemContext = (0, _FormItemContext.useInjectFormItemContext)();
    const formItemInputContext = _FormItemContext.FormItemInputContext.useInject();
    const radioOptionTypeContext = (0, _context.useInjectRadioOptionTypeContext)();
    const radioGroupContext = (0, _context.useInjectRadioGroupContext)();
    const disabledContext = (0, _DisabledContext.useInjectDisabled)();
    const mergedDisabled = (0, _vue.computed)(() => {
      var _a;
      return (_a = disabled.value) !== null && _a !== void 0 ? _a : disabledContext.value;
    });
    const vcCheckbox = (0, _vue.ref)();
    const {
      prefixCls: radioPrefixCls,
      direction,
      disabled
    } = (0, _useConfigInject.default)('radio', props);
    const prefixCls = (0, _vue.computed)(() => (radioGroupContext === null || radioGroupContext === void 0 ? void 0 : radioGroupContext.optionType.value) === 'button' || radioOptionTypeContext === 'button' ? `${radioPrefixCls.value}-button` : radioPrefixCls.value);
    const contextDisabled = (0, _DisabledContext.useInjectDisabled)();
    // Style
    const [wrapSSR, hashId] = (0, _style.default)(radioPrefixCls);
    const focus = () => {
      vcCheckbox.value.focus();
    };
    const blur = () => {
      vcCheckbox.value.blur();
    };
    expose({
      focus,
      blur
    });
    const handleChange = event => {
      const targetChecked = event.target.checked;
      emit('update:checked', targetChecked);
      emit('update:value', targetChecked);
      emit('change', event);
      formItemContext.onFieldChange();
    };
    const onChange = e => {
      emit('change', e);
      if (radioGroupContext && radioGroupContext.onChange) {
        radioGroupContext.onChange(e);
      }
    };
    return () => {
      var _a;
      const radioGroup = radioGroupContext;
      const {
          prefixCls: customizePrefixCls,
          id = formItemContext.id.value
        } = props,
        restProps = __rest(props, ["prefixCls", "id"]);
      const rProps = (0, _extends2.default)((0, _extends2.default)({
        prefixCls: prefixCls.value,
        id
      }, (0, _omit.default)(restProps, ['onUpdate:checked', 'onUpdate:value'])), {
        disabled: (_a = disabled.value) !== null && _a !== void 0 ? _a : contextDisabled.value
      });
      if (radioGroup) {
        rProps.name = radioGroup.name.value;
        rProps.onChange = onChange;
        rProps.checked = props.value === radioGroup.value.value;
        rProps.disabled = mergedDisabled.value || radioGroup.disabled.value;
      } else {
        rProps.onChange = handleChange;
      }
      const wrapperClassString = (0, _classNames.default)({
        [`${prefixCls.value}-wrapper`]: true,
        [`${prefixCls.value}-wrapper-checked`]: rProps.checked,
        [`${prefixCls.value}-wrapper-disabled`]: rProps.disabled,
        [`${prefixCls.value}-wrapper-rtl`]: direction.value === 'rtl',
        [`${prefixCls.value}-wrapper-in-form-item`]: formItemInputContext.isFormItemInput
      }, attrs.class, hashId.value);
      return wrapSSR((0, _vue.createVNode)("label", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "class": wrapperClassString
      }), [(0, _vue.createVNode)(_Checkbox.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, rProps), {}, {
        "type": "radio",
        "ref": vcCheckbox
      }), null), slots.default && (0, _vue.createVNode)("span", null, [slots.default()])]));
    };
  }
});