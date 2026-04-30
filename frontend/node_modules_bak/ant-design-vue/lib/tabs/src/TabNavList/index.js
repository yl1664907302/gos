"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tabNavListProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _useRaf = require("../hooks/useRaf");
var _TabNode = _interopRequireDefault(require("./TabNode"));
var _useOffsets = _interopRequireDefault(require("../hooks/useOffsets"));
var _OperationNode = _interopRequireDefault(require("./OperationNode"));
var _TabContext = require("../TabContext");
var _useTouchMove = _interopRequireDefault(require("../hooks/useTouchMove"));
var _AddButton = _interopRequireDefault(require("./AddButton"));
var _type = require("../../../_util/type");
var _vueTypes = _interopRequireDefault(require("../../../_util/vue-types"));
var _useSyncState = _interopRequireDefault(require("../hooks/useSyncState"));
var _useState = _interopRequireDefault(require("../../../_util/hooks/useState"));
var _raf = _interopRequireDefault(require("../../../_util/raf"));
var _classNames = _interopRequireDefault(require("../../../_util/classNames"));
var _vcResizeObserver = _interopRequireDefault(require("../../../vc-resize-observer"));
var _util = require("../../../_util/util");
var _useRefs = _interopRequireDefault(require("../../../_util/hooks/useRefs"));
var _pick = _interopRequireDefault(require("lodash/pick"));
const DEFAULT_SIZE = {
  width: 0,
  height: 0,
  left: 0,
  top: 0,
  right: 0
};
const tabNavListProps = () => {
  return {
    id: {
      type: String
    },
    tabPosition: {
      type: String
    },
    activeKey: {
      type: [String, Number]
    },
    rtl: {
      type: Boolean
    },
    animated: (0, _type.objectType)(),
    editable: (0, _type.objectType)(),
    moreIcon: _vueTypes.default.any,
    moreTransitionName: {
      type: String
    },
    mobile: {
      type: Boolean
    },
    tabBarGutter: {
      type: Number
    },
    renderTabBar: {
      type: Function
    },
    locale: (0, _type.objectType)(),
    popupClassName: String,
    getPopupContainer: (0, _type.functionType)(),
    onTabClick: {
      type: Function
    },
    onTabScroll: {
      type: Function
    }
  };
};
exports.tabNavListProps = tabNavListProps;
const getTabSize = (tab, containerRect) => {
  // tabListRef
  const {
    offsetWidth,
    offsetHeight,
    offsetTop,
    offsetLeft
  } = tab;
  const {
    width,
    height,
    x,
    y
  } = tab.getBoundingClientRect();
  // Use getBoundingClientRect to avoid decimal inaccuracy
  if (Math.abs(width - offsetWidth) < 1) {
    return [width, height, x - containerRect.x, y - containerRect.y];
  }
  return [offsetWidth, offsetHeight, offsetLeft, offsetTop];
};
// const getSize = (refObj: ShallowRef<HTMLElement>) => {
//   const { offsetWidth = 0, offsetHeight = 0 } = refObj.value || {};
//   // Use getBoundingClientRect to avoid decimal inaccuracy
//   if (refObj.value) {
//     const { width, height } = refObj.value.getBoundingClientRect();
//     if (Math.abs(width - offsetWidth) < 1) {
//       return [width, height];
//     }
//   }
//   return [offsetWidth, offsetHeight];
// };
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'TabNavList',
  inheritAttrs: false,
  props: tabNavListProps(),
  slots: Object,
  emits: ['tabClick', 'tabScroll'],
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const {
      tabs,
      prefixCls
    } = (0, _TabContext.useInjectTabs)();
    const tabsWrapperRef = (0, _vue.shallowRef)();
    const tabListRef = (0, _vue.shallowRef)();
    const operationsRef = (0, _vue.shallowRef)();
    const innerAddButtonRef = (0, _vue.shallowRef)();
    const [setRef, btnRefs] = (0, _useRefs.default)();
    const tabPositionTopOrBottom = (0, _vue.computed)(() => props.tabPosition === 'top' || props.tabPosition === 'bottom');
    const [transformLeft, setTransformLeft] = (0, _useSyncState.default)(0, (next, prev) => {
      if (tabPositionTopOrBottom.value && props.onTabScroll) {
        props.onTabScroll({
          direction: next > prev ? 'left' : 'right'
        });
      }
    });
    const [transformTop, setTransformTop] = (0, _useSyncState.default)(0, (next, prev) => {
      if (!tabPositionTopOrBottom.value && props.onTabScroll) {
        props.onTabScroll({
          direction: next > prev ? 'top' : 'bottom'
        });
      }
    });
    const [wrapperScrollWidth, setWrapperScrollWidth] = (0, _useState.default)(0);
    const [wrapperScrollHeight, setWrapperScrollHeight] = (0, _useState.default)(0);
    const [wrapperWidth, setWrapperWidth] = (0, _useState.default)(null);
    const [wrapperHeight, setWrapperHeight] = (0, _useState.default)(null);
    const [addWidth, setAddWidth] = (0, _useState.default)(0);
    const [addHeight, setAddHeight] = (0, _useState.default)(0);
    const [tabSizes, setTabSizes] = (0, _useRaf.useRafState)(new Map());
    const tabOffsets = (0, _useOffsets.default)(tabs, tabSizes);
    // ========================== Util =========================
    const operationsHiddenClassName = (0, _vue.computed)(() => `${prefixCls.value}-nav-operations-hidden`);
    const transformMin = (0, _vue.shallowRef)(0);
    const transformMax = (0, _vue.shallowRef)(0);
    (0, _vue.watchEffect)(() => {
      if (!tabPositionTopOrBottom.value) {
        transformMin.value = Math.min(0, wrapperHeight.value - wrapperScrollHeight.value);
        transformMax.value = 0;
      } else if (props.rtl) {
        transformMin.value = 0;
        transformMax.value = Math.max(0, wrapperScrollWidth.value - wrapperWidth.value);
      } else {
        transformMin.value = Math.min(0, wrapperWidth.value - wrapperScrollWidth.value);
        transformMax.value = 0;
      }
    });
    const alignInRange = value => {
      if (value < transformMin.value) {
        return transformMin.value;
      }
      if (value > transformMax.value) {
        return transformMax.value;
      }
      return value;
    };
    // ========================= Mobile ========================
    const touchMovingRef = (0, _vue.shallowRef)();
    const [lockAnimation, setLockAnimation] = (0, _useState.default)();
    const doLockAnimation = () => {
      setLockAnimation(Date.now());
    };
    const clearTouchMoving = () => {
      clearTimeout(touchMovingRef.value);
    };
    const doMove = (setState, offset) => {
      setState(value => {
        const newValue = alignInRange(value + offset);
        return newValue;
      });
    };
    (0, _useTouchMove.default)(tabsWrapperRef, (offsetX, offsetY) => {
      if (tabPositionTopOrBottom.value) {
        // Skip scroll if place is enough
        if (wrapperWidth.value >= wrapperScrollWidth.value) {
          return false;
        }
        doMove(setTransformLeft, offsetX);
      } else {
        if (wrapperHeight.value >= wrapperScrollHeight.value) {
          return false;
        }
        doMove(setTransformTop, offsetY);
      }
      clearTouchMoving();
      doLockAnimation();
      return true;
    });
    (0, _vue.watch)(lockAnimation, () => {
      clearTouchMoving();
      if (lockAnimation.value) {
        touchMovingRef.value = setTimeout(() => {
          setLockAnimation(0);
        }, 100);
      }
    });
    // ========================= Scroll ========================
    const scrollToTab = function () {
      let key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : props.activeKey;
      const tabOffset = tabOffsets.value.get(key) || {
        width: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0
      };
      if (tabPositionTopOrBottom.value) {
        // ============ Align with top & bottom ============
        let newTransform = transformLeft.value;
        // RTL
        if (props.rtl) {
          if (tabOffset.right < transformLeft.value) {
            newTransform = tabOffset.right;
          } else if (tabOffset.right + tabOffset.width > transformLeft.value + wrapperWidth.value) {
            newTransform = tabOffset.right + tabOffset.width - wrapperWidth.value;
          }
        }
        // LTR
        else if (tabOffset.left < -transformLeft.value) {
          newTransform = -tabOffset.left;
        } else if (tabOffset.left + tabOffset.width > -transformLeft.value + wrapperWidth.value) {
          newTransform = -(tabOffset.left + tabOffset.width - wrapperWidth.value);
        }
        setTransformTop(0);
        setTransformLeft(alignInRange(newTransform));
      } else {
        // ============ Align with left & right ============
        let newTransform = transformTop.value;
        if (tabOffset.top < -transformTop.value) {
          newTransform = -tabOffset.top;
        } else if (tabOffset.top + tabOffset.height > -transformTop.value + wrapperHeight.value) {
          newTransform = -(tabOffset.top + tabOffset.height - wrapperHeight.value);
        }
        setTransformLeft(0);
        setTransformTop(alignInRange(newTransform));
      }
    };
    const visibleStart = (0, _vue.shallowRef)(0);
    const visibleEnd = (0, _vue.shallowRef)(0);
    (0, _vue.watchEffect)(() => {
      let unit;
      let position;
      let transformSize;
      let basicSize;
      let tabContentSize;
      let addSize;
      const tabOffsetsValue = tabOffsets.value;
      if (['top', 'bottom'].includes(props.tabPosition)) {
        unit = 'width';
        basicSize = wrapperWidth.value;
        tabContentSize = wrapperScrollWidth.value;
        addSize = addWidth.value;
        position = props.rtl ? 'right' : 'left';
        transformSize = Math.abs(transformLeft.value);
      } else {
        unit = 'height';
        basicSize = wrapperHeight.value;
        tabContentSize = wrapperScrollWidth.value;
        addSize = addHeight.value;
        position = 'top';
        transformSize = -transformTop.value;
      }
      let mergedBasicSize = basicSize;
      if (tabContentSize + addSize > basicSize && tabContentSize < basicSize) {
        mergedBasicSize = basicSize - addSize;
      }
      const tabsVal = tabs.value;
      if (!tabsVal.length) {
        return [visibleStart.value, visibleEnd.value] = [0, 0];
      }
      const len = tabsVal.length;
      let endIndex = len;
      for (let i = 0; i < len; i += 1) {
        const offset = tabOffsetsValue.get(tabsVal[i].key) || DEFAULT_SIZE;
        if (offset[position] + offset[unit] > transformSize + mergedBasicSize) {
          endIndex = i - 1;
          break;
        }
      }
      let startIndex = 0;
      for (let i = len - 1; i >= 0; i -= 1) {
        const offset = tabOffsetsValue.get(tabsVal[i].key) || DEFAULT_SIZE;
        if (offset[position] < transformSize) {
          startIndex = i + 1;
          break;
        }
      }
      return [visibleStart.value, visibleEnd.value] = [startIndex, endIndex];
    });
    const updateTabSizes = () => {
      setTabSizes(() => {
        var _a;
        const newSizes = new Map();
        const listRect = (_a = tabListRef.value) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
        tabs.value.forEach(_ref2 => {
          let {
            key
          } = _ref2;
          const btnRef = btnRefs.value.get(key);
          const btnNode = (btnRef === null || btnRef === void 0 ? void 0 : btnRef.$el) || btnRef;
          if (btnNode) {
            const [width, height, left, top] = getTabSize(btnNode, listRect);
            newSizes.set(key, {
              width,
              height,
              left,
              top
            });
          }
        });
        return newSizes;
      });
    };
    (0, _vue.watch)(() => tabs.value.map(tab => tab.key).join('%%'), () => {
      updateTabSizes();
    }, {
      flush: 'post'
    });
    const onListHolderResize = () => {
      var _a, _b, _c, _d, _e;
      // Update wrapper records
      const offsetWidth = ((_a = tabsWrapperRef.value) === null || _a === void 0 ? void 0 : _a.offsetWidth) || 0;
      const offsetHeight = ((_b = tabsWrapperRef.value) === null || _b === void 0 ? void 0 : _b.offsetHeight) || 0;
      const addDom = ((_c = innerAddButtonRef.value) === null || _c === void 0 ? void 0 : _c.$el) || {};
      const newAddWidth = addDom.offsetWidth || 0;
      const newAddHeight = addDom.offsetHeight || 0;
      setWrapperWidth(offsetWidth);
      setWrapperHeight(offsetHeight);
      setAddWidth(newAddWidth);
      setAddHeight(newAddHeight);
      const newWrapperScrollWidth = (((_d = tabListRef.value) === null || _d === void 0 ? void 0 : _d.offsetWidth) || 0) - newAddWidth;
      const newWrapperScrollHeight = (((_e = tabListRef.value) === null || _e === void 0 ? void 0 : _e.offsetHeight) || 0) - newAddHeight;
      setWrapperScrollWidth(newWrapperScrollWidth);
      setWrapperScrollHeight(newWrapperScrollHeight);
      // Update buttons records
      updateTabSizes();
    };
    // ======================== Dropdown =======================
    const hiddenTabs = (0, _vue.computed)(() => [...tabs.value.slice(0, visibleStart.value), ...tabs.value.slice(visibleEnd.value + 1)]);
    // =================== Link & Operations ===================
    const [inkStyle, setInkStyle] = (0, _useState.default)();
    const activeTabOffset = (0, _vue.computed)(() => tabOffsets.value.get(props.activeKey));
    // Delay set ink style to avoid remove tab blink
    const inkBarRafRef = (0, _vue.shallowRef)();
    const cleanInkBarRaf = () => {
      _raf.default.cancel(inkBarRafRef.value);
    };
    (0, _vue.watch)([activeTabOffset, tabPositionTopOrBottom, () => props.rtl], () => {
      const newInkStyle = {};
      if (activeTabOffset.value) {
        if (tabPositionTopOrBottom.value) {
          if (props.rtl) {
            newInkStyle.right = (0, _util.toPx)(activeTabOffset.value.right);
          } else {
            newInkStyle.left = (0, _util.toPx)(activeTabOffset.value.left);
          }
          newInkStyle.width = (0, _util.toPx)(activeTabOffset.value.width);
        } else {
          newInkStyle.top = (0, _util.toPx)(activeTabOffset.value.top);
          newInkStyle.height = (0, _util.toPx)(activeTabOffset.value.height);
        }
      }
      cleanInkBarRaf();
      inkBarRafRef.value = (0, _raf.default)(() => {
        setInkStyle(newInkStyle);
      });
    });
    (0, _vue.watch)([() => props.activeKey, activeTabOffset, tabOffsets, tabPositionTopOrBottom], () => {
      scrollToTab();
    }, {
      flush: 'post'
    });
    (0, _vue.watch)([() => props.rtl, () => props.tabBarGutter, () => props.activeKey, () => tabs.value], () => {
      onListHolderResize();
    }, {
      flush: 'post'
    });
    const ExtraContent = _ref3 => {
      let {
        position,
        prefixCls,
        extra
      } = _ref3;
      if (!extra) return null;
      const content = extra === null || extra === void 0 ? void 0 : extra({
        position
      });
      return content ? (0, _vue.createVNode)("div", {
        "class": `${prefixCls}-extra-content`
      }, [content]) : null;
    };
    (0, _vue.onBeforeUnmount)(() => {
      clearTouchMoving();
      cleanInkBarRaf();
    });
    return () => {
      const {
        id,
        animated,
        activeKey,
        rtl,
        editable,
        locale,
        tabPosition,
        tabBarGutter,
        onTabClick
      } = props;
      const {
        class: className,
        style
      } = attrs;
      const pre = prefixCls.value;
      // ========================= Render ========================
      const hasDropdown = !!hiddenTabs.value.length;
      const wrapPrefix = `${pre}-nav-wrap`;
      let pingLeft;
      let pingRight;
      let pingTop;
      let pingBottom;
      if (tabPositionTopOrBottom.value) {
        if (rtl) {
          pingRight = transformLeft.value > 0;
          pingLeft = transformLeft.value + wrapperWidth.value < wrapperScrollWidth.value;
        } else {
          pingLeft = transformLeft.value < 0;
          pingRight = -transformLeft.value + wrapperWidth.value < wrapperScrollWidth.value;
        }
      } else {
        pingTop = transformTop.value < 0;
        pingBottom = -transformTop.value + wrapperHeight.value < wrapperScrollHeight.value;
      }
      const tabNodeStyle = {};
      if (tabPosition === 'top' || tabPosition === 'bottom') {
        tabNodeStyle[rtl ? 'marginRight' : 'marginLeft'] = typeof tabBarGutter === 'number' ? `${tabBarGutter}px` : tabBarGutter;
      } else {
        tabNodeStyle.marginTop = typeof tabBarGutter === 'number' ? `${tabBarGutter}px` : tabBarGutter;
      }
      const tabNodes = tabs.value.map((tab, i) => {
        const {
          key
        } = tab;
        return (0, _vue.createVNode)(_TabNode.default, {
          "id": id,
          "prefixCls": pre,
          "key": key,
          "tab": tab,
          "style": i === 0 ? undefined : tabNodeStyle,
          "closable": tab.closable,
          "editable": editable,
          "active": key === activeKey,
          "removeAriaLabel": locale === null || locale === void 0 ? void 0 : locale.removeAriaLabel,
          "ref": setRef(key),
          "onClick": e => {
            onTabClick(key, e);
          },
          "onFocus": () => {
            scrollToTab(key);
            doLockAnimation();
            if (!tabsWrapperRef.value) {
              return;
            }
            // Focus element will make scrollLeft change which we should reset back
            if (!rtl) {
              tabsWrapperRef.value.scrollLeft = 0;
            }
            tabsWrapperRef.value.scrollTop = 0;
          }
        }, slots);
      });
      return (0, _vue.createVNode)("div", {
        "role": "tablist",
        "class": (0, _classNames.default)(`${pre}-nav`, className),
        "style": style,
        "onKeydown": () => {
          // No need animation when use keyboard
          doLockAnimation();
        }
      }, [(0, _vue.createVNode)(ExtraContent, {
        "position": "left",
        "prefixCls": pre,
        "extra": slots.leftExtra
      }, null), (0, _vue.createVNode)(_vcResizeObserver.default, {
        "onResize": onListHolderResize
      }, {
        default: () => [(0, _vue.createVNode)("div", {
          "class": (0, _classNames.default)(wrapPrefix, {
            [`${wrapPrefix}-ping-left`]: pingLeft,
            [`${wrapPrefix}-ping-right`]: pingRight,
            [`${wrapPrefix}-ping-top`]: pingTop,
            [`${wrapPrefix}-ping-bottom`]: pingBottom
          }),
          "ref": tabsWrapperRef
        }, [(0, _vue.createVNode)(_vcResizeObserver.default, {
          "onResize": onListHolderResize
        }, {
          default: () => [(0, _vue.createVNode)("div", {
            "ref": tabListRef,
            "class": `${pre}-nav-list`,
            "style": {
              transform: `translate(${transformLeft.value}px, ${transformTop.value}px)`,
              transition: lockAnimation.value ? 'none' : undefined
            }
          }, [tabNodes, (0, _vue.createVNode)(_AddButton.default, {
            "ref": innerAddButtonRef,
            "prefixCls": pre,
            "locale": locale,
            "editable": editable,
            "style": (0, _extends2.default)((0, _extends2.default)({}, tabNodes.length === 0 ? undefined : tabNodeStyle), {
              visibility: hasDropdown ? 'hidden' : null
            })
          }, null), (0, _vue.createVNode)("div", {
            "class": (0, _classNames.default)(`${pre}-ink-bar`, {
              [`${pre}-ink-bar-animated`]: animated.inkBar
            }),
            "style": inkStyle.value
          }, null)])]
        })])]
      }), (0, _vue.createVNode)(_OperationNode.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), {}, {
        "removeAriaLabel": locale === null || locale === void 0 ? void 0 : locale.removeAriaLabel,
        "ref": operationsRef,
        "prefixCls": pre,
        "tabs": hiddenTabs.value,
        "class": !hasDropdown && operationsHiddenClassName.value
      }), (0, _pick.default)(slots, ['moreIcon'])), (0, _vue.createVNode)(ExtraContent, {
        "position": "right",
        "prefixCls": pre,
        "extra": slots.rightExtra
      }, null), (0, _vue.createVNode)(ExtraContent, {
        "position": "right",
        "prefixCls": pre,
        "extra": slots.tabBarExtraContent
      }, null)]);
    };
  }
});