import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { withDirectives as _withDirectives, vShow as _vShow, createVNode as _createVNode } from "vue";
import { useInjectFormItemPrefix } from './context';
import { computed, defineComponent, ref, Transition, watch, TransitionGroup } from 'vue';
import { getTransitionGroupProps, getTransitionProps } from '../_util/transition';
import collapseMotion from '../_util/collapseMotion';
import useStyle from './style';
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ErrorList',
  inheritAttrs: false,
  props: ['errors', 'help', 'onErrorVisibleChanged', 'helpStatus', 'warnings'],
  setup(props, _ref) {
    let {
      attrs
    } = _ref;
    const {
      prefixCls,
      status
    } = useInjectFormItemPrefix();
    const baseClassName = computed(() => `${prefixCls.value}-item-explain`);
    const visible = computed(() => !!(props.errors && props.errors.length));
    const innerStatus = ref(status.value);
    const [, hashId] = useStyle(prefixCls);
    // Memo status in same visible
    watch([visible, status], () => {
      if (visible.value) {
        innerStatus.value = status.value;
      }
    });
    return () => {
      var _a, _b;
      const colMItem = collapseMotion(`${prefixCls.value}-show-help-item`);
      const transitionGroupProps = getTransitionGroupProps(`${prefixCls.value}-show-help-item`, colMItem);
      transitionGroupProps.role = 'alert';
      transitionGroupProps.class = [hashId.value, baseClassName.value, attrs.class, `${prefixCls.value}-show-help`];
      return _createVNode(Transition, _objectSpread(_objectSpread({}, getTransitionProps(`${prefixCls.value}-show-help`)), {}, {
        "onAfterEnter": () => props.onErrorVisibleChanged(true),
        "onAfterLeave": () => props.onErrorVisibleChanged(false)
      }), {
        default: () => [_withDirectives(_createVNode(TransitionGroup, _objectSpread(_objectSpread({}, transitionGroupProps), {}, {
          "tag": "div"
        }), {
          default: () => [(_b = props.errors) === null || _b === void 0 ? void 0 : _b.map((error, index) => _createVNode("div", {
            "key": index,
            "class": innerStatus.value ? `${baseClassName.value}-${innerStatus.value}` : ''
          }, [error]))]
        }), [[_vShow, !!((_a = props.errors) === null || _a === void 0 ? void 0 : _a.length)]])]
      });
    };
  }
});