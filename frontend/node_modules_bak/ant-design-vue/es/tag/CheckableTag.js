import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
import { defineComponent, computed } from 'vue';
import classNames from '../_util/classNames';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useStyle from './style';
const checkableTagProps = () => ({
  prefixCls: String,
  checked: {
    type: Boolean,
    default: undefined
  },
  onChange: {
    type: Function
  },
  onClick: {
    type: Function
  },
  'onUpdate:checked': Function
});
const CheckableTag = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ACheckableTag',
  inheritAttrs: false,
  props: checkableTagProps(),
  // emits: ['update:checked', 'change', 'click'],
  setup(props, _ref) {
    let {
      slots,
      emit,
      attrs
    } = _ref;
    const {
      prefixCls
    } = useConfigInject('tag', props);
    // Style
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const handleClick = e => {
      const {
        checked
      } = props;
      emit('update:checked', !checked);
      emit('change', !checked);
      emit('click', e);
    };
    const cls = computed(() => classNames(prefixCls.value, hashId.value, {
      [`${prefixCls.value}-checkable`]: true,
      [`${prefixCls.value}-checkable-checked`]: props.checked
    }));
    return () => {
      var _a;
      return wrapSSR(_createVNode("span", _objectSpread(_objectSpread({}, attrs), {}, {
        "class": [cls.value, attrs.class],
        "onClick": handleClick
      }), [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]));
    };
  }
});
export default CheckableTag;