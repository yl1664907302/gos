"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.affixProps = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _vcResizeObserver = _interopRequireDefault(require("../vc-resize-observer"));
var _throttleByAnimationFrame = _interopRequireDefault(require("../_util/throttleByAnimationFrame"));
var _type = require("../_util/type");
var _utils = require("./utils");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _omit = _interopRequireDefault(require("../_util/omit"));
var _style = _interopRequireDefault(require("./style"));
function getDefaultTarget() {
  return typeof window !== 'undefined' ? window : null;
}
var AffixStatus;
(function (AffixStatus) {
  AffixStatus[AffixStatus["None"] = 0] = "None";
  AffixStatus[AffixStatus["Prepare"] = 1] = "Prepare";
})(AffixStatus || (AffixStatus = {}));
// Affix
const affixProps = () => ({
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
exports.affixProps = affixProps;
const Affix = (0, _vue.defineComponent)({
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
    const placeholderNode = (0, _vue.shallowRef)();
    const fixedNode = (0, _vue.shallowRef)();
    const state = (0, _vue.reactive)({
      affixStyle: undefined,
      placeholderStyle: undefined,
      status: AffixStatus.None,
      lastAffix: false,
      prevTarget: null,
      timeout: null
    });
    const currentInstance = (0, _vue.getCurrentInstance)();
    const offsetTop = (0, _vue.computed)(() => {
      return props.offsetBottom === undefined && props.offsetTop === undefined ? 0 : props.offsetTop;
    });
    const offsetBottom = (0, _vue.computed)(() => props.offsetBottom);
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
      const placeholderRect = (0, _utils.getTargetRect)(placeholderNode.value);
      if (placeholderRect.top === 0 && placeholderRect.left === 0 && placeholderRect.width === 0 && placeholderRect.height === 0) {
        return;
      }
      const targetRect = (0, _utils.getTargetRect)(targetNode);
      const fixedTop = (0, _utils.getFixedTop)(placeholderRect, targetRect, offsetTop.value);
      const fixedBottom = (0, _utils.getFixedBottom)(placeholderRect, targetRect, offsetBottom.value);
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
      (0, _extends2.default)(state, newState);
    };
    const prepareMeasure = () => {
      (0, _extends2.default)(state, {
        status: AffixStatus.Prepare,
        affixStyle: undefined,
        placeholderStyle: undefined
      });
      // Test if `updatePosition` called
      if (process.env.NODE_ENV === 'test') {
        emit('testUpdatePosition');
      }
    };
    const updatePosition = (0, _throttleByAnimationFrame.default)(() => {
      prepareMeasure();
    });
    const lazyUpdatePosition = (0, _throttleByAnimationFrame.default)(() => {
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
          const targetRect = (0, _utils.getTargetRect)(targetNode);
          const placeholderRect = (0, _utils.getTargetRect)(placeholderNode.value);
          const fixedTop = (0, _utils.getFixedTop)(placeholderRect, targetRect, offsetTop.value);
          const fixedBottom = (0, _utils.getFixedBottom)(placeholderRect, targetRect, offsetBottom.value);
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
    (0, _vue.watch)(() => props.target, val => {
      const newTarget = (val === null || val === void 0 ? void 0 : val()) || null;
      if (state.prevTarget !== newTarget) {
        (0, _utils.removeObserveTarget)(currentInstance);
        if (newTarget) {
          (0, _utils.addObserveTarget)(newTarget, currentInstance);
          // Mock Event object.
          updatePosition();
        }
        state.prevTarget = newTarget;
      }
    });
    (0, _vue.watch)(() => [props.offsetTop, props.offsetBottom], updatePosition);
    (0, _vue.onMounted)(() => {
      const {
        target
      } = props;
      if (target) {
        // [Legacy] Wait for parent component ref has its value.
        // We should use target as directly element instead of function which makes element check hard.
        state.timeout = setTimeout(() => {
          (0, _utils.addObserveTarget)(target(), currentInstance);
          // Mock Event object.
          updatePosition();
        });
      }
    });
    (0, _vue.onUpdated)(() => {
      measure();
    });
    (0, _vue.onUnmounted)(() => {
      clearTimeout(state.timeout);
      (0, _utils.removeObserveTarget)(currentInstance);
      updatePosition.cancel();
      // https://github.com/ant-design/ant-design/issues/22683
      lazyUpdatePosition.cancel();
    });
    const {
      prefixCls
    } = (0, _useConfigInject.default)('affix', props);
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    return () => {
      var _a;
      const {
        affixStyle,
        placeholderStyle,
        status
      } = state;
      const className = (0, _classNames.default)({
        [prefixCls.value]: affixStyle,
        [hashId.value]: true
      });
      const restProps = (0, _omit.default)(props, ['prefixCls', 'offsetTop', 'offsetBottom', 'target', 'onChange', 'onTestUpdatePosition']);
      return wrapSSR((0, _vue.createVNode)(_vcResizeObserver.default, {
        "onResize": updatePosition
      }, {
        default: () => [(0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, restProps), attrs), {}, {
          "ref": placeholderNode,
          "data-measure-status": status
        }), [affixStyle && (0, _vue.createVNode)("div", {
          "style": placeholderStyle,
          "aria-hidden": "true"
        }, null), (0, _vue.createVNode)("div", {
          "class": className,
          "ref": fixedNode,
          "style": affixStyle
        }, [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)])])]
      }));
    };
  }
});
var _default = exports.default = (0, _type.withInstall)(Affix);