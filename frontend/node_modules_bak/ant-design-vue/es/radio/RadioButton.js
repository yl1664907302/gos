import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
import { defineComponent } from 'vue';
import Radio, { radioProps } from './Radio';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useProvideRadioOptionTypeContext } from './context';
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ARadioButton',
  inheritAttrs: false,
  props: radioProps(),
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const {
      prefixCls
    } = useConfigInject('radio', props);
    useProvideRadioOptionTypeContext('button');
    return () => {
      var _a;
      return _createVNode(Radio, _objectSpread(_objectSpread(_objectSpread({}, attrs), props), {}, {
        "prefixCls": prefixCls.value
      }), {
        default: () => [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]
      });
    };
  }
});