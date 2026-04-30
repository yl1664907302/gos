import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
import { defineComponent, nextTick, onBeforeUnmount, onMounted, watch } from 'vue';
import { initDefaultProps } from '../_util/props-util';
import classNames from '../_util/classNames';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useInjectAnchor } from './context';
import { objectType, anyType } from '../_util/type';
export const anchorLinkProps = () => ({
  prefixCls: String,
  href: String,
  title: anyType(),
  target: String,
  /* private use  */
  customTitleProps: objectType()
});
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'AAnchorLink',
  inheritAttrs: false,
  props: initDefaultProps(anchorLinkProps(), {
    href: '#'
  }),
  slots: Object,
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    let mergedTitle = null;
    const {
      handleClick: contextHandleClick,
      scrollTo,
      unregisterLink,
      registerLink,
      activeLink
    } = useInjectAnchor();
    const {
      prefixCls
    } = useConfigInject('anchor', props);
    const handleClick = e => {
      const {
        href
      } = props;
      contextHandleClick(e, {
        title: mergedTitle,
        href
      });
      scrollTo(href);
    };
    watch(() => props.href, (val, oldVal) => {
      nextTick(() => {
        unregisterLink(oldVal);
        registerLink(val);
      });
    });
    onMounted(() => {
      registerLink(props.href);
    });
    onBeforeUnmount(() => {
      unregisterLink(props.href);
    });
    return () => {
      var _a;
      const {
        href,
        target,
        title = slots.title,
        customTitleProps = {}
      } = props;
      const pre = prefixCls.value;
      mergedTitle = typeof title === 'function' ? title(customTitleProps) : title;
      const active = activeLink.value === href;
      const wrapperClassName = classNames(`${pre}-link`, {
        [`${pre}-link-active`]: active
      }, attrs.class);
      const titleClassName = classNames(`${pre}-link-title`, {
        [`${pre}-link-title-active`]: active
      });
      return _createVNode("div", _objectSpread(_objectSpread({}, attrs), {}, {
        "class": wrapperClassName
      }), [_createVNode("a", {
        "class": titleClassName,
        "href": href,
        "title": typeof mergedTitle === 'string' ? mergedTitle : '',
        "target": target,
        "onClick": handleClick
      }, [slots.customTitle ? slots.customTitle(customTitleProps) : mergedTitle]), (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]);
    };
  }
});