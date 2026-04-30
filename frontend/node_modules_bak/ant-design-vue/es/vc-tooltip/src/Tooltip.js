import _extends from "@babel/runtime/helpers/esm/extends";
import { resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import PropTypes from '../../_util/vue-types';
import Trigger from '../../vc-trigger';
import { placements } from './placements';
import Content from './Content';
import { getPropsSlot } from '../../_util/props-util';
import { defineComponent, shallowRef, watchEffect } from 'vue';
function noop() {}
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'Tooltip',
  inheritAttrs: false,
  props: {
    trigger: PropTypes.any.def(['hover']),
    defaultVisible: {
      type: Boolean,
      default: undefined
    },
    visible: {
      type: Boolean,
      default: undefined
    },
    placement: PropTypes.string.def('right'),
    transitionName: String,
    animation: PropTypes.any,
    afterVisibleChange: PropTypes.func.def(() => {}),
    overlayStyle: {
      type: Object,
      default: undefined
    },
    overlayClassName: String,
    prefixCls: PropTypes.string.def('rc-tooltip'),
    mouseEnterDelay: PropTypes.number.def(0.1),
    mouseLeaveDelay: PropTypes.number.def(0.1),
    getPopupContainer: Function,
    destroyTooltipOnHide: {
      type: Boolean,
      default: false
    },
    align: PropTypes.object.def(() => ({})),
    arrowContent: PropTypes.any.def(null),
    tipId: String,
    builtinPlacements: PropTypes.object,
    overlayInnerStyle: {
      type: Object,
      default: undefined
    },
    popupVisible: {
      type: Boolean,
      default: undefined
    },
    onVisibleChange: Function,
    onPopupAlign: Function,
    arrow: {
      type: Boolean,
      default: true
    }
  },
  setup(props, _ref) {
    let {
      slots,
      attrs,
      expose
    } = _ref;
    const triggerDOM = shallowRef();
    const getPopupElement = () => {
      const {
        prefixCls,
        tipId,
        overlayInnerStyle
      } = props;
      return [!!props.arrow ? _createVNode("div", {
        "class": `${prefixCls}-arrow`,
        "key": "arrow"
      }, [getPropsSlot(slots, props, 'arrowContent')]) : null, _createVNode(Content, {
        "key": "content",
        "prefixCls": prefixCls,
        "id": tipId,
        "overlayInnerStyle": overlayInnerStyle
      }, {
        overlay: slots.overlay
      })];
    };
    const getPopupDomNode = () => {
      return triggerDOM.value.getPopupDomNode();
    };
    expose({
      getPopupDomNode,
      triggerDOM,
      forcePopupAlign: () => {
        var _a;
        return (_a = triggerDOM.value) === null || _a === void 0 ? void 0 : _a.forcePopupAlign();
      }
    });
    const destroyTooltip = shallowRef(false);
    const autoDestroy = shallowRef(false);
    watchEffect(() => {
      const {
        destroyTooltipOnHide
      } = props;
      if (typeof destroyTooltipOnHide === 'boolean') {
        destroyTooltip.value = destroyTooltipOnHide;
      } else if (destroyTooltipOnHide && typeof destroyTooltipOnHide === 'object') {
        const {
          keepParent
        } = destroyTooltipOnHide;
        destroyTooltip.value = keepParent === true;
        autoDestroy.value = keepParent === false;
      }
    });
    return () => {
      const {
          overlayClassName,
          trigger,
          mouseEnterDelay,
          mouseLeaveDelay,
          overlayStyle,
          prefixCls,
          afterVisibleChange,
          transitionName,
          animation,
          placement,
          align,
          destroyTooltipOnHide,
          defaultVisible
        } = props,
        restProps = __rest(props, ["overlayClassName", "trigger", "mouseEnterDelay", "mouseLeaveDelay", "overlayStyle", "prefixCls", "afterVisibleChange", "transitionName", "animation", "placement", "align", "destroyTooltipOnHide", "defaultVisible"]);
      const extraProps = _extends({}, restProps);
      if (props.visible !== undefined) {
        extraProps.popupVisible = props.visible;
      }
      const triggerProps = _extends(_extends(_extends({
        popupClassName: overlayClassName,
        prefixCls,
        action: trigger,
        builtinPlacements: placements,
        popupPlacement: placement,
        popupAlign: align,
        afterPopupVisibleChange: afterVisibleChange,
        popupTransitionName: transitionName,
        popupAnimation: animation,
        defaultPopupVisible: defaultVisible,
        destroyPopupOnHide: destroyTooltip.value,
        autoDestroy: autoDestroy.value,
        mouseLeaveDelay,
        popupStyle: overlayStyle,
        mouseEnterDelay
      }, extraProps), attrs), {
        onPopupVisibleChange: props.onVisibleChange || noop,
        onPopupAlign: props.onPopupAlign || noop,
        ref: triggerDOM,
        arrow: !!props.arrow,
        popup: getPopupElement()
      });
      return _createVNode(Trigger, triggerProps, {
        default: slots.default
      });
    };
  }
});