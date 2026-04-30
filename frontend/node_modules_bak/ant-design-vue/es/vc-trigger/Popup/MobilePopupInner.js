import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import { defineComponent, ref, Transition } from 'vue';
import { flattenChildren } from '../../_util/props-util';
import classNames from '../../_util/classNames';
import { mobileProps } from './interface';
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'MobilePopupInner',
  inheritAttrs: false,
  props: mobileProps,
  emits: ['mouseenter', 'mouseleave', 'mousedown', 'touchstart', 'align'],
  setup(props, _ref) {
    let {
      expose,
      slots
    } = _ref;
    const elementRef = ref();
    expose({
      forceAlign: () => {},
      getElement: () => elementRef.value
    });
    return () => {
      var _a;
      const {
        zIndex,
        visible,
        prefixCls,
        mobile: {
          popupClassName,
          popupStyle,
          popupMotion = {},
          popupRender
        } = {}
      } = props;
      // ======================== Render ========================
      const mergedStyle = _extends({
        zIndex
      }, popupStyle);
      let childNode = flattenChildren((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots));
      // Wrapper when multiple children
      if (childNode.length > 1) {
        const _childNode = function () {
          return childNode;
        }();
        childNode = _createVNode("div", {
          "class": `${prefixCls}-content`
        }, [childNode]);
      }
      // Mobile support additional render
      if (popupRender) {
        childNode = popupRender(childNode);
      }
      const mergedClassName = classNames(prefixCls, popupClassName);
      return _createVNode(Transition, _objectSpread({
        "ref": elementRef
      }, popupMotion), {
        default: () => [visible ? _createVNode("div", {
          "class": mergedClassName,
          "style": mergedStyle
        }, [childNode]) : null]
      });
    };
  }
});