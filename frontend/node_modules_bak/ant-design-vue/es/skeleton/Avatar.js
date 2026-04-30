import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import { computed, defineComponent } from 'vue';
import classNames from '../_util/classNames';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import Element, { skeletonElementProps } from './Element';
import useStyle from './style';
export const avatarProps = () => {
  return _extends(_extends({}, skeletonElementProps()), {
    shape: String
  });
};
const SkeletonAvatar = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ASkeletonAvatar',
  props: initDefaultProps(avatarProps(), {
    size: 'default',
    shape: 'circle'
  }),
  setup(props) {
    const {
      prefixCls
    } = useConfigInject('skeleton', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const cls = computed(() => classNames(prefixCls.value, `${prefixCls.value}-element`, {
      [`${prefixCls.value}-active`]: props.active
    }, hashId.value));
    return () => {
      return wrapSSR(_createVNode("div", {
        "class": cls.value
      }, [_createVNode(Element, _objectSpread(_objectSpread({}, props), {}, {
        "prefixCls": `${prefixCls.value}-avatar`
      }), null)]));
    };
  }
});
export default SkeletonAvatar;