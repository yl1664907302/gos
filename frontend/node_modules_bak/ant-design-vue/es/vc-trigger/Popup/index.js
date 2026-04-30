import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode, resolveDirective as _resolveDirective } from "vue";
import { defineComponent, shallowRef, watch } from 'vue';
import { popupProps } from './interface';
import Mask from './Mask';
import MobilePopupInner from './MobilePopupInner';
import PopupInner from './PopupInner';
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'Popup',
  inheritAttrs: false,
  props: popupProps,
  setup(props, _ref) {
    let {
      attrs,
      slots,
      expose
    } = _ref;
    const innerVisible = shallowRef(false);
    const inMobile = shallowRef(false);
    const popupRef = shallowRef();
    const rootRef = shallowRef();
    watch([() => props.visible, () => props.mobile], () => {
      innerVisible.value = props.visible;
      if (props.visible && props.mobile) {
        inMobile.value = true;
      }
    }, {
      immediate: true,
      flush: 'post'
    });
    expose({
      forceAlign: () => {
        var _a;
        (_a = popupRef.value) === null || _a === void 0 ? void 0 : _a.forceAlign();
      },
      getElement: () => {
        var _a;
        return (_a = popupRef.value) === null || _a === void 0 ? void 0 : _a.getElement();
      }
    });
    return () => {
      const cloneProps = _extends(_extends(_extends({}, props), attrs), {
        visible: innerVisible.value
      });
      const popupNode = inMobile.value ? _createVNode(MobilePopupInner, _objectSpread(_objectSpread({}, cloneProps), {}, {
        "mobile": props.mobile,
        "ref": popupRef
      }), {
        default: slots.default
      }) : _createVNode(PopupInner, _objectSpread(_objectSpread({}, cloneProps), {}, {
        "ref": popupRef
      }), {
        default: slots.default
      });
      return _createVNode("div", {
        "ref": rootRef
      }, [_createVNode(Mask, cloneProps, null), popupNode]);
    };
  }
});