import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
import { defineComponent, onBeforeUnmount, shallowRef, watch, watchEffect } from 'vue';
import contains from '../vc-util/Dom/contains';
import classNames from '../_util/classNames';
import KeyCode from '../_util/KeyCode';
import omit from '../_util/omit';
import pickAttrs from '../_util/pickAttrs';
import { initDefaultProps } from '../_util/props-util';
import Content from './Content';
import dialogPropTypes from './IDialogPropTypes';
import Mask from './Mask';
import { getMotionName, getUUID } from './util';
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'VcDialog',
  inheritAttrs: false,
  props: initDefaultProps(_extends(_extends({}, dialogPropTypes()), {
    getOpenCount: Function,
    scrollLocker: Object
  }), {
    mask: true,
    visible: false,
    keyboard: true,
    closable: true,
    maskClosable: true,
    destroyOnClose: false,
    prefixCls: 'rc-dialog',
    getOpenCount: () => null,
    focusTriggerAfterClose: true
  }),
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const lastOutSideActiveElementRef = shallowRef();
    const wrapperRef = shallowRef();
    const contentRef = shallowRef();
    const animatedVisible = shallowRef(props.visible);
    const ariaIdRef = shallowRef(`vcDialogTitle${getUUID()}`);
    // ========================= Events =========================
    const onDialogVisibleChanged = newVisible => {
      var _a, _b;
      if (newVisible) {
        // Try to focus
        if (!contains(wrapperRef.value, document.activeElement)) {
          lastOutSideActiveElementRef.value = document.activeElement;
          (_a = contentRef.value) === null || _a === void 0 ? void 0 : _a.focus();
        }
      } else {
        const preAnimatedVisible = animatedVisible.value;
        // Clean up scroll bar & focus back
        animatedVisible.value = false;
        if (props.mask && lastOutSideActiveElementRef.value && props.focusTriggerAfterClose) {
          try {
            lastOutSideActiveElementRef.value.focus({
              preventScroll: true
            });
          } catch (e) {
            // Do nothing
          }
          lastOutSideActiveElementRef.value = null;
        }
        // Trigger afterClose only when change visible from true to false
        if (preAnimatedVisible) {
          (_b = props.afterClose) === null || _b === void 0 ? void 0 : _b.call(props);
        }
      }
    };
    const onInternalClose = e => {
      var _a;
      (_a = props.onClose) === null || _a === void 0 ? void 0 : _a.call(props, e);
    };
    // >>> Content
    const contentClickRef = shallowRef(false);
    const contentTimeoutRef = shallowRef();
    // We need record content click incase content popup out of dialog
    const onContentMouseDown = () => {
      clearTimeout(contentTimeoutRef.value);
      contentClickRef.value = true;
    };
    const onContentMouseUp = () => {
      contentTimeoutRef.value = setTimeout(() => {
        contentClickRef.value = false;
      });
    };
    const onWrapperClick = e => {
      if (!props.maskClosable) return null;
      if (contentClickRef.value) {
        contentClickRef.value = false;
      } else if (wrapperRef.value === e.target) {
        onInternalClose(e);
      }
    };
    const onWrapperKeyDown = e => {
      if (props.keyboard && e.keyCode === KeyCode.ESC) {
        e.stopPropagation();
        onInternalClose(e);
        return;
      }
      // keep focus inside dialog
      if (props.visible) {
        if (e.keyCode === KeyCode.TAB) {
          contentRef.value.changeActive(!e.shiftKey);
        }
      }
    };
    watch(() => props.visible, () => {
      if (props.visible) {
        animatedVisible.value = true;
      }
    }, {
      flush: 'post'
    });
    onBeforeUnmount(() => {
      var _a;
      clearTimeout(contentTimeoutRef.value);
      (_a = props.scrollLocker) === null || _a === void 0 ? void 0 : _a.unLock();
    });
    watchEffect(() => {
      var _a, _b;
      (_a = props.scrollLocker) === null || _a === void 0 ? void 0 : _a.unLock();
      if (animatedVisible.value) {
        (_b = props.scrollLocker) === null || _b === void 0 ? void 0 : _b.lock();
      }
    });
    return () => {
      const {
        prefixCls,
        mask,
        visible,
        maskTransitionName,
        maskAnimation,
        zIndex,
        wrapClassName,
        rootClassName,
        wrapStyle,
        closable,
        maskProps,
        maskStyle,
        transitionName,
        animation,
        wrapProps,
        title = slots.title
      } = props;
      const {
        style,
        class: className
      } = attrs;
      return _createVNode("div", _objectSpread({
        "class": [`${prefixCls}-root`, rootClassName]
      }, pickAttrs(props, {
        data: true
      })), [_createVNode(Mask, {
        "prefixCls": prefixCls,
        "visible": mask && visible,
        "motionName": getMotionName(prefixCls, maskTransitionName, maskAnimation),
        "style": _extends({
          zIndex
        }, maskStyle),
        "maskProps": maskProps
      }, null), _createVNode("div", _objectSpread({
        "tabIndex": -1,
        "onKeydown": onWrapperKeyDown,
        "class": classNames(`${prefixCls}-wrap`, wrapClassName),
        "ref": wrapperRef,
        "onClick": onWrapperClick,
        "role": "dialog",
        "aria-labelledby": title ? ariaIdRef.value : null,
        "style": _extends(_extends({
          zIndex
        }, wrapStyle), {
          display: !animatedVisible.value ? 'none' : null
        })
      }, wrapProps), [_createVNode(Content, _objectSpread(_objectSpread({}, omit(props, ['scrollLocker'])), {}, {
        "style": style,
        "class": className,
        "onMousedown": onContentMouseDown,
        "onMouseup": onContentMouseUp,
        "ref": contentRef,
        "closable": closable,
        "ariaId": ariaIdRef.value,
        "prefixCls": prefixCls,
        "visible": visible,
        "onClose": onInternalClose,
        "onVisibleChanged": onDialogVisibleChanged,
        "motionName": getMotionName(prefixCls, transitionName, animation)
      }), slots)])]);
    };
  }
});