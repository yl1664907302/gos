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
import { computed, defineComponent, shallowRef, watch } from 'vue';
import ResizeObserver from '../vc-resize-observer';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import { OverflowContextProvider } from './context';
import Item from './Item';
import RawItem from './RawItem';
const RESPONSIVE = 'responsive';
const INVALIDATE = 'invalidate';
function defaultRenderRest(omittedItems) {
  return `+ ${omittedItems.length} ...`;
}
const overflowProps = () => {
  return {
    id: String,
    prefixCls: String,
    data: Array,
    itemKey: [String, Number, Function],
    /** Used for `responsive`. It will limit render node to avoid perf issue */
    itemWidth: {
      type: Number,
      default: 10
    },
    renderItem: Function,
    /** @private Do not use in your production. Render raw node that need wrap Item by developer self */
    renderRawItem: Function,
    maxCount: [Number, String],
    renderRest: Function,
    /** @private Do not use in your production. Render raw node that need wrap Item by developer self */
    renderRawRest: Function,
    suffix: PropTypes.any,
    component: String,
    itemComponent: PropTypes.any,
    /** @private This API may be refactor since not well design */
    onVisibleChange: Function,
    /** When set to `full`, ssr will render full items by default and remove at client side */
    ssr: String,
    onMousedown: Function,
    role: String
  };
};
const Overflow = defineComponent({
  name: 'Overflow',
  inheritAttrs: false,
  props: overflowProps(),
  emits: ['visibleChange'],
  setup(props, _ref) {
    let {
      attrs,
      emit,
      slots
    } = _ref;
    const fullySSR = computed(() => props.ssr === 'full');
    const containerWidth = shallowRef(null);
    const mergedContainerWidth = computed(() => containerWidth.value || 0);
    const itemWidths = shallowRef(new Map());
    const prevRestWidth = shallowRef(0);
    const restWidth = shallowRef(0);
    const suffixWidth = shallowRef(0);
    const suffixFixedStart = shallowRef(null);
    const displayCount = shallowRef(null);
    const mergedDisplayCount = computed(() => {
      if (displayCount.value === null && fullySSR.value) {
        return Number.MAX_SAFE_INTEGER;
      }
      return displayCount.value || 0;
    });
    const restReady = shallowRef(false);
    const itemPrefixCls = computed(() => `${props.prefixCls}-item`);
    // Always use the max width to avoid blink
    const mergedRestWidth = computed(() => Math.max(prevRestWidth.value, restWidth.value));
    // ================================= Data =================================
    const isResponsive = computed(() => !!(props.data.length && props.maxCount === RESPONSIVE));
    const invalidate = computed(() => props.maxCount === INVALIDATE);
    /**
     * When is `responsive`, we will always render rest node to get the real width of it for calculation
     */
    const showRest = computed(() => isResponsive.value || typeof props.maxCount === 'number' && props.data.length > props.maxCount);
    const mergedData = computed(() => {
      let items = props.data;
      if (isResponsive.value) {
        if (containerWidth.value === null && fullySSR.value) {
          items = props.data;
        } else {
          items = props.data.slice(0, Math.min(props.data.length, mergedContainerWidth.value / props.itemWidth));
        }
      } else if (typeof props.maxCount === 'number') {
        items = props.data.slice(0, props.maxCount);
      }
      return items;
    });
    const omittedItems = computed(() => {
      if (isResponsive.value) {
        return props.data.slice(mergedDisplayCount.value + 1);
      }
      return props.data.slice(mergedData.value.length);
    });
    // ================================= Item =================================
    const getKey = (item, index) => {
      var _a;
      if (typeof props.itemKey === 'function') {
        return props.itemKey(item);
      }
      return (_a = props.itemKey && (item === null || item === void 0 ? void 0 : item[props.itemKey])) !== null && _a !== void 0 ? _a : index;
    };
    const mergedRenderItem = computed(() => props.renderItem || (item => item));
    const updateDisplayCount = (count, notReady) => {
      displayCount.value = count;
      if (!notReady) {
        restReady.value = count < props.data.length - 1;
        emit('visibleChange', count);
      }
    };
    // ================================= Size =================================
    const onOverflowResize = (_, element) => {
      containerWidth.value = element.clientWidth;
    };
    const registerSize = (key, width) => {
      const clone = new Map(itemWidths.value);
      if (width === null) {
        clone.delete(key);
      } else {
        clone.set(key, width);
      }
      itemWidths.value = clone;
    };
    const registerOverflowSize = (_, width) => {
      prevRestWidth.value = restWidth.value;
      restWidth.value = width;
    };
    const registerSuffixSize = (_, width) => {
      suffixWidth.value = width;
    };
    // ================================ Effect ================================
    const getItemWidth = index => {
      return itemWidths.value.get(getKey(mergedData.value[index], index));
    };
    watch([mergedContainerWidth, itemWidths, restWidth, suffixWidth, () => props.itemKey, mergedData], () => {
      if (mergedContainerWidth.value && mergedRestWidth.value && mergedData.value) {
        let totalWidth = suffixWidth.value;
        const len = mergedData.value.length;
        const lastIndex = len - 1;
        // When data count change to 0, reset this since not loop will reach
        if (!len) {
          updateDisplayCount(0);
          suffixFixedStart.value = null;
          return;
        }
        for (let i = 0; i < len; i += 1) {
          const currentItemWidth = getItemWidth(i);
          // Break since data not ready
          if (currentItemWidth === undefined) {
            updateDisplayCount(i - 1, true);
            break;
          }
          // Find best match
          totalWidth += currentItemWidth;
          if (
          // Only one means `totalWidth` is the final width
          lastIndex === 0 && totalWidth <= mergedContainerWidth.value ||
          // Last two width will be the final width
          i === lastIndex - 1 && totalWidth + getItemWidth(lastIndex) <= mergedContainerWidth.value) {
            // Additional check if match the end
            updateDisplayCount(lastIndex);
            suffixFixedStart.value = null;
            break;
          } else if (totalWidth + mergedRestWidth.value > mergedContainerWidth.value) {
            // Can not hold all the content to show rest
            updateDisplayCount(i - 1);
            suffixFixedStart.value = totalWidth - currentItemWidth - suffixWidth.value + restWidth.value;
            break;
          }
        }
        if (props.suffix && getItemWidth(0) + suffixWidth.value > mergedContainerWidth.value) {
          suffixFixedStart.value = null;
        }
      }
    });
    return () => {
      // ================================ Render ================================
      const displayRest = restReady.value && !!omittedItems.value.length;
      const {
        itemComponent,
        renderRawItem,
        renderRawRest,
        renderRest,
        prefixCls = 'rc-overflow',
        suffix,
        component: Component = 'div',
        id,
        onMousedown
      } = props;
      const {
          class: className,
          style
        } = attrs,
        restAttrs = __rest(attrs, ["class", "style"]);
      let suffixStyle = {};
      if (suffixFixedStart.value !== null && isResponsive.value) {
        suffixStyle = {
          position: 'absolute',
          left: `${suffixFixedStart.value}px`,
          top: 0
        };
      }
      const itemSharedProps = {
        prefixCls: itemPrefixCls.value,
        responsive: isResponsive.value,
        component: itemComponent,
        invalidate: invalidate.value
      };
      // >>>>> Choice render fun by `renderRawItem`
      const internalRenderItemNode = renderRawItem ? (item, index) => {
        const key = getKey(item, index);
        return _createVNode(OverflowContextProvider, {
          "key": key,
          "value": _extends(_extends({}, itemSharedProps), {
            order: index,
            item,
            itemKey: key,
            registerSize,
            display: index <= mergedDisplayCount.value
          })
        }, {
          default: () => [renderRawItem(item, index)]
        });
      } : (item, index) => {
        const key = getKey(item, index);
        return _createVNode(Item, _objectSpread(_objectSpread({}, itemSharedProps), {}, {
          "order": index,
          "key": key,
          "item": item,
          "renderItem": mergedRenderItem.value,
          "itemKey": key,
          "registerSize": registerSize,
          "display": index <= mergedDisplayCount.value
        }), null);
      };
      // >>>>> Rest node
      let restNode = () => null;
      const restContextProps = {
        order: displayRest ? mergedDisplayCount.value : Number.MAX_SAFE_INTEGER,
        className: `${itemPrefixCls.value} ${itemPrefixCls.value}-rest`,
        registerSize: registerOverflowSize,
        display: displayRest
      };
      if (!renderRawRest) {
        const mergedRenderRest = renderRest || defaultRenderRest;
        restNode = () => _createVNode(Item, _objectSpread(_objectSpread({}, itemSharedProps), restContextProps), {
          default: () => typeof mergedRenderRest === 'function' ? mergedRenderRest(omittedItems.value) : mergedRenderRest
        });
      } else if (renderRawRest) {
        restNode = () => _createVNode(OverflowContextProvider, {
          "value": _extends(_extends({}, itemSharedProps), restContextProps)
        }, {
          default: () => [renderRawRest(omittedItems.value)]
        });
      }
      const overflowNode = () => {
        var _a;
        return _createVNode(Component, _objectSpread({
          "id": id,
          "class": classNames(!invalidate.value && prefixCls, className),
          "style": style,
          "onMousedown": onMousedown,
          "role": props.role
        }, restAttrs), {
          default: () => [mergedData.value.map(internalRenderItemNode), showRest.value ? restNode() : null, suffix && _createVNode(Item, _objectSpread(_objectSpread({}, itemSharedProps), {}, {
            "order": mergedDisplayCount.value,
            "class": `${itemPrefixCls.value}-suffix`,
            "registerSize": registerSuffixSize,
            "display": true,
            "style": suffixStyle
          }), {
            default: () => suffix
          }), (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]
        });
      };
      // 使用 disabled  避免结构不一致 导致子组件 rerender
      return _createVNode(ResizeObserver, {
        "disabled": !isResponsive.value,
        "onResize": onOverflowResize
      }, {
        default: overflowNode
      });
    };
  }
});
Overflow.Item = RawItem;
Overflow.RESPONSIVE = RESPONSIVE;
Overflow.INVALIDATE = INVALIDATE;
export default Overflow;