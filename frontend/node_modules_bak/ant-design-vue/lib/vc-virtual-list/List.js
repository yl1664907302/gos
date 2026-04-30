"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _Filler = _interopRequireDefault(require("./Filler"));
var _Item = _interopRequireDefault(require("./Item"));
var _ScrollBar = _interopRequireDefault(require("./ScrollBar"));
var _useHeights = _interopRequireDefault(require("./hooks/useHeights"));
var _useScrollTo = _interopRequireDefault(require("./hooks/useScrollTo"));
var _useFrameWheel = _interopRequireDefault(require("./hooks/useFrameWheel"));
var _useMobileTouchMove = _interopRequireDefault(require("./hooks/useMobileTouchMove"));
var _useOriginScroll = _interopRequireDefault(require("./hooks/useOriginScroll"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _supportsPassive = _interopRequireDefault(require("../_util/supportsPassive"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
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
    return (0, _vue.createVNode)(_Item.default, {
      "key": key,
      "setRef": ele => setNodeRef(item, ele)
    }, {
      default: () => [node]
    });
  });
}
const List = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'List',
  inheritAttrs: false,
  props: {
    prefixCls: String,
    data: _vueTypes.default.array,
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
    const useVirtual = (0, _vue.computed)(() => {
      const {
        height,
        itemHeight,
        virtual
      } = props;
      return !!(virtual !== false && height && itemHeight);
    });
    const inVirtual = (0, _vue.computed)(() => {
      const {
        height,
        itemHeight,
        data
      } = props;
      return useVirtual.value && data && itemHeight * data.length > height;
    });
    const state = (0, _vue.reactive)({
      scrollTop: 0,
      scrollMoving: false
    });
    const data = (0, _vue.computed)(() => {
      return props.data || EMPTY_DATA;
    });
    const mergedData = (0, _vue.shallowRef)([]);
    (0, _vue.watch)(data, () => {
      mergedData.value = (0, _vue.toRaw)(data.value).slice();
    }, {
      immediate: true
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const itemKey = (0, _vue.shallowRef)(_item => undefined);
    (0, _vue.watch)(() => props.itemKey, val => {
      if (typeof val === 'function') {
        itemKey.value = val;
      } else {
        itemKey.value = item => item === null || item === void 0 ? void 0 : item[val];
      }
    }, {
      immediate: true
    });
    const componentRef = (0, _vue.shallowRef)();
    const fillerInnerRef = (0, _vue.shallowRef)();
    const scrollBarRef = (0, _vue.shallowRef)(); // Hack on scrollbar to enable flash call
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
    const [setInstance, collectHeight, heights, updatedMark] = (0, _useHeights.default)(mergedData, getKey, null, null);
    const calRes = (0, _vue.reactive)({
      scrollHeight: undefined,
      start: 0,
      end: 0,
      offset: undefined
    });
    const offsetHeight = (0, _vue.shallowRef)(0);
    (0, _vue.onMounted)(() => {
      (0, _vue.nextTick)(() => {
        var _a;
        offsetHeight.value = ((_a = fillerInnerRef.value) === null || _a === void 0 ? void 0 : _a.offsetHeight) || 0;
      });
    });
    (0, _vue.onUpdated)(() => {
      (0, _vue.nextTick)(() => {
        var _a;
        offsetHeight.value = ((_a = fillerInnerRef.value) === null || _a === void 0 ? void 0 : _a.offsetHeight) || 0;
      });
    });
    (0, _vue.watch)([useVirtual, mergedData], () => {
      if (!useVirtual.value) {
        (0, _extends2.default)(calRes, {
          scrollHeight: undefined,
          start: 0,
          end: mergedData.value.length - 1,
          offset: undefined
        });
      }
    }, {
      immediate: true
    });
    (0, _vue.watch)([useVirtual, mergedData, offsetHeight, inVirtual], () => {
      // Always use virtual scroll bar in avoid shaking
      if (useVirtual.value && !inVirtual.value) {
        (0, _extends2.default)(calRes, {
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
    (0, _vue.watch)([inVirtual, useVirtual, () => state.scrollTop, mergedData, updatedMark, () => props.height, offsetHeight], () => {
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
      (0, _extends2.default)(calRes, {
        scrollHeight: itemTop,
        start: startIndex,
        end: endIndex,
        offset: startOffset
      });
    }, {
      immediate: true
    });
    // =============================== In Range ===============================
    const maxScrollHeight = (0, _vue.computed)(() => calRes.scrollHeight - props.height);
    function keepInRange(newScrollTop) {
      let newTop = newScrollTop;
      if (!Number.isNaN(maxScrollHeight.value)) {
        newTop = Math.min(newTop, maxScrollHeight.value);
      }
      newTop = Math.max(newTop, 0);
      return newTop;
    }
    const isScrollAtTop = (0, _vue.computed)(() => state.scrollTop <= 0);
    const isScrollAtBottom = (0, _vue.computed)(() => state.scrollTop >= maxScrollHeight.value);
    const originScroll = (0, _useOriginScroll.default)(isScrollAtTop, isScrollAtBottom);
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
    const [onRawWheel, onFireFoxScroll] = (0, _useFrameWheel.default)(useVirtual, isScrollAtTop, isScrollAtBottom, offsetY => {
      syncScrollTop(top => {
        const newTop = top + offsetY;
        return newTop;
      });
    });
    // Mobile touch move
    (0, _useMobileTouchMove.default)(useVirtual, componentRef, (deltaY, smoothOffset) => {
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
        componentRef.value.removeEventListener('wheel', onRawWheel, _supportsPassive.default ? {
          passive: false
        } : false);
        componentRef.value.removeEventListener('DOMMouseScroll', onFireFoxScroll);
        componentRef.value.removeEventListener('MozMousePixelScroll', onMozMousePixelScroll);
      }
    };
    (0, _vue.watchEffect)(() => {
      (0, _vue.nextTick)(() => {
        if (componentRef.value) {
          removeEventListener();
          componentRef.value.addEventListener('wheel', onRawWheel, _supportsPassive.default ? {
            passive: false
          } : false);
          componentRef.value.addEventListener('DOMMouseScroll', onFireFoxScroll);
          componentRef.value.addEventListener('MozMousePixelScroll', onMozMousePixelScroll);
        }
      });
    });
    (0, _vue.onBeforeUnmount)(() => {
      removeEventListener();
    });
    // ================================= Ref ==================================
    const scrollTo = (0, _useScrollTo.default)(componentRef, mergedData, heights, props, getKey, collectHeight, syncScrollTop, () => {
      var _a;
      (_a = scrollBarRef.value) === null || _a === void 0 ? void 0 : _a.delayHidden();
    });
    expose({
      scrollTo
    });
    const componentStyle = (0, _vue.computed)(() => {
      let cs = null;
      if (props.height) {
        cs = (0, _extends2.default)({
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
    (0, _vue.watch)([() => calRes.start, () => calRes.end, mergedData], () => {
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
    const _a = (0, _extends2.default)((0, _extends2.default)({}, this.$props), this.$attrs),
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
    const mergedClassName = (0, _classNames.default)(prefixCls, className);
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
    return (0, _vue.createVNode)("div", (0, _objectSpread2.default)({
      "style": (0, _extends2.default)((0, _extends2.default)({}, style), {
        position: 'relative'
      }),
      "class": mergedClassName
    }, restProps), [(0, _vue.createVNode)(Component, {
      "class": `${prefixCls}-holder`,
      "style": componentStyle,
      "ref": "componentRef",
      "onScroll": onFallbackScroll,
      "onMouseenter": delayHideScrollBar
    }, {
      default: () => [(0, _vue.createVNode)(_Filler.default, {
        "prefixCls": prefixCls,
        "height": scrollHeight,
        "offset": offset,
        "onInnerResize": collectHeight,
        "ref": "fillerInnerRef"
      }, {
        default: () => renderChildren(mergedData, start, end, setInstance, children, sharedConfig)
      })]
    }), useVirtual && (0, _vue.createVNode)(_ScrollBar.default, {
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
var _default = exports.default = List;