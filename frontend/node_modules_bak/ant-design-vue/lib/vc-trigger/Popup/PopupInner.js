"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _useVisibleStatus = _interopRequireDefault(require("./useVisibleStatus"));
var _useStretchStyle = _interopRequireDefault(require("./useStretchStyle"));
var _Align = _interopRequireDefault(require("../../vc-align/Align"));
var _motionUtil = require("../utils/motionUtil");
var _propsUtil = require("../../_util/props-util");
var _classNames = _interopRequireDefault(require("../../_util/classNames"));
var _interface = require("./interface");
var _transition = require("../../_util/transition");
var _supportsPassive = _interopRequireDefault(require("../../_util/supportsPassive"));
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'PopupInner',
  inheritAttrs: false,
  props: _interface.innerProps,
  emits: ['mouseenter', 'mouseleave', 'mousedown', 'touchstart', 'align'],
  setup(props, _ref) {
    let {
      expose,
      attrs,
      slots
    } = _ref;
    const alignRef = (0, _vue.shallowRef)();
    const elementRef = (0, _vue.shallowRef)();
    const alignedClassName = (0, _vue.shallowRef)();
    // ======================= Measure ========================
    const [stretchStyle, measureStretchStyle] = (0, _useStretchStyle.default)((0, _vue.toRef)(props, 'stretch'));
    const doMeasure = () => {
      if (props.stretch) {
        measureStretchStyle(props.getRootDomNode());
      }
    };
    const visible = (0, _vue.shallowRef)(false);
    let timeoutId;
    (0, _vue.watch)(() => props.visible, val => {
      clearTimeout(timeoutId);
      if (val) {
        timeoutId = setTimeout(() => {
          visible.value = props.visible;
        });
      } else {
        visible.value = false;
      }
    }, {
      immediate: true
    });
    // ======================== Status ========================
    const [status, goNextStatus] = (0, _useVisibleStatus.default)(visible, doMeasure);
    // ======================== Aligns ========================
    const prepareResolveRef = (0, _vue.shallowRef)();
    // `target` on `rc-align` can accept as a function to get the bind element or a point.
    // ref: https://www.npmjs.com/package/rc-align
    const getAlignTarget = () => {
      if (props.point) {
        return props.point;
      }
      return props.getRootDomNode;
    };
    const forceAlign = () => {
      var _a;
      (_a = alignRef.value) === null || _a === void 0 ? void 0 : _a.forceAlign();
    };
    const onInternalAlign = (popupDomNode, matchAlign) => {
      var _a;
      const nextAlignedClassName = props.getClassNameFromAlign(matchAlign);
      const preAlignedClassName = alignedClassName.value;
      if (alignedClassName.value !== nextAlignedClassName) {
        alignedClassName.value = nextAlignedClassName;
      }
      if (status.value === 'align') {
        // Repeat until not more align needed
        if (preAlignedClassName !== nextAlignedClassName) {
          Promise.resolve().then(() => {
            forceAlign();
          });
        } else {
          goNextStatus(() => {
            var _a;
            (_a = prepareResolveRef.value) === null || _a === void 0 ? void 0 : _a.call(prepareResolveRef);
          });
        }
        (_a = props.onAlign) === null || _a === void 0 ? void 0 : _a.call(props, popupDomNode, matchAlign);
      }
    };
    // ======================== Motion ========================
    const motion = (0, _vue.computed)(() => {
      const m = typeof props.animation === 'object' ? props.animation : (0, _motionUtil.getMotion)(props);
      ['onAfterEnter', 'onAfterLeave'].forEach(eventName => {
        const originFn = m[eventName];
        m[eventName] = node => {
          goNextStatus();
          // 结束后，强制 stable
          status.value = 'stable';
          originFn === null || originFn === void 0 ? void 0 : originFn(node);
        };
      });
      return m;
    });
    const onShowPrepare = () => {
      return new Promise(resolve => {
        prepareResolveRef.value = resolve;
      });
    };
    (0, _vue.watch)([motion, status], () => {
      if (!motion.value && status.value === 'motion') {
        goNextStatus();
      }
    }, {
      immediate: true
    });
    expose({
      forceAlign,
      getElement: () => {
        return elementRef.value.$el || elementRef.value;
      }
    });
    const alignDisabled = (0, _vue.computed)(() => {
      var _a;
      if (((_a = props.align) === null || _a === void 0 ? void 0 : _a.points) && (status.value === 'align' || status.value === 'stable')) {
        return false;
      }
      return true;
    });
    return () => {
      var _a;
      const {
        zIndex,
        align,
        prefixCls,
        destroyPopupOnHide,
        onMouseenter,
        onMouseleave,
        onTouchstart = () => {},
        onMousedown
      } = props;
      const statusValue = status.value;
      // ======================== Render ========================
      const mergedStyle = [(0, _extends2.default)((0, _extends2.default)({}, stretchStyle.value), {
        zIndex,
        opacity: statusValue === 'motion' || statusValue === 'stable' || !visible.value ? null : 0,
        // pointerEvents: statusValue === 'stable' ? null : 'none',
        pointerEvents: !visible.value && statusValue !== 'stable' ? 'none' : null
      }), attrs.style];
      let childNode = (0, _propsUtil.flattenChildren)((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots, {
        visible: props.visible
      }));
      // Wrapper when multiple children
      if (childNode.length > 1) {
        const _childNode = function () {
          return childNode;
        }();
        childNode = (0, _vue.createVNode)("div", {
          "class": `${prefixCls}-content`
        }, [childNode]);
      }
      const mergedClassName = (0, _classNames.default)(prefixCls, attrs.class, alignedClassName.value, !props.arrow && `${prefixCls}-arrow-hidden`);
      const hasAnimate = visible.value || !props.visible;
      const transitionProps = hasAnimate ? (0, _transition.getTransitionProps)(motion.value.name, motion.value) : {};
      return (0, _vue.createVNode)(_vue.Transition, (0, _objectSpread2.default)((0, _objectSpread2.default)({
        "ref": elementRef
      }, transitionProps), {}, {
        "onBeforeEnter": onShowPrepare
      }), {
        default: () => {
          return !destroyPopupOnHide || props.visible ? (0, _vue.withDirectives)((0, _vue.createVNode)(_Align.default, {
            "target": getAlignTarget(),
            "key": "popup",
            "ref": alignRef,
            "monitorWindowResize": true,
            "disabled": alignDisabled.value,
            "align": align,
            "onAlign": onInternalAlign
          }, {
            default: () => (0, _vue.createVNode)("div", {
              "class": mergedClassName,
              "onMouseenter": onMouseenter,
              "onMouseleave": onMouseleave,
              "onMousedown": (0, _vue.withModifiers)(onMousedown, ['capture']),
              [_supportsPassive.default ? 'onTouchstartPassive' : 'onTouchstart']: (0, _vue.withModifiers)(onTouchstart, ['capture']),
              "style": mergedStyle
            }, [childNode])
          }), [[_vue.vShow, visible.value]]) : null;
        }
      });
    };
  }
});