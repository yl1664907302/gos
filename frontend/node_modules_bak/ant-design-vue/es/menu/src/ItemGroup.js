import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
import { getPropsSlot } from '../../_util/props-util';
import { computed, defineComponent } from 'vue';
import PropTypes from '../../_util/vue-types';
import { useInjectMenu } from './hooks/useMenuContext';
import { useMeasure } from './hooks/useKeyPath';
import { objectType } from '../../_util/type';
export const menuItemGroupProps = () => ({
  title: PropTypes.any,
  // Internal user prop
  originItemValue: objectType()
});
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'AMenuItemGroup',
  inheritAttrs: false,
  props: menuItemGroupProps(),
  slots: Object,
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const {
      prefixCls
    } = useInjectMenu();
    const groupPrefixCls = computed(() => `${prefixCls.value}-item-group`);
    const isMeasure = useMeasure();
    return () => {
      var _a, _b;
      if (isMeasure) return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
      return _createVNode("li", _objectSpread(_objectSpread({}, attrs), {}, {
        "onClick": e => e.stopPropagation(),
        "class": groupPrefixCls.value
      }), [_createVNode("div", {
        "title": typeof props.title === 'string' ? props.title : undefined,
        "class": `${groupPrefixCls.value}-title`
      }, [getPropsSlot(slots, props, 'title')]), _createVNode("ul", {
        "class": `${groupPrefixCls.value}-list`
      }, [(_b = slots.default) === null || _b === void 0 ? void 0 : _b.call(slots)])]);
    };
  }
});