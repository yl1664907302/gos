import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
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
import { shallowRef, toRaw, onMounted, onUpdated, defineComponent, watchEffect, computed, nextTick, onBeforeUnmount, reactive, watch } from 'vue';
import Filler from './Filler';
import Item from './Item';
import ScrollBar from './ScrollBar';
import useHeights from './hooks/useHeights';
import useScrollTo from './hooks/useScrollTo';
import useFrameWheel from './hooks/useFrameWheel';
import useMobileTouchMove from './hooks/useMobileTouchMove';
import useOriginScroll from './hooks/useOriginScroll';
import PropTypes from '../_util/vue-types';
import classNames from '../_util/classNames';
import supportsPassive from '../_util/supportsPassive';
const EMPTY_DATA = [];
const ScrollStyle = {
  overflowY: 'auto',
  overflowAnchor: 'none'
};
function renderChildren(list, startIndex, endIndex, setNodeRef, renderFunc, _ref) {
  let {
    getKey
  } = _ref;
  return list.slice(startIndex, endIndex + 1).map((item, index) => {
    const eleIndex = startIndex + index;
    const node = renderFunc(item, eleIndex, {
      // style: status === 'MEASURE_START' ? { visibility: 'hidden' } : {},
    });
    const key = getKey(item);
    return _createVNode(Item, {
      "key": key,
      "setRef": ele => setNodeRef(item, ele)
    }, {
      default: () => [node]
    });
  });
}
const List = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'List',
  inheritAttrs: false,
  props: {
    prefixCls: String,
    data: PropTypes.array,
    height: Number,
    itemHeight: Number,
    /** If not match virtual scroll condition, Set List still use height of container. */
    fullHeight: {
      type: Boolean,
      default: undefined
    },
    itemKey: {
      type: [String, Number, Function],
      required: true
    },
    component: {
      type: [String, Object]
    },
    /** Set `false` will always use real scroll instead of virtual one */
    virtual: {
      type: Boolean,
      default: undefined
    },
    children: Function,
    onScroll: Function,
    onMousedown: Function,
    onMouseenter: Function,
    onVisibleChange: Function
  },
  setup(props, _ref2) {
    let {
      expose
    } = _ref2;
    // ================================= MISC =================================
    const useVirtual = computed(() => {
      const {
        height,
        itemHeight,
        virtual
      } = props;
      return !!(virtual !== false && height && itemHeight);
    });
    const inVirtual = computed(() => {
      const {
        height,
        itemHeight,
        data
      } = props;
      return useVirtual.value && data && itemHeight * data.length > height;
    });
    const state = reactive({
      scrollTop: 0,
      scrollMoving: false
    });
    const data = computed(() => {
      return props.data || EMPTY_DATA;
    });
    const mergedData = shallowRef([]);
    watch(data, () => {
      mergedData.value = toRaw(data.value).slice();
    }, {
      immediate: true
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const itemKey = shallowRef(_item => undefined);
    watch(() => props.itemKey, val => {
      if (typeof val === 'function') {
        itemKey.value = val;
      } else {
        itemKey.value = item => item === null || item === void 0 ? void 0 : item[val];
      }
    }, {
      immediate: true
    });
    const componentRef = shallowRef();
    const fillerInnerRef = shallowRef();
    const scrollBarRef = shallowRef(); // Hack on scrollbar to enable flash call
    // =============================== Item Key ===============================
    const getKey = item => {
      return itemKey.value(item);
    };
    const sharedConfig = {
      getKey
    };
    // ================================ Scroll ================================
    function syncScrollTop(newTop) {
      let value;
      if (typeof newTop === 'function') {
        value = newTop(state.scrollTop);
      } else {
        value = newTop;
      }
      const alignedTop = keepInRange(value);
      if (componentRef.value) {
        componentRef.value.scrollTop = alignedTop;
      }
      state.scrollTop = alignedTop;
    }
    // ================================ Height ================================
    const [setInstance, collectHeight, heights, updatedMark] = useHeights(mergedData, getKey, null, null);
    const calRes = reactive({
      scrollHeight: undefined,
      start: 0,
      end: 0,
      offset: undefined
    });
    const offsetHeight = shallowRef(0);
    onMounted(() => {
      nextTick(() => {
        var _a;
        offsetHeight.value = ((_a = fillerInnerRef.value) === null || _a === void 0 ? void 0 : _a.offsetHeight) || 0;
      });
    });
    onUpdated(() => {
      nextTick(() => {
        var _a;
        offsetHeight.value = ((_a = fillerInnerRef.value) === null || _a === void 0 ? void 0 : _a.offsetHeight) || 0;
      });
    });
    watch([useVirtual, mergedData], () => {
      if (!useVirtual.value) {
        _extends(calRes, {
          scrollHeight: undefined,
          start: 0,
          end: mergedData.value.length - 1,
          offset: undefined
        });
      }
    }, {
      immediate: true
    });
    watch([useVirtual, mergedData, offsetHeight, inVirtual], () => {
      // Always use virtual scroll bar in avoid shaking
      if (useVirtual.value && !inVirtual.value) {
        _extends(calRes, {
          scrollHeight: offsetHeight.value,
          start: 0,
          end: mergedData.value.length - 1,
          offset: undefined
        });
      }
      if (componentRef.value) {
        state.scrollTop = componentRef.value.scrollTop;
      }
    }, {
      immediate: true
    });
    watch([inVirtual, useVirtual, () => state.scrollTop, mergedData, updatedMark, () => props.height, offsetHeight], () => {
      if (!useVirtual.value || !inVirtual.value) {
        return;
      }
      let itemTop = 0;
      let startIndex;
      let startOffset;
      let endIndex;
      const dataLen = mergedData.value.length;
      const data = mergedData.value;
      const scrollTop = state.scrollTop;
      const {
        itemHeight,
        height
      } = props;
      const scrollTopHeight = scrollTop + height;
      for (let i = 0; i < dataLen; i += 1) {
        const item = data[i];
        const key = getKey(item);
        let cacheHeight = heights.get(key);
        if (cacheHeight === undefined) {
          cacheHeight = itemHeight;
        }
        const currentItemBottom = itemTop + cacheHeight;
        if (startIndex === undefined && currentItemBottom >= scrollTop) {
          startIndex = i;
          startOffset = itemTop;
        }
        // Check item bottom in the range. We will render additional one item for motion usage
        if (endIndex === undefined && currentItemBottom > scrollTopHeight) {
          endIndex = i;
        }
        itemTop = currentItemBottom;
      }
      // When scrollTop at the end but data cut to small count will reach this
      if (startIndex === undefined) {
        startIndex = 0;
        startOffset = 0;
        endIndex = Math.ceil(height / itemHeight);
      }
      if (endIndex === undefined) {
        endIndex = dataLen - 1;
      }
      // Give cache to improve scroll experience
      endIndex = Math.min(endIndex + 1, dataLen);
      _extends(calRes, {
        scrollHeight: itemTop,
        start: startIndex,
        end: endIndex,
        offset: startOffset
      });
    }, {
      immediate: true
    });
    // =============================== In Range ===============================
    const maxScrollHeight = computed(() => calRes.scrollHeight - props.height);
    function keepInRange(newScrollTop) {
      let newTop = newScrollTop;
      if (!Number.isNaN(maxScrollHeight.value)) {
        newTop = Math.min(newTop, maxScrollHeight.value);
      }
      newTop = Math.max(newTop, 0);
      return newTop;
    }
    const isScrollAtTop = computed(() => state.scrollTop <= 0);
    const isScrollAtBottom = computed(() => state.scrollTop >= maxScrollHeight.value);
    const originScroll = useOriginScroll(isScrollAtTop, isScrollAtBottom);
    // ================================ Scroll ================================
    function onScrollBar(newScrollTop) {
      const newTop = newScrollTop;
      syncScrollTop(newTop);
    }
    // When data size reduce. It may trigger native scroll event back to fit scroll position
    function onFallbackScroll(e) {
      var _a;
      const {
        scrollTop: newScrollTop
      } = e.currentTarget;
      if (newScrollTop !== state.scrollTop) {
        syncScrollTop(newScrollTop);
      }
      // Trigger origin onScroll
      (_a = props.onScroll) === null || _a === void 0 ? void 0 : _a.call(props, e);
    }
    // Since this added in global,should use ref to keep update
    const [onRawWheel, onFireFoxScroll] = useFrameWheel(useVirtual, isScrollAtTop, isScrollAtBottom, offsetY => {
      syncScrollTop(top => {
        const newTop = top + offsetY;
        return newTop;
      });
    });
    // Mobile touch move
    useMobileTouchMove(useVirtual, componentRef, (deltaY, smoothOffset) => {
      if (originScroll(deltaY, smoothOffset)) {
        return false;
      }
      onRawWheel({
        preventDefault() {},
        deltaY
      });
      return true;
    });
    // Firefox only
    function onMozMousePixelScroll(e) {
      if (useVirtual.value) {
        e.preventDefault();
      }
    }
    const removeEventListener = () => {
      if (componentRef.value) {
        componentRef.value.removeEventListener('wheel', onRawWheel, supportsPassive ? {
          passive: false
        } : false);
        componentRef.value.removeEventListener('DOMMouseScroll', onFireFoxScroll);
        componentRef.value.removeEventListener('MozMousePixelScroll', onMozMousePixelScroll);
      }
    };
    watchEffect(() => {
      nextTick(() => {
        if (componentRef.value) {
          removeEventListener();
          componentRef.value.addEventListener('wheel', onRawWheel, supportsPassive ? {
            passive: false
          } : false);
          componentRef.value.addEventListener('DOMMouseScroll', onFireFoxScroll);
          componentRef.value.addEventListener('MozMousePixelScroll', onMozMousePixelScroll);
        }
      });
    });
    onBeforeUnmount(() => {
      removeEventListener();
    });
    // ================================= Ref ==================================
    const scrollTo = useScrollTo(componentRef, mergedData, heights, props, getKey, collectHeight, syncScrollTop, () => {
      var _a;
      (_a = scrollBarRef.value) === null || _a === void 0 ? void 0 : _a.delayHidden();
    });
    expose({
      scrollTo
    });
    const componentStyle = computed(() => {
      let cs = null;
      if (props.height) {
        cs = _extends({
          [props.fullHeight ? 'height' : 'maxHeight']: props.height + 'px'
        }, ScrollStyle);
        if (useVirtual.value) {
          cs.overflowY = 'hidden';
          if (state.scrollMoving) {
            cs.pointerEvents = 'none';
          }
        }
      }
      return cs;
    });
    // ================================ Effect ================================
    /** We need told outside that some list not rendered */
    watch([() => calRes.start, () => calRes.end, mergedData], () => {
      if (props.onVisibleChange) {
        const renderList = mergedData.value.slice(calRes.start, calRes.end + 1);
        props.onVisibleChange(renderList, mergedData.value);
      }
    }, {
      flush: 'post'
    });
    const delayHideScrollBar = () => {
      var _a;
      (_a = scrollBarRef.value) === null || _a === void 0 ? void 0 : _a.delayHidden();
    };
    return {
      state,
      mergedData,
      componentStyle,
      onFallbackScroll,
      onScrollBar,
      componentRef,
      useVirtual,
      calRes,
      collectHeight,
      setInstance,
      sharedConfig,
      scrollBarRef,
      fillerInnerRef,
      delayHideScrollBar
    };
  },
  render() {
    const _a = _extends(_extends({}, this.$props), this.$attrs),
      {
        prefixCls = 'rc-virtual-list',
        height,
        itemHeight,
        // eslint-disable-next-line no-unused-vars
        fullHeight,
        data,
        itemKey,
        virtual,
        component: Component = 'div',
        onScroll,
        children = this.$slots.default,
        style,
        class: className
      } = _a,
      restProps = __rest(_a, ["prefixCls", "height", "itemHeight", "fullHeight", "data", "itemKey", "virtual", "component", "onScroll", "children", "style", "class"]);
    const mergedClassName = classNames(prefixCls, className);
    const {
      scrollTop
    } = this.state;
    const {
      scrollHeight,
      offset,
      start,
      end
    } = this.calRes;
    const {
      componentStyle,
      onFallbackScroll,
      onScrollBar,
      useVirtual,
      collectHeight,
      sharedConfig,
      setInstance,
      mergedData,
      delayHideScrollBar
    } = this;
    return _createVNode("div", _objectSpread({
      "style": _extends(_extends({}, style), {
        position: 'relative'
      }),
      "class": mergedClassName
    }, restProps), [_createVNode(Component, {
      "class": `${prefixCls}-holder`,
      "style": componentStyle,
      "ref": "componentRef",
      "onScroll": onFallbackScroll,
      "onMouseenter": delayHideScrollBar
    }, {
      default: () => [_createVNode(Filler, {
        "prefixCls": prefixCls,
        "height": scrollHeight,
        "offset": offset,
        "onInnerResize": collectHeight,
        "ref": "fillerInnerRef"
      }, {
        default: () => renderChildren(mergedData, start, end, setInstance, children, sharedConfig)
      })]
    }), useVirtual && _createVNode(ScrollBar, {
      "ref": "scrollBarRef",
      "prefixCls": prefixCls,
      "scrollTop": scrollTop,
      "height": height,
      "scrollHeight": scrollHeight,
      "count": mergedData.length,
      "onScroll": onScrollBar,
      "onStartMove": () => {
        this.state.scrollMoving = true;
      },
      "onStopMove": () => {
        this.state.scrollMoving = false;
      }
    }, null)]);
  }
});
export default List;