import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import { computed, defineComponent } from 'vue';
import classNames from '../_util/classNames';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import Element, { skeletonElementProps } from './Element';
import omit from '../_util/omit';
import useStyle from './style';
const SkeletonInput = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ASkeletonInput',
  props: _extends(_extends({}, omit(skeletonElementProps(), ['shape'])), {
    size: String,
    block: Boolean
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
        "prefixCls": `${prefixCls.value}-input`
      }), null)]));
    };
  }
});
export default SkeletonInput;