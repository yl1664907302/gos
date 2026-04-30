import _extends from "@babel/runtime/helpers/esm/extends";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { Fragment as _Fragment, createVNode as _createVNode } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import { ref, computed, watch, watchEffect, defineComponent, toRefs, shallowRef } from 'vue';
import Trigger, { triggerProps } from '../vc-trigger';
import classNames from '../_util/classNames';
import useMergedState from '../_util/hooks/useMergedState';
import useTarget from './hooks/useTarget';
import TourStep from './TourStep';
import Mask from './Mask';
import { getPlacements } from './placements';
import { initDefaultProps } from '../_util/props-util';
import { someType, stringType, arrayType, objectType, functionType, booleanType } from '../_util/type';
import Portal from '../_util/PortalWrapper';
const CENTER_PLACEHOLDER = {
  left: '50%',
  top: '50%',
  width: '1px',
  height: '1px'
};
export const tourProps = () => {
  const {
    builtinPlacements,
    popupAlign
  } = triggerProps();
  return {
    builtinPlacements,
    popupAlign,
    steps: arrayType(),
    open: booleanType(),
    defaultCurrent: {
      type: Number
    },
    current: {
      type: Number
    },
    onChange: functionType(),
    onClose: functionType(),
    onFinish: functionType(),
    mask: someType([Boolean, Object], true),
    arrow: someType([Boolean, Object], true),
    rootClassName: {
      type: String
    },
    placement: stringType('bottom'),
    prefixCls: {
      type: String,
      default: 'rc-tour'
    },
    renderPanel: functionType(),
    gap: objectType(),
    animated: someType([Boolean, Object]),
    scrollIntoViewOptions: someType([Boolean, Object], true),
    zIndex: {
      type: Number,
      default: 1001
    }
  };
};
const Tour = defineComponent({
  name: 'Tour',
  inheritAttrs: false,
  props: initDefaultProps(tourProps(), {}),
  setup(props) {
    const {
      defaultCurrent,
      placement,
      mask,
      scrollIntoViewOptions,
      open,
      gap,
      arrow
    } = toRefs(props);
    const triggerRef = ref();
    const [mergedCurrent, setMergedCurrent] = useMergedState(0, {
      value: computed(() => props.current),
      defaultValue: defaultCurrent.value
    });
    const [mergedOpen, setMergedOpen] = useMergedState(undefined, {
      value: computed(() => props.open),
      postState: origin => mergedCurrent.value < 0 || mergedCurrent.value >= props.steps.length ? false : origin !== null && origin !== void 0 ? origin : true
    });
    const openRef = shallowRef(mergedOpen.value);
    watchEffect(() => {
      if (mergedOpen.value && !openRef.value) {
        setMergedCurrent(0);
      }
      openRef.value = mergedOpen.value;
    });
    const curStep = computed(() => props.steps[mergedCurrent.value] || {});
    const mergedPlacement = computed(() => {
      var _a;
      return (_a = curStep.value.placement) !== null && _a !== void 0 ? _a : placement.value;
    });
    const mergedMask = computed(() => {
      var _a;
      return mergedOpen.value && ((_a = curStep.value.mask) !== null && _a !== void 0 ? _a : mask.value);
    });
    const mergedScrollIntoViewOptions = computed(() => {
      var _a;
      return (_a = curStep.value.scrollIntoViewOptions) !== null && _a !== void 0 ? _a : scrollIntoViewOptions.value;
    });
    const [posInfo, targetElement] = useTarget(computed(() => curStep.value.target), open, gap, mergedScrollIntoViewOptions);
    // ========================= arrow =========================
    const mergedArrow = computed(() => targetElement.value ? typeof curStep.value.arrow === 'undefined' ? arrow.value : curStep.value.arrow : false);
    const arrowPointAtCenter = computed(() => typeof mergedArrow.value === 'object' ? mergedArrow.value.pointAtCenter : false);
    watch(arrowPointAtCenter, () => {
      var _a;
      (_a = triggerRef.value) === null || _a === void 0 ? void 0 : _a.forcePopupAlign();
    });
    watch(mergedCurrent, () => {
      var _a;
      (_a = triggerRef.value) === null || _a === void 0 ? void 0 : _a.forcePopupAlign();
    });
    // ========================= Change =========================
    const onInternalChange = nextCurrent => {
      var _a;
      setMergedCurrent(nextCurrent);
      (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, nextCurrent);
    };
    return () => {
      var _a;
      const {
          prefixCls,
          steps,
          onClose,
          onFinish,
          rootClassName,
          renderPanel,
          animated,
          zIndex
        } = props,
        restProps = __rest(props, ["prefixCls", "steps", "onClose", "onFinish", "rootClassName", "renderPanel", "animated", "zIndex"]);
      // ========================= Render =========================
      // Skip if not init yet
      if (targetElement.value === undefined) {
        return null;
      }
      const handleClose = () => {
        setMergedOpen(false);
        onClose === null || onClose === void 0 ? void 0 : onClose(mergedCurrent.value);
      };
      const mergedShowMask = typeof mergedMask.value === 'boolean' ? mergedMask.value : !!mergedMask.value;
      const mergedMaskStyle = typeof mergedMask.value === 'boolean' ? undefined : mergedMask.value;
      // when targetElement is not exist, use body as triggerDOMNode
      const getTriggerDOMNode = () => {
        return targetElement.value || document.body;
      };
      const getPopupElement = () => _createVNode(TourStep, _objectSpread({
        "arrow": mergedArrow.value,
        "key": "content",
        "prefixCls": prefixCls,
        "total": steps.length,
        "renderPanel": renderPanel,
        "onPrev": () => {
          onInternalChange(mergedCurrent.value - 1);
        },
        "onNext": () => {
          onInternalChange(mergedCurrent.value + 1);
        },
        "onClose": handleClose,
        "current": mergedCurrent.value,
        "onFinish": () => {
          handleClose();
          onFinish === null || onFinish === void 0 ? void 0 : onFinish();
        }
      }, curStep.value), null);
      const posInfoStyle = computed(() => {
        const info = posInfo.value || CENTER_PLACEHOLDER;
        // 如果info[key] 是number，添加 px
        const style = {};
        Object.keys(info).forEach(key => {
          if (typeof info[key] === 'number') {
            style[key] = `${info[key]}px`;
          } else {
            style[key] = info[key];
          }
        });
        return style;
      });
      return mergedOpen.value ? _createVNode(_Fragment, null, [_createVNode(Mask, {
        "zIndex": zIndex,
        "prefixCls": prefixCls,
        "pos": posInfo.value,
        "showMask": mergedShowMask,
        "style": mergedMaskStyle === null || mergedMaskStyle === void 0 ? void 0 : mergedMaskStyle.style,
        "fill": mergedMaskStyle === null || mergedMaskStyle === void 0 ? void 0 : mergedMaskStyle.color,
        "open": mergedOpen.value,
        "animated": animated,
        "rootClassName": rootClassName
      }, null), _createVNode(Trigger, _objectSpread(_objectSpread({}, restProps), {}, {
        "arrow": !!restProps.arrow,
        "builtinPlacements": !curStep.value.target ? undefined : (_a = restProps.builtinPlacements) !== null && _a !== void 0 ? _a : getPlacements(arrowPointAtCenter.value),
        "ref": triggerRef,
        "popupStyle": !curStep.value.target ? _extends(_extends({}, curStep.value.style), {
          position: 'fixed',
          left: CENTER_PLACEHOLDER.left,
          top: CENTER_PLACEHOLDER.top,
          transform: 'translate(-50%, -50%)'
        }) : curStep.value.style,
        "popupPlacement": mergedPlacement.value,
        "popupVisible": mergedOpen.value,
        "popupClassName": classNames(rootClassName, curStep.value.className),
        "prefixCls": prefixCls,
        "popup": getPopupElement,
        "forceRender": false,
        "destroyPopupOnHide": true,
        "zIndex": zIndex,
        "mask": false,
        "getTriggerDOMNode": getTriggerDOMNode
      }), {
        default: () => [_createVNode(Portal, {
          "visible": mergedOpen.value,
          "autoLock": true
        }, {
          default: () => [_createVNode("div", {
            "class": classNames(rootClassName, `${prefixCls}-target-placeholder`),
            "style": _extends(_extends({}, posInfoStyle.value), {
              position: 'fixed',
              pointerEvents: 'none'
            })
          }, null)]
        })]
      })]) : null;
    };
  }
});
export default Tour;