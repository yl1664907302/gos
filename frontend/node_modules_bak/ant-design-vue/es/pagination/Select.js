import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode, resolveDirective as _resolveDirective } from "vue";
import { defineComponent } from 'vue';
import VcSelect, { selectProps } from '../select';
export default defineComponent({
  name: 'MiniSelect',
  compatConfig: {
    MODE: 3
  },
  inheritAttrs: false,
  props: selectProps(),
  Option: VcSelect.Option,
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    return () => {
      const selelctProps = _extends(_extends(_extends({}, props), {
        size: 'small'
      }), attrs);
      return _createVNode(VcSelect, selelctProps, slots);
    };
  }
});
export const MiddleSelect = defineComponent({
  name: 'MiddleSelect',
  inheritAttrs: false,
  props: selectProps(),
  Option: VcSelect.Option,
  setup(props, _ref2) {
    let {
      attrs,
      slots
    } = _ref2;
    return () => {
      const selelctProps = _extends(_extends(_extends({}, props), {
        size: 'middle'
      }), attrs);
      return _createVNode(VcSelect, selelctProps, slots);
    };
  }
});