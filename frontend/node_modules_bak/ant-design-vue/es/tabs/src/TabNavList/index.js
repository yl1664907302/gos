import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
import { useRafState } from '../hooks/useRaf';
import TabNode from './TabNode';
import useOffsets from '../hooks/useOffsets';
import OperationNode from './OperationNode';
import { useInjectTabs } from '../TabContext';
import useTouchMove from '../hooks/useTouchMove';
import AddButton from './AddButton';
import { objectType, functionType } from '../../../_util/type';
import { shallowRef, onBeforeUnmount, defineComponent, watch, watchEffect, computed } from 'vue';
import PropTypes from '../../../_util/vue-types';
import useSyncState from '../hooks/useSyncState';
import useState from '../../../_util/hooks/useState';
import raf from '../../../_util/raf';
import classNames from '../../../_util/classNames';
import ResizeObserver from '../../../vc-resize-observer';
import { toPx } from '../../../_util/util';
import useRefs from '../../../_util/hooks/useRefs';
import pick from 'lodash-es/pick';
const DEFAULT_SIZE = {
  width: 0,
  height: 0,
  left: 0,
  top: 0,
  right: 0
};
export const tabNavListProps = () => {
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
    animated: objectType(),
    editable: objectType(),
    moreIcon: PropTypes.any,
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
    locale: objectType(),
    popupClassName: String,
    getPopupContainer: functionType(),
    onTabClick: {
      type: Function
    },
    onTabScroll: {
      type: Function
    }
  };
};
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
export default defineComponent({
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
    } = useInjectTabs();
    const tabsWrapperRef = shallowRef();
    const tabListRef = shallowRef();
    const operationsRef = shallowRef();
    const innerAddButtonRef = shallowRef();
    const [setRef, btnRefs] = useRefs();
    const tabPositionTopOrBottom = computed(() => props.tabPosition === 'top' || props.tabPosition === 'bottom');
    const [transformLeft, setTransformLeft] = useSyncState(0, (next, prev) => {
      if (tabPositionTopOrBottom.value && props.onTabScroll) {
        props.onTabScroll({
          direction: next > prev ? 'left' : 'right'
        });
      }
    });
    const [transformTop, setTransformTop] = useSyncState(0, (next, prev) => {
      if (!tabPositionTopOrBottom.value && props.onTabScroll) {
        props.onTabScroll({
          direction: next > prev ? 'top' : 'bottom'
        });
      }
    });
    const [wrapperScrollWidth, setWrapperScrollWidth] = useState(0);
    const [wrapperScrollHeight, setWrapperScrollHeight] = useState(0);
    const [wrapperWidth, setWrapperWidth] = useState(null);
    const [wrapperHeight, setWrapperHeight] = useState(null);
    const [addWidth, setAddWidth] = useState(0);
    const [addHeight, setAddHeight] = useState(0);
    const [tabSizes, setTabSizes] = useRafState(new Map());
    const tabOffsets = useOffsets(tabs, tabSizes);
    // ========================== Util =========================
    const operationsHiddenClassName = computed(() => `${prefixCls.value}-nav-operations-hidden`);
    const transformMin = shallowRef(0);
    const transformMax = shallowRef(0);
    watchEffect(() => {
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
    const touchMovingRef = shallowRef();
    const [lockAnimation, setLockAnimation] = useState();
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
    useTouchMove(tabsWrapperRef, (offsetX, offsetY) => {
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
    watch(lockAnimation, () => {
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
    const visibleStart = shallowRef(0);
    const visibleEnd = shallowRef(0);
    watchEffect(() => {
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
    watch(() => tabs.value.map(tab => tab.key).join('%%'), () => {
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
    const hiddenTabs = computed(() => [...tabs.value.slice(0, visibleStart.value), ...tabs.value.slice(visibleEnd.value + 1)]);
    // =================== Link & Operations ===================
    const [inkStyle, setInkStyle] = useState();
    const activeTabOffset = computed(() => tabOffsets.value.get(props.activeKey));
    // Delay set ink style to avoid remove tab blink
    const inkBarRafRef = shallowRef();
    const cleanInkBarRaf = () => {
      raf.cancel(inkBarRafRef.value);
    };
    watch([activeTabOffset, tabPositionTopOrBottom, () => props.rtl], () => {
      const newInkStyle = {};
      if (activeTabOffset.value) {
        if (tabPositionTopOrBottom.value) {
          if (props.rtl) {
            newInkStyle.right = toPx(activeTabOffset.value.right);
          } else {
            newInkStyle.left = toPx(activeTabOffset.value.left);
          }
          newInkStyle.width = toPx(activeTabOffset.value.width);
        } else {
          newInkStyle.top = toPx(activeTabOffset.value.top);
          newInkStyle.height = toPx(activeTabOffset.value.height);
        }
      }
      cleanInkBarRaf();
      inkBarRafRef.value = raf(() => {
        setInkStyle(newInkStyle);
      });
    });
    watch([() => props.activeKey, activeTabOffset, tabOffsets, tabPositionTopOrBottom], () => {
      scrollToTab();
    }, {
      flush: 'post'
    });
    watch([() => props.rtl, () => props.tabBarGutter, () => props.activeKey, () => tabs.value], () => {
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
      return content ? _createVNode("div", {
        "class": `${prefixCls}-extra-content`
      }, [content]) : null;
    };
    onBeforeUnmount(() => {
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
        return _createVNode(TabNode, {
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
      return _createVNode("div", {
        "role": "tablist",
        "class": classNames(`${pre}-nav`, className),
        "style": style,
        "onKeydown": () => {
          // No need animation when use keyboard
          doLockAnimation();
        }
      }, [_createVNode(ExtraContent, {
        "position": "left",
        "prefixCls": pre,
        "extra": slots.leftExtra
      }, null), _createVNode(ResizeObserver, {
        "onResize": onListHolderResize
      }, {
        default: () => [_createVNode("div", {
          "class": classNames(wrapPrefix, {
            [`${wrapPrefix}-ping-left`]: pingLeft,
            [`${wrapPrefix}-ping-right`]: pingRight,
            [`${wrapPrefix}-ping-top`]: pingTop,
            [`${wrapPrefix}-ping-bottom`]: pingBottom
          }),
          "ref": tabsWrapperRef
        }, [_createVNode(ResizeObserver, {
          "onResize": onListHolderResize
        }, {
          default: () => [_createVNode("div", {
            "ref": tabListRef,
            "class": `${pre}-nav-list`,
            "style": {
              transform: `translate(${transformLeft.value}px, ${transformTop.value}px)`,
              transition: lockAnimation.value ? 'none' : undefined
            }
          }, [tabNodes, _createVNode(AddButton, {
            "ref": innerAddButtonRef,
            "prefixCls": pre,
            "locale": locale,
            "editable": editable,
            "style": _extends(_extends({}, tabNodes.length === 0 ? undefined : tabNodeStyle), {
              visibility: hasDropdown ? 'hidden' : null
            })
          }, null), _createVNode("div", {
            "class": classNames(`${pre}-ink-bar`, {
              [`${pre}-ink-bar-animated`]: animated.inkBar
            }),
            "style": inkStyle.value
          }, null)])]
        })])]
      }), _createVNode(OperationNode, _objectSpread(_objectSpread({}, props), {}, {
        "removeAriaLabel": locale === null || locale === void 0 ? void 0 : locale.removeAriaLabel,
        "ref": operationsRef,
        "prefixCls": pre,
        "tabs": hiddenTabs.value,
        "class": !hasDropdown && operationsHiddenClassName.value
      }), pick(slots, ['moreIcon'])), _createVNode(ExtraContent, {
        "position": "right",
        "prefixCls": pre,
        "extra": slots.rightExtra
      }, null), _createVNode(ExtraContent, {
        "position": "right",
        "prefixCls": pre,
        "extra": slots.tabBarExtraContent
      }, null)]);
    };
  }
});