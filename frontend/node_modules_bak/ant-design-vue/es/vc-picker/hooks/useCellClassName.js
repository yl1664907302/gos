import { isInRange } from '../utils/dateUtil';
import { getValue } from '../utils/miscUtil';
export default function useCellClassName(_ref) {
  let {
    cellPrefixCls,
    generateConfig,
    rangedValue,
    hoverRangedValue,
    isInView,
    isSameCell,
    offsetCell,
    today,
    value
  } = _ref;
  function getClassName(currentDate) {
    const prevDate = offsetCell(currentDate, -1);
    const nextDate = offsetCell(currentDate, 1);
    const rangeStart = getValue(rangedValue, 0);
    const rangeEnd = getValue(rangedValue, 1);
    const hoverStart = getValue(hoverRangedValue, 0);
    const hoverEnd = getValue(hoverRangedValue, 1);
    const isRangeHovered = isInRange(generateConfig, hoverStart, hoverEnd, currentDate);
    function isRangeStart(date) {
      return isSameCell(rangeStart, date);
    }
    function isRangeEnd(date) {
      return isSameCell(rangeEnd, date);
    }
    const isHoverStart = isSameCell(hoverStart, currentDate);
    const isHoverEnd = isSameCell(hoverEnd, currentDate);
    const isHoverEdgeStart = (isRangeHovered || isHoverEnd) && (!isInView(prevDate) || isRangeEnd(prevDate));
    const isHoverEdgeEnd = (isRangeHovered || isHoverStart) && (!isInView(nextDate) || isRangeStart(nextDate));
    return {
      // In view
      [`${cellPrefixCls}-in-view`]: isInView(currentDate),
      // Range
      [`${cellPrefixCls}-in-range`]: isInRange(generateConfig, rangeStart, rangeEnd, currentDate),
      [`${cellPrefixCls}-range-start`]: isRangeStart(currentDate),
      [`${cellPrefixCls}-range-end`]: isRangeEnd(currentDate),
      [`${cellPrefixCls}-range-start-single`]: isRangeStart(currentDate) && !rangeEnd,
      [`${cellPrefixCls}-range-end-single`]: isRangeEnd(currentDate) && !rangeStart,
      [`${cellPrefixCls}-range-start-near-hover`]: isRangeStart(currentDate) && (isSameCell(prevDate, hoverStart) || isInRange(generateConfig, hoverStart, hoverEnd, prevDate)),
      [`${cellPrefixCls}-range-end-near-hover`]: isRangeEnd(currentDate) && (isSameCell(nextDate, hoverEnd) || isInRange(generateConfig, hoverStart, hoverEnd, nextDate)),
      // Range Hover
      [`${cellPrefixCls}-range-hover`]: isRangeHovered,
      [`${cellPrefixCls}-range-hover-start`]: isHoverStart,
      [`${cellPrefixCls}-range-hover-end`]: isHoverEnd,
      // Range Edge
      [`${cellPrefixCls}-range-hover-edge-start`]: isHoverEdgeStart,
      [`${cellPrefixCls}-range-hover-edge-end`]: isHoverEdgeEnd,
      [`${cellPrefixCls}-range-hover-edge-start-near-range`]: isHoverEdgeStart && isSameCell(prevDate, rangeEnd),
      [`${cellPrefixCls}-range-hover-edge-end-near-range`]: isHoverEdgeEnd && isSameCell(nextDate, rangeStart),
      // Others
      [`${cellPrefixCls}-today`]: isSameCell(today, currentDate),
      [`${cellPrefixCls}-selected`]: isSameCell(value, currentDate)
    };
  }
  return getClassName;
}