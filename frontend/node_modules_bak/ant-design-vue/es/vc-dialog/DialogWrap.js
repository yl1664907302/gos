import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode, resolveDirective as _resolveDirective } from "vue";
import Dialog from './Dialog';
import getDialogPropTypes from './IDialogPropTypes';
import Portal from '../_util/PortalWrapper';
import { defineComponent, ref, watch } from 'vue';
import { useProvidePortal } from '../vc-trigger/context';
import { initDefaultProps } from '../_util/props-util';
const IDialogPropTypes = getDialogPropTypes();
const DialogWrap = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'DialogWrap',
  inheritAttrs: false,
  props: initDefaultProps(IDialogPropTypes, {
    visible: false
  }),
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const animatedVisible = ref(props.visible);
    useProvidePortal({}, {
      inTriggerContext: false
    });
    watch(() => props.visible, () => {
      if (props.visible) {
        animatedVisible.value = true;
      }
    }, {
      flush: 'post'
    });
    return () => {
      const {
        visible,
        getContainer,
        forceRender,
        destroyOnClose = false,
        afterClose
      } = props;
      let dialogProps = _extends(_extends(_extends({}, props), attrs), {
        ref: '_component',
        key: 'dialog'
      });
      // 渲染在当前 dom 里；
      if (getContainer === false) {
        return _createVNode(Dialog, _objectSpread(_objectSpread({}, dialogProps), {}, {
          "getOpenCount": () => 2
        }), slots);
      }
      // Destroy on close will remove wrapped div
      if (!forceRender && destroyOnClose && !animatedVisible.value) {
        return null;
      }
      return _createVNode(Portal, {
        "autoLock": true,
        "visible": visible,
        "forceRender": forceRender,
        "getContainer": getContainer
      }, {
        default: childProps => {
          dialogProps = _extends(_extends(_extends({}, dialogProps), childProps), {
            afterClose: () => {
              afterClose === null || afterClose === void 0 ? void 0 : afterClose();
              animatedVisible.value = false;
            }
          });
          return _createVNode(Dialog, dialogProps, slots);
        }
      });
    };
  }
});
export default DialogWrap;