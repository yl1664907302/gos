"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _Checkbox = _interopRequireDefault(require("./Checkbox"));
var _FormItemContext = require("../form/FormItemContext");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _interface = require("./interface");
var _style = _interopRequireDefault(require("./style"));
// CSSINJS
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ACheckboxGroup',
  inheritAttrs: false,
  props: (0, _interface.checkboxGroupProps)(),
  // emits: ['change', 'update:value'],
  setup(props, _ref) {
    let {
      slots,
      attrs,
      emit,
      expose
    } = _ref;
    const formItemContext = (0, _FormItemContext.useInjectFormItemContext)();
    const {
      prefixCls,
      direction
    } = (0, _useConfigInject.default)('checkbox', props);
    const groupPrefixCls = (0, _vue.computed)(() => `${prefixCls.value}-group`);
    // style
    const [wrapSSR, hashId] = (0, _style.default)(groupPrefixCls);
    const mergedValue = (0, _vue.ref)((props.value === undefined ? props.defaultValue : props.value) || []);
    (0, _vue.watch)(() => props.value, () => {
      mergedValue.value = props.value || [];
    });
    const options = (0, _vue.computed)(() => {
      return props.options.map(option => {
        if (typeof option === 'string' || typeof option === 'number') {
          return {
            label: option,
            value: option
          };
        }
        return option;
      });
    });
    const triggerUpdate = (0, _vue.ref)(Symbol());
    const registeredValuesMap = (0, _vue.ref)(new Map());
    const cancelValue = id => {
      registeredValuesMap.value.delete(id);
      triggerUpdate.value = Symbol();
    };
    const registerValue = (id, value) => {
      registeredValuesMap.value.set(id, value);
      triggerUpdate.value = Symbol();
    };
    const registeredValues = (0, _vue.ref)(new Map());
    (0, _vue.watch)(triggerUpdate, () => {
      const valuseMap = new Map();
      for (const value of registeredValuesMap.value.values()) {
        valuseMap.set(value, true);
      }
      registeredValues.value = valuseMap;
    });
    const toggleOption = option => {
      const optionIndex = mergedValue.value.indexOf(option.value);
      const value = [...mergedValue.value];
      if (optionIndex === -1) {
        value.push(option.value);
      } else {
        value.splice(optionIndex, 1);
      }
      if (props.value === undefined) {
        mergedValue.value = value;
      }
      const val = value.filter(val => registeredValues.value.has(val)).sort((a, b) => {
        const indexA = options.value.findIndex(opt => opt.value === a);
        const indexB = options.value.findIndex(opt => opt.value === b);
        return indexA - indexB;
      });
      emit('update:value', val);
      emit('change', val);
      formItemContext.onFieldChange();
    };
    (0, _vue.provide)(_interface.CheckboxGroupContextKey, {
      cancelValue,
      registerValue,
      toggleOption,
      mergedValue,
      name: (0, _vue.computed)(() => props.name),
      disabled: (0, _vue.computed)(() => props.disabled)
    });
    expose({
      mergedValue
    });
    return () => {
      var _a;
      const {
        id = formItemContext.id.value
      } = props;
      let children = null;
      if (options.value && options.value.length > 0) {
        children = options.value.map(option => {
          var _a;
          return (0, _vue.createVNode)(_Checkbox.default, {
            "prefixCls": prefixCls.value,
            "key": option.value.toString(),
            "disabled": 'disabled' in option ? option.disabled : props.disabled,
            "indeterminate": option.indeterminate,
            "value": option.value,
            "checked": mergedValue.value.indexOf(option.value) !== -1,
            "onChange": option.onChange,
            "class": `${groupPrefixCls.value}-item`
          }, {
            default: () => [slots.label !== undefined ? (_a = slots.label) === null || _a === void 0 ? void 0 : _a.call(slots, option) : option.label]
          });
        });
      }
      return wrapSSR((0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "class": [groupPrefixCls.value, {
          [`${groupPrefixCls.value}-rtl`]: direction.value === 'rtl'
        }, attrs.class, hashId.value],
        "id": id
      }), [children || ((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots))]));
    };
  }
});