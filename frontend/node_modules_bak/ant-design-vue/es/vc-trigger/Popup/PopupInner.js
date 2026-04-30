import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { withDirectives as _withDirectives, resolveDirective as _resolveDirective, vShow as _vShow, createVNode as _createVNode } from "vue";
import useVisibleStatus from './useVisibleStatus';
import useStretchStyle from './useStretchStyle';
import { computed, defineComponent, shallowRef, toRef, Transition, watch, withModifiers } from 'vue';
import Align from '../../vc-align/Align';
import { getMotion } from '../utils/motionUtil';
import { flattenChildren } from '../../_util/props-util';
import classNames from '../../_util/classNames';
import { innerProps } from './interface';
import { getTransitionProps } from '../../_util/transition';
import supportsPassive from '../../_util/supportsPassive';
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'PopupInner',
  inheritAttrs: false,
  props: innerProps,
  emits: ['mouseenter', 'mouseleave', 'mousedown', 'touchstart', 'align'],
  setup(props, _ref) {
    let {
      expose,
      attrs,
      slots
    } = _ref;
    const alignRef = shallowRef();
    const elementRef = shallowRef();
    const alignedClassName = shallowRef();
    // ======================= Measure ========================
    const [stretchStyle, measureStretchStyle] = useStretchStyle(toRef(props, 'stretch'));
    const doMeasure = () => {
      if (props.stretch) {
        measureStretchStyle(props.getRootDomNode());
      }
    };
    const visible = shallowRef(false);
    let timeoutId;
    watch(() => props.visible, val => {
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
    const [status, goNextStatus] = useVisibleStatus(visible, doMeasure);
    // ======================== Aligns ========================
    const prepareResolveRef = shallowRef();
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
    const motion = computed(() => {
      const m = typeof props.animation === 'object' ? props.animation : getMotion(props);
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
    watch([motion, status], () => {
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
    const alignDisabled = computed(() => {
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
      const mergedStyle = [_extends(_extends({}, stretchStyle.value), {
        zIndex,
        opacity: statusValue === 'motion' || statusValue === 'stable' || !visible.value ? null : 0,
        // pointerEvents: statusValue === 'stable' ? null : 'none',
        pointerEvents: !visible.value && statusValue !== 'stable' ? 'none' : null
      }), attrs.style];
      let childNode = flattenChildren((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots, {
        visible: props.visible
      }));
      // Wrapper when multiple children
      if (childNode.length > 1) {
        const _childNode = function () {
          return childNode;
        }();
        childNode = _createVNode("div", {
          "class": `${prefixCls}-content`
        }, [childNode]);
      }
      const mergedClassName = classNames(prefixCls, attrs.class, alignedClassName.value, !props.arrow && `${prefixCls}-arrow-hidden`);
      const hasAnimate = visible.value || !props.visible;
      const transitionProps = hasAnimate ? getTransitionProps(motion.value.name, motion.value) : {};
      return _createVNode(Transition, _objectSpread(_objectSpread({
        "ref": elementRef
      }, transitionProps), {}, {
        "onBeforeEnter": onShowPrepare
      }), {
        default: () => {
          return !destroyPopupOnHide || props.visible ? _withDirectives(_createVNode(Align, {
            "target": getAlignTarget(),
            "key": "popup",
            "ref": alignRef,
            "monitorWindowResize": true,
            "disabled": alignDisabled.value,
            "align": align,
            "onAlign": onInternalAlign
          }, {
            default: () => _createVNode("div", {
              "class": mergedClassName,
              "onMouseenter": onMouseenter,
              "onMouseleave": onMouseleave,
              "onMousedown": withModifiers(onMousedown, ['capture']),
              [supportsPassive ? 'onTouchstartPassive' : 'onTouchstart']: withModifiers(onTouchstart, ['capture']),
              "style": mergedStyle
            }, [childNode])
          }), [[_vShow, visible.value]]) : null;
        }
      });
    };
  }
});