"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.radioGroupProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _Radio = _interopRequireDefault(require("./Radio"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _type = require("../_util/type");
var _FormItemContext = require("../form/FormItemContext");
var _context = require("./context");
var _style = _interopRequireDefault(require("./style"));
// CSSINJS

const RadioGroupSizeTypes = ['large', 'default', 'small'];
const radioGroupProps = () => ({
  prefixCls: String,
  value: _vueTypes.default.any,
  size: (0, _type.stringType)(),
  options: (0, _type.arrayType)(),
  disabled: (0, _type.booleanType)(),
  name: String,
  buttonStyle: (0, _type.stringType)('outline'),
  id: String,
  optionType: (0, _type.stringType)('default'),
  onChange: (0, _type.functionType)(),
  'onUpdate:value': (0, _type.functionType)()
});
exports.radioGroupProps = radioGroupProps;
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ARadioGroup',
  inheritAttrs: false,
  props: radioGroupProps(),
  // emits: ['update:value', 'change'],
  setup(props, _ref) {
    let {
      slots,
      emit,
      attrs
    } = _ref;
    const formItemContext = (0, _FormItemContext.useInjectFormItemContext)();
    const {
      prefixCls,
      direction,
      size
    } = (0, _useConfigInject.default)('radio', props);
    // Style
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const stateValue = (0, _vue.ref)(props.value);
    const updatingValue = (0, _vue.ref)(false);
    (0, _vue.watch)(() => props.value, val => {
      stateValue.value = val;
      updatingValue.value = false;
    });
    const onRadioChange = ev => {
      const lastValue = stateValue.value;
      const {
        value
      } = ev.target;
      if (!('value' in props)) {
        stateValue.value = value;
      }
      // nextTick for https://github.com/vueComponent/ant-design-vue/issues/1280
      if (!updatingValue.value && value !== lastValue) {
        updatingValue.value = true;
        emit('update:value', value);
        emit('change', ev);
        formItemContext.onFieldChange();
      }
      (0, _vue.nextTick)(() => {
        updatingValue.value = false;
      });
    };
    (0, _context.useProvideRadioGroupContext)({
      onChange: onRadioChange,
      value: stateValue,
      disabled: (0, _vue.computed)(() => props.disabled),
      name: (0, _vue.computed)(() => props.name),
      optionType: (0, _vue.computed)(() => props.optionType)
    });
    return () => {
      var _a;
      const {
        options,
        buttonStyle,
        id = formItemContext.id.value
      } = props;
      const groupPrefixCls = `${prefixCls.value}-group`;
      const classString = (0, _classNames.default)(groupPrefixCls, `${groupPrefixCls}-${buttonStyle}`, {
        [`${groupPrefixCls}-${size.value}`]: size.value,
        [`${groupPrefixCls}-rtl`]: direction.value === 'rtl'
      }, attrs.class, hashId.value);
      let children = null;
      if (options && options.length > 0) {
        children = options.map(option => {
          if (typeof option === 'string' || typeof option === 'number') {
            return (0, _vue.createVNode)(_Radio.default, {
              "key": option,
              "prefixCls": prefixCls.value,
              "disabled": props.disabled,
              "value": option,
              "checked": stateValue.value === option
            }, {
              default: () => [option]
            });
          }
          const {
            value,
            disabled,
            label
          } = option;
          return (0, _vue.createVNode)(_Radio.default, {
            "key": `radio-group-value-options-${value}`,
            "prefixCls": prefixCls.value,
            "disabled": disabled || props.disabled,
            "value": value,
            "checked": stateValue.value === value
          }, {
            default: () => [label]
          });
        });
      } else {
        children = (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
      }
      return wrapSSR((0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "class": classString,
        "id": id
      }), [children]));
    };
  }
});