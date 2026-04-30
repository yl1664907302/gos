import { createVNode as _createVNode } from "vue";
import { defineComponent, shallowRef, watchEffect } from 'vue';
import { collapsePanelProps } from './commonProps';
import classNames from '../_util/classNames';
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'PanelContent',
  props: collapsePanelProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const rendered = shallowRef(false);
    watchEffect(() => {
      if (props.isActive || props.forceRender) {
        rendered.value = true;
      }
    });
    return () => {
      var _a;
      if (!rendered.value) return null;
      const {
        prefixCls,
        isActive,
        role
      } = props;
      return _createVNode("div", {
        "class": classNames(`${prefixCls}-content`, {
          [`${prefixCls}-content-active`]: isActive,
          [`${prefixCls}-content-inactive`]: !isActive
        }),
        "role": role
      }, [_createVNode("div", {
        "class": `${prefixCls}-content-box`
      }, [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)])]);
    };
  }
});