import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
import { cloneElement } from '../_util/vnode';
import Avatar from './Avatar';
import Popover from '../popover';
import { computed, defineComponent, watchEffect } from 'vue';
import { flattenChildren, getPropsSlot } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useStyle from './style';
import { useAvatarProviderContext } from './AvatarContext';
export const groupProps = () => ({
  prefixCls: String,
  maxCount: Number,
  maxStyle: {
    type: Object,
    default: undefined
  },
  maxPopoverPlacement: {
    type: String,
    default: 'top'
  },
  maxPopoverTrigger: String,
  /*
   * Size of avatar, options: `large`, `small`, `default`
   * or a custom number size
   * */
  size: {
    type: [Number, String, Object],
    default: 'default'
  },
  shape: {
    type: String,
    default: 'circle'
  }
});
const Group = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'AAvatarGroup',
  inheritAttrs: false,
  props: groupProps(),
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const {
      prefixCls,
      direction
    } = useConfigInject('avatar', props);
    const groupPrefixCls = computed(() => `${prefixCls.value}-group`);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    watchEffect(() => {
      const context = {
        size: props.size,
        shape: props.shape
      };
      useAvatarProviderContext(context);
    });
    return () => {
      const {
        maxPopoverPlacement = 'top',
        maxCount,
        maxStyle,
        maxPopoverTrigger = 'hover',
        shape
      } = props;
      const cls = {
        [groupPrefixCls.value]: true,
        [`${groupPrefixCls.value}-rtl`]: direction.value === 'rtl',
        [`${attrs.class}`]: !!attrs.class,
        [hashId.value]: true
      };
      const children = getPropsSlot(slots, props);
      const childrenWithProps = flattenChildren(children).map((child, index) => cloneElement(child, {
        key: `avatar-key-${index}`
      }));
      const numOfChildren = childrenWithProps.length;
      if (maxCount && maxCount < numOfChildren) {
        const childrenShow = childrenWithProps.slice(0, maxCount);
        const childrenHidden = childrenWithProps.slice(maxCount, numOfChildren);
        childrenShow.push(_createVNode(Popover, {
          "key": "avatar-popover-key",
          "content": childrenHidden,
          "trigger": maxPopoverTrigger,
          "placement": maxPopoverPlacement,
          "overlayClassName": `${groupPrefixCls.value}-popover`
        }, {
          default: () => [_createVNode(Avatar, {
            "style": maxStyle,
            "shape": shape
          }, {
            default: () => [`+${numOfChildren - maxCount}`]
          })]
        }));
        return wrapSSR(_createVNode("div", _objectSpread(_objectSpread({}, attrs), {}, {
          "class": cls,
          "style": attrs.style
        }), [childrenShow]));
      }
      return wrapSSR(_createVNode("div", _objectSpread(_objectSpread({}, attrs), {}, {
        "class": cls,
        "style": attrs.style
      }), [childrenWithProps]));
    };
  }
});
export default Group;