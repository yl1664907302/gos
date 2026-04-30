"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _contains = _interopRequireDefault(require("../vc-util/Dom/contains"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _KeyCode = _interopRequireDefault(require("../_util/KeyCode"));
var _omit = _interopRequireDefault(require("../_util/omit"));
var _pickAttrs = _interopRequireDefault(require("../_util/pickAttrs"));
var _propsUtil = require("../_util/props-util");
var _Content = _interopRequireDefault(require("./Content"));
var _IDialogPropTypes = _interopRequireDefault(require("./IDialogPropTypes"));
var _Mask = _interopRequireDefault(require("./Mask"));
var _util = require("./util");
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'VcDialog',
  inheritAttrs: false,
  props: (0, _propsUtil.initDefaultProps)((0, _extends2.default)((0, _extends2.default)({}, (0, _IDialogPropTypes.default)()), {
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
    const lastOutSideActiveElementRef = (0, _vue.shallowRef)();
    const wrapperRef = (0, _vue.shallowRef)();
    const contentRef = (0, _vue.shallowRef)();
    const animatedVisible = (0, _vue.shallowRef)(props.visible);
    const ariaIdRef = (0, _vue.shallowRef)(`vcDialogTitle${(0, _util.getUUID)()}`);
    // ========================= Events =========================
    const onDialogVisibleChanged = newVisible => {
      var _a, _b;
      if (newVisible) {
        // Try to focus
        if (!(0, _contains.default)(wrapperRef.value, document.activeElement)) {
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
    const contentClickRef = (0, _vue.shallowRef)(false);
    const contentTimeoutRef = (0, _vue.shallowRef)();
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
      if (props.keyboard && e.keyCode === _KeyCode.default.ESC) {
        e.stopPropagation();
        onInternalClose(e);
        return;
      }
      // keep focus inside dialog
      if (props.visible) {
        if (e.keyCode === _KeyCode.default.TAB) {
          contentRef.value.changeActive(!e.shiftKey);
        }
      }
    };
    (0, _vue.watch)(() => props.visible, () => {
      if (props.visible) {
        animatedVisible.value = true;
      }
    }, {
      flush: 'post'
    });
    (0, _vue.onBeforeUnmount)(() => {
      var _a;
      clearTimeout(contentTimeoutRef.value);
      (_a = props.scrollLocker) === null || _a === void 0 ? void 0 : _a.unLock();
    });
    (0, _vue.watchEffect)(() => {
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
      return (0, _vue.createVNode)("div", (0, _objectSpread2.default)({
        "class": [`${prefixCls}-root`, rootClassName]
      }, (0, _pickAttrs.default)(props, {
        data: true
      })), [(0, _vue.createVNode)(_Mask.default, {
        "prefixCls": prefixCls,
        "visible": mask && visible,
        "motionName": (0, _util.getMotionName)(prefixCls, maskTransitionName, maskAnimation),
        "style": (0, _extends2.default)({
          zIndex
        }, maskStyle),
        "maskProps": maskProps
      }, null), (0, _vue.createVNode)("div", (0, _objectSpread2.default)({
        "tabIndex": -1,
        "onKeydown": onWrapperKeyDown,
        "class": (0, _classNames.default)(`${prefixCls}-wrap`, wrapClassName),
        "ref": wrapperRef,
        "onClick": onWrapperClick,
        "role": "dialog",
        "aria-labelledby": title ? ariaIdRef.value : null,
        "style": (0, _extends2.default)((0, _extends2.default)({
          zIndex
        }, wrapStyle), {
          display: !animatedVisible.value ? 'none' : null
        })
      }, wrapProps), [(0, _vue.createVNode)(_Content.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, (0, _omit.default)(props, ['scrollLocker'])), {}, {
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
        "motionName": (0, _util.getMotionName)(prefixCls, transitionName, animation)
      }), slots)])]);
    };
  }
});