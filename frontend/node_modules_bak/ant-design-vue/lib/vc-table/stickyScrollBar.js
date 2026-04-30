"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _addEventListener = _interopRequireDefault(require("../vc-util/Dom/addEventListener"));
var _css = require("../vc-util/Dom/css");
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _getScrollBarSize = _interopRequireDefault(require("../_util/getScrollBarSize"));
var _TableContext = require("./context/TableContext");
var _useFrame = require("./hooks/useFrame");
var _default = exports.default = (0, _vue.defineComponent)({
  name: 'StickyScrollBar',
  inheritAttrs: false,
  props: ['offsetScroll', 'container', 'scrollBodyRef', 'scrollBodySizeInfo'],
  emits: ['scroll'],
  setup(props, _ref) {
    let {
      emit,
      expose
    } = _ref;
    const tableContext = (0, _TableContext.useInjectTable)();
    const bodyScrollWidth = (0, _vue.shallowRef)(0);
    const bodyWidth = (0, _vue.shallowRef)(0);
    const scrollBarWidth = (0, _vue.shallowRef)(0);
    (0, _vue.watchEffect)(() => {
      bodyScrollWidth.value = props.scrollBodySizeInfo.scrollWidth || 0;
      bodyWidth.value = props.scrollBodySizeInfo.clientWidth || 0;
      scrollBarWidth.value = bodyScrollWidth.value && bodyWidth.value * (bodyWidth.value / bodyScrollWidth.value);
    }, {
      flush: 'post'
    });
    const scrollBarRef = (0, _vue.shallowRef)();
    const [scrollState, setScrollState] = (0, _useFrame.useLayoutState)({
      scrollLeft: 0,
      isHiddenScrollBar: true
    });
    const refState = (0, _vue.ref)({
      delta: 0,
      x: 0
    });
    const isActive = (0, _vue.shallowRef)(false);
    const onMouseUp = () => {
      isActive.value = false;
    };
    const onMouseDown = event => {
      refState.value = {
        delta: event.pageX - scrollState.value.scrollLeft,
        x: 0
      };
      isActive.value = true;
      event.preventDefault();
    };
    const onMouseMove = event => {
      // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
      const {
        buttons
      } = event || (window === null || window === void 0 ? void 0 : window.event);
      if (!isActive.value || buttons === 0) {
        // If out body mouse up, we can set isActive false when mouse move
        if (isActive.value) {
          isActive.value = false;
        }
        return;
      }
      let left = refState.value.x + event.pageX - refState.value.x - refState.value.delta;
      if (left <= 0) {
        left = 0;
      }
      if (left + scrollBarWidth.value >= bodyWidth.value) {
        left = bodyWidth.value - scrollBarWidth.value;
      }
      emit('scroll', {
        scrollLeft: left / bodyWidth.value * (bodyScrollWidth.value + 2)
      });
      refState.value.x = event.pageX;
    };
    const onContainerScroll = () => {
      if (!props.scrollBodyRef.value) {
        return;
      }
      const tableOffsetTop = (0, _css.getOffset)(props.scrollBodyRef.value).top;
      const tableBottomOffset = tableOffsetTop + props.scrollBodyRef.value.offsetHeight;
      const currentClientOffset = props.container === window ? document.documentElement.scrollTop + window.innerHeight : (0, _css.getOffset)(props.container).top + props.container.clientHeight;
      if (tableBottomOffset - (0, _getScrollBarSize.default)() <= currentClientOffset || tableOffsetTop >= currentClientOffset - props.offsetScroll) {
        setScrollState(state => (0, _extends2.default)((0, _extends2.default)({}, state), {
          isHiddenScrollBar: true
        }));
      } else {
        setScrollState(state => (0, _extends2.default)((0, _extends2.default)({}, state), {
          isHiddenScrollBar: false
        }));
      }
    };
    const setScrollLeft = left => {
      setScrollState(state => {
        return (0, _extends2.default)((0, _extends2.default)({}, state), {
          scrollLeft: left / bodyScrollWidth.value * bodyWidth.value || 0
        });
      });
    };
    expose({
      setScrollLeft
    });
    let onMouseUpListener = null;
    let onMouseMoveListener = null;
    let onResizeListener = null;
    let onScrollListener = null;
    (0, _vue.onMounted)(() => {
      onMouseUpListener = (0, _addEventListener.default)(document.body, 'mouseup', onMouseUp, false);
      onMouseMoveListener = (0, _addEventListener.default)(document.body, 'mousemove', onMouseMove, false);
      onResizeListener = (0, _addEventListener.default)(window, 'resize', onContainerScroll, false);
    });
    (0, _vue.onActivated)(() => {
      (0, _vue.nextTick)(() => {
        onContainerScroll();
      });
    });
    (0, _vue.onMounted)(() => {
      setTimeout(() => {
        (0, _vue.watch)([scrollBarWidth, isActive], () => {
          onContainerScroll();
        }, {
          immediate: true,
          flush: 'post'
        });
      });
    });
    (0, _vue.watch)(() => props.container, () => {
      onScrollListener === null || onScrollListener === void 0 ? void 0 : onScrollListener.remove();
      onScrollListener = (0, _addEventListener.default)(props.container, 'scroll', onContainerScroll, false);
    }, {
      immediate: true,
      flush: 'post'
    });
    (0, _vue.onBeforeUnmount)(() => {
      onMouseUpListener === null || onMouseUpListener === void 0 ? void 0 : onMouseUpListener.remove();
      onMouseMoveListener === null || onMouseMoveListener === void 0 ? void 0 : onMouseMoveListener.remove();
      onScrollListener === null || onScrollListener === void 0 ? void 0 : onScrollListener.remove();
      onResizeListener === null || onResizeListener === void 0 ? void 0 : onResizeListener.remove();
    });
    (0, _vue.watch)(() => (0, _extends2.default)({}, scrollState.value), (newState, preState) => {
      if (newState.isHiddenScrollBar !== (preState === null || preState === void 0 ? void 0 : preState.isHiddenScrollBar) && !newState.isHiddenScrollBar) {
        setScrollState(state => {
          const bodyNode = props.scrollBodyRef.value;
          if (!bodyNode) {
            return state;
          }
          return (0, _extends2.default)((0, _extends2.default)({}, state), {
            scrollLeft: bodyNode.scrollLeft / bodyNode.scrollWidth * bodyNode.clientWidth
          });
        });
      }
    }, {
      immediate: true
    });
    const scrollbarSize = (0, _getScrollBarSize.default)();
    return () => {
      if (bodyScrollWidth.value <= bodyWidth.value || !scrollBarWidth.value || scrollState.value.isHiddenScrollBar) {
        return null;
      }
      const {
        prefixCls
      } = tableContext;
      return (0, _vue.createVNode)("div", {
        "style": {
          height: `${scrollbarSize}px`,
          width: `${bodyWidth.value}px`,
          bottom: `${props.offsetScroll}px`
        },
        "class": `${prefixCls}-sticky-scroll`
      }, [(0, _vue.createVNode)("div", {
        "onMousedown": onMouseDown,
        "ref": scrollBarRef,
        "class": (0, _classNames.default)(`${prefixCls}-sticky-scroll-bar`, {
          [`${prefixCls}-sticky-scroll-bar-active`]: isActive.value
        }),
        "style": {
          width: `${scrollBarWidth.value}px`,
          transform: `translate3d(${scrollState.value.scrollLeft}px, 0, 0)`
        }
      }, null)]);
    };
  }
});