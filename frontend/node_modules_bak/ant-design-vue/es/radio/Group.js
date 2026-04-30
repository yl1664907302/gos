import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
import { nextTick, defineComponent, ref, watch, computed } from 'vue';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import Radio from './Radio';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { booleanType, stringType, arrayType, functionType } from '../_util/type';
import { useInjectFormItemContext } from '../form/FormItemContext';
import { useProvideRadioGroupContext } from './context';
// CSSINJS
import useStyle from './style';
const RadioGroupSizeTypes = ['large', 'default', 'small'];
export const radioGroupProps = () => ({
  prefixCls: String,
  value: PropTypes.any,
  size: stringType(),
  options: arrayType(),
  disabled: booleanType(),
  name: String,
  buttonStyle: stringType('outline'),
  id: String,
  optionType: stringType('default'),
  onChange: functionType(),
  'onUpdate:value': functionType()
});
export default defineComponent({
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
    const formItemContext = useInjectFormItemContext();
    const {
      prefixCls,
      direction,
      size
    } = useConfigInject('radio', props);
    // Style
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const stateValue = ref(props.value);
    const updatingValue = ref(false);
    watch(() => props.value, val => {
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
      nextTick(() => {
        updatingValue.value = false;
      });
    };
    useProvideRadioGroupContext({
      onChange: onRadioChange,
      value: stateValue,
      disabled: computed(() => props.disabled),
      name: computed(() => props.name),
      optionType: computed(() => props.optionType)
    });
    return () => {
      var _a;
      const {
        options,
        buttonStyle,
        id = formItemContext.id.value
      } = props;
      const groupPrefixCls = `${prefixCls.value}-group`;
      const classString = classNames(groupPrefixCls, `${groupPrefixCls}-${buttonStyle}`, {
        [`${groupPrefixCls}-${size.value}`]: size.value,
        [`${groupPrefixCls}-rtl`]: direction.value === 'rtl'
      }, attrs.class, hashId.value);
      let children = null;
      if (options && options.length > 0) {
        children = options.map(option => {
          if (typeof option === 'string' || typeof option === 'number') {
            return _createVNode(Radio, {
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
          return _createVNode(Radio, {
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
      return wrapSSR(_createVNode("div", _objectSpread(_objectSpread({}, attrs), {}, {
        "class": classString,
        "id": id
      }), [children]));
    };
  }
});