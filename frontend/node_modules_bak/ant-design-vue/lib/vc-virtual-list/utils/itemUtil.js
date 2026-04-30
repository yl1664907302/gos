"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GHOST_ITEM_KEY = void 0;
exports.alignScrollTop = alignScrollTop;
exports.getCompareItemRelativeTop = getCompareItemRelativeTop;
exports.getElementScrollPercentage = getElementScrollPercentage;
exports.getItemAbsoluteTop = getItemAbsoluteTop;
exports.getItemRelativeTop = getItemRelativeTop;
exports.getNodeHeight = getNodeHeight;
exports.getRangeIndex = getRangeIndex;
exports.getScrollPercentage = getScrollPercentage;
exports.requireVirtual = requireVirtual;
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
/**
 * Our algorithm have additional one ghost item
 * whose index as `data.length` to simplify the calculation
 */
const GHOST_ITEM_KEY = exports.GHOST_ITEM_KEY = '__vc_ghost_item__';
/**
 * Safari has the elasticity effect which provides negative `scrollTop` value.
 * We should ignore it since will make scroll animation shake.
 */
function alignScrollTop(scrollTop, scrollRange) {
  if (scrollTop < 0) {
    return 0;
  }
  if (scrollTop >= scrollRange) {
    return scrollRange;
  }
  return scrollTop;
}
/**
 * Get node `offsetHeight`. We prefer node is a dom element directly.
 * But if not provided, downgrade to `findDOMNode` to get the real dom element.
 */
function getNodeHeight(node) {
  return node ? node.offsetHeight : 0;
}
/**
 * Calculate the located item absolute top with whole scroll height
 */
function getItemAbsoluteTop(_a) {
  var {
      scrollTop
    } = _a,
    rest = __rest(_a, ["scrollTop"]);
  return scrollTop + getItemRelativeTop(rest);
}
/**
 * Calculate the located item related top with current window height
 */
function getItemRelativeTop(_ref) {
  let {
    itemIndex,
    itemOffsetPtg,
    itemElementHeights,
    scrollPtg,
    clientHeight,
    getItemKey
  } = _ref;
  const locatedItemHeight = itemElementHeights[getItemKey(itemIndex)] || 0;
  const locatedItemTop = scrollPtg * clientHeight;
  const locatedItemOffset = itemOffsetPtg * locatedItemHeight;
  return Math.floor(locatedItemTop - locatedItemOffset);
}
function getCompareItemRelativeTop(_ref2) {
  let {
    locatedItemRelativeTop,
    locatedItemIndex,
    compareItemIndex,
    startIndex,
    endIndex,
    getItemKey,
    itemElementHeights
  } = _ref2;
  let originCompareItemTop = locatedItemRelativeTop;
  const compareItemKey = getItemKey(compareItemIndex);
  if (compareItemIndex <= locatedItemIndex) {
    for (let index = locatedItemIndex; index >= startIndex; index -= 1) {
      const key = getItemKey(index);
      if (key === compareItemKey) {
        break;
      }
      const prevItemKey = getItemKey(index - 1);
      originCompareItemTop -= itemElementHeights[prevItemKey] || 0;
    }
  } else {
    for (let index = locatedItemIndex; index <= endIndex; index += 1) {
      const key = getItemKey(index);
      if (key === compareItemKey) {
        break;
      }
      originCompareItemTop += itemElementHeights[key] || 0;
    }
  }
  return originCompareItemTop;
}
function getScrollPercentage(_ref3) {
  let {
    scrollTop,
    scrollHeight,
    clientHeight
  } = _ref3;
  if (scrollHeight <= clientHeight) {
    return 0;
  }
  const scrollRange = scrollHeight - clientHeight;
  const alignedScrollTop = alignScrollTop(scrollTop, scrollRange);
  const scrollTopPtg = alignedScrollTop / scrollRange;
  return scrollTopPtg;
}
function getElementScrollPercentage(element) {
  if (!element) {
    return 0;
  }
  return getScrollPercentage(element);
}
/**
 * Get location item and its align percentage with the scroll percentage.
 * We should measure current scroll position to decide which item is the location item.
 * And then fill the top count and bottom count with the base of location item.
 *
 * `total` should be the real count instead of `total - 1` in calculation.
 */
function getLocationItem(scrollPtg, total) {
  const itemIndex = Math.floor(scrollPtg * total);
  const itemTopPtg = itemIndex / total;
  const itemBottomPtg = (itemIndex + 1) / total;
  const itemOffsetPtg = (scrollPtg - itemTopPtg) / (itemBottomPtg - itemTopPtg);
  return {
    index: itemIndex,
    offsetPtg: itemOffsetPtg
  };
}
/**
 * Get display items start, end, located item index. This is pure math calculation
 */
function getRangeIndex(scrollPtg, itemCount, visibleCount) {
  const {
    index,
    offsetPtg
  } = getLocationItem(scrollPtg, itemCount);
  const beforeCount = Math.ceil(scrollPtg * visibleCount);
  const afterCount = Math.ceil((1 - scrollPtg) * visibleCount);
  return {
    itemIndex: index,
    itemOffsetPtg: offsetPtg,
    startIndex: Math.max(0, index - beforeCount),
    endIndex: Math.min(itemCount - 1, index + afterCount)
  };
}
function requireVirtual(height, itemHeight, count, virtual) {
  return virtual !== false && typeof height === 'number' && count * itemHeight > height;
}