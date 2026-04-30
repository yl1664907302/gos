import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import { computed, defineComponent } from 'vue';
import classNames from '../_util/classNames';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { initDefaultProps } from '../_util/props-util';
import Element, { skeletonElementProps } from './Element';
import useStyle from './style';
export const skeletonButtonProps = () => {
  return _extends(_extends({}, skeletonElementProps()), {
    size: String,
    block: Boolean
  });
};
const SkeletonButton = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ASkeletonButton',
  props: initDefaultProps(skeletonButtonProps(), {
    size: 'default'
  }),
  setup(props) {
    const {
      prefixCls
    } = useConfigInject('skeleton', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const cls = computed(() => classNames(prefixCls.value, `${prefixCls.value}-element`, {
      [`${prefixCls.value}-active`]: props.active,
      [`${prefixCls.value}-block`]: props.block
    }, hashId.value));
    return () => {
      return wrapSSR(_createVNode("div", {
        "class": cls.value
      }, [_createVNode(Element, _objectSpread(_objectSpread({}, props), {}, {
        "prefixCls": `${prefixCls.value}-button`
      }), null)]));
    };
  }
});
export default SkeletonButton;