import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import { defineComponent, shallowRef, reactive, watch, onMounted, getCurrentInstance, computed, onUnmounted, onUpdated } from 'vue';
import classNames from '../_util/classNames';
import ResizeObserver from '../vc-resize-observer';
import throttleByAnimationFrame from '../_util/throttleByAnimationFrame';
import { withInstall } from '../_util/type';
import { addObserveTarget, removeObserveTarget, getTargetRect, getFixedTop, getFixedBottom } from './utils';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import omit from '../_util/omit';
import useStyle from './style';
function getDefaultTarget() {
  return typeof window !== 'undefined' ? window : null;
}
var AffixStatus;
(function (AffixStatus) {
  AffixStatus[AffixStatus["None"] = 0] = "None";
  AffixStatus[AffixStatus["Prepare"] = 1] = "Prepare";
})(AffixStatus || (AffixStatus = {}));
// Affix
export const affixProps = () => ({
  /**
   * 距离窗口顶部达到指定偏移量后触发
   */
  offsetTop: Number,
  /** 距离窗口底部达到指定偏移量后触发 */
  offsetBottom: Number,
  /** 设置 Affix 需要监听其滚动事件的元素，值为一个返回对应 DOM 元素的函数 */
  target: {
    type: Function,
    default: getDefaultTarget
  },
  prefixCls: String,
  /** 固定状态改变时触发的回调函数 */
  onChange: Function,
  onTestUpdatePosition: Function
});
const Affix = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'AAffix',
  inheritAttrs: false,
  props: affixProps(),
  setup(props, _ref) {
    let {
      slots,
      emit,
      expose,
      attrs
    } = _ref;
    const placeholderNode = shallowRef();
    const fixedNode = shallowRef();
    const state = reactive({
      affixStyle: undefined,
      placeholderStyle: undefined,
      status: AffixStatus.None,
      lastAffix: false,
      prevTarget: null,
      timeout: null
    });
    const currentInstance = getCurrentInstance();
    const offsetTop = computed(() => {
      return props.offsetBottom === undefined && props.offsetTop === undefined ? 0 : props.offsetTop;
    });
    const offsetBottom = computed(() => props.offsetBottom);
    const measure = () => {
      const {
        status,
        lastAffix
      } = state;
      const {
        target
      } = props;
      if (status !== AffixStatus.Prepare || !fixedNode.value || !placeholderNode.value || !target) {
        return;
      }
      const targetNode = target();
      if (!targetNode) {
        return;
      }
      const newState = {
        status: AffixStatus.None
      };
      const placeholderRect = getTargetRect(placeholderNode.value);
      if (placeholderRect.top === 0 && placeholderRect.left === 0 && placeholderRect.width === 0 && placeholderRect.height === 0) {
        return;
      }
      const targetRect = getTargetRect(targetNode);
      const fixedTop = getFixedTop(placeholderRect, targetRect, offsetTop.value);
      const fixedBottom = getFixedBottom(placeholderRect, targetRect, offsetBottom.value);
      if (placeholderRect.top === 0 && placeholderRect.left === 0 && placeholderRect.width === 0 && placeholderRect.height === 0) {
        return;
      }
      if (fixedTop !== undefined) {
        const width = `${placeholderRect.width}px`;
        const height = `${placeholderRect.height}px`;
        newState.affixStyle = {
          position: 'fixed',
          top: fixedTop,
          width,
          height
        };
        newState.placeholderStyle = {
          width,
          height
        };
      } else if (fixedBottom !== undefined) {
        const width = `${placeholderRect.width}px`;
        const height = `${placeholderRect.height}px`;
        newState.affixStyle = {
          position: 'fixed',
          bottom: fixedBottom,
          width,
          height
        };
        newState.placeholderStyle = {
          width,
          height
        };
      }
      newState.lastAffix = !!newState.affixStyle;
      if (lastAffix !== newState.lastAffix) {
        emit('change', newState.lastAffix);
      }
      // update state
      _extends(state, newState);
    };
    const prepareMeasure = () => {
      _extends(state, {
        status: AffixStatus.Prepare,
        affixStyle: undefined,
        placeholderStyle: undefined
      });
      // Test if `updatePosition` called
      if (process.env.NODE_ENV === 'test') {
        emit('testUpdatePosition');
      }
    };
    const updatePosition = throttleByAnimationFrame(() => {
      prepareMeasure();
    });
    const lazyUpdatePosition = throttleByAnimationFrame(() => {
      const {
        target
      } = props;
      const {
        affixStyle
      } = state;
      // Check position change before measure to make Safari smooth
      if (target && affixStyle) {
        const targetNode = target();
        if (targetNode && placeholderNode.value) {
          const targetRect = getTargetRect(targetNode);
          const placeholderRect = getTargetRect(placeholderNode.value);
          const fixedTop = getFixedTop(placeholderRect, targetRect, offsetTop.value);
          const fixedBottom = getFixedBottom(placeholderRect, targetRect, offsetBottom.value);
          if (fixedTop !== undefined && affixStyle.top === fixedTop || fixedBottom !== undefined && affixStyle.bottom === fixedBottom) {
            return;
          }
        }
      }
      // Directly call prepare measure since it's already throttled.
      prepareMeasure();
    });
    expose({
      updatePosition,
      lazyUpdatePosition
    });
    watch(() => props.target, val => {
      const newTarget = (val === null || val === void 0 ? void 0 : val()) || null;
      if (state.prevTarget !== newTarget) {
        removeObserveTarget(currentInstance);
        if (newTarget) {
          addObserveTarget(newTarget, currentInstance);
          // Mock Event object.
          updatePosition();
        }
        state.prevTarget = newTarget;
      }
    });
    watch(() => [props.offsetTop, props.offsetBottom], updatePosition);
    onMounted(() => {
      const {
        target
      } = props;
      if (target) {
        // [Legacy] Wait for parent component ref has its value.
        // We should use target as directly element instead of function which makes element check hard.
        state.timeout = setTimeout(() => {
          addObserveTarget(target(), currentInstance);
          // Mock Event object.
          updatePosition();
        });
      }
    });
    onUpdated(() => {
      measure();
    });
    onUnmounted(() => {
      clearTimeout(state.timeout);
      removeObserveTarget(currentInstance);
      updatePosition.cancel();
      // https://github.com/ant-design/ant-design/issues/22683
      lazyUpdatePosition.cancel();
    });
    const {
      prefixCls
    } = useConfigInject('affix', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    return () => {
      var _a;
      const {
        affixStyle,
        placeholderStyle,
        status
      } = state;
      const className = classNames({
        [prefixCls.value]: affixStyle,
        [hashId.value]: true
      });
      const restProps = omit(props, ['prefixCls', 'offsetTop', 'offsetBottom', 'target', 'onChange', 'onTestUpdatePosition']);
      return wrapSSR(_createVNode(ResizeObserver, {
        "onResize": updatePosition
      }, {
        default: () => [_createVNode("div", _objectSpread(_objectSpread(_objectSpread({}, restProps), attrs), {}, {
          "ref": placeholderNode,
          "data-measure-status": status
        }), [affixStyle && _createVNode("div", {
          "style": placeholderStyle,
          "aria-hidden": "true"
        }, null), _createVNode("div", {
          "class": className,
          "ref": fixedNode,
          "style": affixStyle
        }, [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)])])]
      }));
    };
  }
});
export default withInstall(Affix);