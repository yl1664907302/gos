import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import { nextTick, onActivated, watchEffect, defineComponent, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue';
import addEventListenerWrap from '../vc-util/Dom/addEventListener';
import { getOffset } from '../vc-util/Dom/css';
import classNames from '../_util/classNames';
import getScrollBarSize from '../_util/getScrollBarSize';
import { useInjectTable } from './context/TableContext';
import { useLayoutState } from './hooks/useFrame';
export default defineComponent({
  name: 'StickyScrollBar',
  inheritAttrs: false,
  props: ['offsetScroll', 'container', 'scrollBodyRef', 'scrollBodySizeInfo'],
  emits: ['scroll'],
  setup(props, _ref) {
    let {
      emit,
      expose
    } = _ref;
    const tableContext = useInjectTable();
    const bodyScrollWidth = shallowRef(0);
    const bodyWidth = shallowRef(0);
    const scrollBarWidth = shallowRef(0);
    watchEffect(() => {
      bodyScrollWidth.value = props.scrollBodySizeInfo.scrollWidth || 0;
      bodyWidth.value = props.scrollBodySizeInfo.clientWidth || 0;
      scrollBarWidth.value = bodyScrollWidth.value && bodyWidth.value * (bodyWidth.value / bodyScrollWidth.value);
    }, {
      flush: 'post'
    });
    const scrollBarRef = shallowRef();
    const [scrollState, setScrollState] = useLayoutState({
      scrollLeft: 0,
      isHiddenScrollBar: true
    });
    const refState = ref({
      delta: 0,
      x: 0
    });
    const isActive = shallowRef(false);
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
      const tableOffsetTop = getOffset(props.scrollBodyRef.value).top;
      const tableBottomOffset = tableOffsetTop + props.scrollBodyRef.value.offsetHeight;
      const currentClientOffset = props.container === window ? document.documentElement.scrollTop + window.innerHeight : getOffset(props.container).top + props.container.clientHeight;
      if (tableBottomOffset - getScrollBarSize() <= currentClientOffset || tableOffsetTop >= currentClientOffset - props.offsetScroll) {
        setScrollState(state => _extends(_extends({}, state), {
          isHiddenScrollBar: true
        }));
      } else {
        setScrollState(state => _extends(_extends({}, state), {
          isHiddenScrollBar: false
        }));
      }
    };
    const setScrollLeft = left => {
      setScrollState(state => {
        return _extends(_extends({}, state), {
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
    onMounted(() => {
      onMouseUpListener = addEventListenerWrap(document.body, 'mouseup', onMouseUp, false);
      onMouseMoveListener = addEventListenerWrap(document.body, 'mousemove', onMouseMove, false);
      onResizeListener = addEventListenerWrap(window, 'resize', onContainerScroll, false);
    });
    onActivated(() => {
      nextTick(() => {
        onContainerScroll();
      });
    });
    onMounted(() => {
      setTimeout(() => {
        watch([scrollBarWidth, isActive], () => {
          onContainerScroll();
        }, {
          immediate: true,
          flush: 'post'
        });
      });
    });
    watch(() => props.container, () => {
      onScrollListener === null || onScrollListener === void 0 ? void 0 : onScrollListener.remove();
      onScrollListener = addEventListenerWrap(props.container, 'scroll', onContainerScroll, false);
    }, {
      immediate: true,
      flush: 'post'
    });
    onBeforeUnmount(() => {
      onMouseUpListener === null || onMouseUpListener === void 0 ? void 0 : onMouseUpListener.remove();
      onMouseMoveListener === null || onMouseMoveListener === void 0 ? void 0 : onMouseMoveListener.remove();
      onScrollListener === null || onScrollListener === void 0 ? void 0 : onScrollListener.remove();
      onResizeListener === null || onResizeListener === void 0 ? void 0 : onResizeListener.remove();
    });
    watch(() => _extends({}, scrollState.value), (newState, preState) => {
      if (newState.isHiddenScrollBar !== (preState === null || preState === void 0 ? void 0 : preState.isHiddenScrollBar) && !newState.isHiddenScrollBar) {
        setScrollState(state => {
          const bodyNode = props.scrollBodyRef.value;
          if (!bodyNode) {
            return state;
          }
          return _extends(_extends({}, state), {
            scrollLeft: bodyNode.scrollLeft / bodyNode.scrollWidth * bodyNode.clientWidth
          });
        });
      }
    }, {
      immediate: true
    });
    const scrollbarSize = getScrollBarSize();
    return () => {
      if (bodyScrollWidth.value <= bodyWidth.value || !scrollBarWidth.value || scrollState.value.isHiddenScrollBar) {
        return null;
      }
      const {
        prefixCls
      } = tableContext;
      return _createVNode("div", {
        "style": {
          height: `${scrollbarSize}px`,
          width: `${bodyWidth.value}px`,
          bottom: `${props.offsetScroll}px`
        },
        "class": `${prefixCls}-sticky-scroll`
      }, [_createVNode("div", {
        "onMousedown": onMouseDown,
        "ref": scrollBarRef,
        "class": classNames(`${prefixCls}-sticky-scroll-bar`, {
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