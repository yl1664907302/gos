import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
import { computed, ref, watch, defineComponent, provide } from 'vue';
import Checkbox from './Checkbox';
import { useInjectFormItemContext } from '../form/FormItemContext';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { CheckboxGroupContextKey, checkboxGroupProps } from './interface';
// CSSINJS
import useStyle from './style';
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ACheckboxGroup',
  inheritAttrs: false,
  props: checkboxGroupProps(),
  // emits: ['change', 'update:value'],
  setup(props, _ref) {
    let {
      slots,
      attrs,
      emit,
      expose
    } = _ref;
    const formItemContext = useInjectFormItemContext();
    const {
      prefixCls,
      direction
    } = useConfigInject('checkbox', props);
    const groupPrefixCls = computed(() => `${prefixCls.value}-group`);
    // style
    const [wrapSSR, hashId] = useStyle(groupPrefixCls);
    const mergedValue = ref((props.value === undefined ? props.defaultValue : props.value) || []);
    watch(() => props.value, () => {
      mergedValue.value = props.value || [];
    });
    const options = computed(() => {
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
    const triggerUpdate = ref(Symbol());
    const registeredValuesMap = ref(new Map());
    const cancelValue = id => {
      registeredValuesMap.value.delete(id);
      triggerUpdate.value = Symbol();
    };
    const registerValue = (id, value) => {
      registeredValuesMap.value.set(id, value);
      triggerUpdate.value = Symbol();
    };
    const registeredValues = ref(new Map());
    watch(triggerUpdate, () => {
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
    provide(CheckboxGroupContextKey, {
      cancelValue,
      registerValue,
      toggleOption,
      mergedValue,
      name: computed(() => props.name),
      disabled: computed(() => props.disabled)
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
          return _createVNode(Checkbox, {
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
      return wrapSSR(_createVNode("div", _objectSpread(_objectSpread({}, attrs), {}, {
        "class": [groupPrefixCls.value, {
          [`${groupPrefixCls.value}-rtl`]: direction.value === 'rtl'
        }, attrs.class, hashId.value],
        "id": id
      }), [children || ((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots))]));
    };
  }
});