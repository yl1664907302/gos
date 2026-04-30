import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
import { computed, defineComponent } from 'vue';
import { FormItemInputContext } from '../form/FormItemContext';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import classNames from '../_util/classNames';
// CSSINJS
import useStyle from './style';
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'AInputGroup',
  inheritAttrs: false,
  props: {
    prefixCls: String,
    size: {
      type: String
    },
    compact: {
      type: Boolean,
      default: undefined
    }
  },
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const {
      prefixCls,
      direction,
      getPrefixCls
    } = useConfigInject('input-group', props);
    const formItemInputContext = FormItemInputContext.useInject();
    FormItemInputContext.useProvide(formItemInputContext, {
      isFormItemInput: false
    });
    // style
    const inputPrefixCls = computed(() => getPrefixCls('input'));
    const [wrapSSR, hashId] = useStyle(inputPrefixCls);
    const cls = computed(() => {
      const pre = prefixCls.value;
      return {
        [`${pre}`]: true,
        [hashId.value]: true,
        [`${pre}-lg`]: props.size === 'large',
        [`${pre}-sm`]: props.size === 'small',
        [`${pre}-compact`]: props.compact,
        [`${pre}-rtl`]: direction.value === 'rtl'
      };
    });
    return () => {
      var _a;
      return wrapSSR(_createVNode("span", _objectSpread(_objectSpread({}, attrs), {}, {
        "class": classNames(cls.value, attrs.class)
      }), [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]));
    };
  }
});