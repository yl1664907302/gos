import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
import { YEAR_DECADE_COUNT } from '.';
import useCellClassName from '../../hooks/useCellClassName';
import { formatValue, isSameYear } from '../../utils/dateUtil';
import { useInjectRange } from '../../RangeContext';
import PanelBody from '../PanelBody';
import useMergeProps from '../../hooks/useMergeProps';
export const YEAR_COL_COUNT = 3;
const YEAR_ROW_COUNT = 4;
function YearBody(_props) {
  const props = useMergeProps(_props);
  const {
    prefixCls,
    value,
    viewDate,
    locale,
    generateConfig
  } = props;
  const {
    rangedValue,
    hoverRangedValue
  } = useInjectRange();
  const yearPrefixCls = `${prefixCls}-cell`;
  // =============================== Year ===============================
  const yearNumber = generateConfig.getYear(viewDate);
  const startYear = Math.floor(yearNumber / YEAR_DECADE_COUNT) * YEAR_DECADE_COUNT;
  const endYear = startYear + YEAR_DECADE_COUNT - 1;
  const baseYear = generateConfig.setYear(viewDate, startYear - Math.ceil((YEAR_COL_COUNT * YEAR_ROW_COUNT - YEAR_DECADE_COUNT) / 2));
  const isInView = date => {
    const currentYearNumber = generateConfig.getYear(date);
    return startYear <= currentYearNumber && currentYearNumber <= endYear;
  };
  const getCellClassName = useCellClassName({
    cellPrefixCls: yearPrefixCls,
    value,
    generateConfig,
    rangedValue: rangedValue.value,
    hoverRangedValue: hoverRangedValue.value,
    isSameCell: (current, target) => isSameYear(generateConfig, current, target),
    isInView,
    offsetCell: (date, offset) => generateConfig.addYear(date, offset)
  });
  return _createVNode(PanelBody, _objectSpread(_objectSpread({}, props), {}, {
    "rowNum": YEAR_ROW_COUNT,
    "colNum": YEAR_COL_COUNT,
    "baseDate": baseYear,
    "getCellText": generateConfig.getYear,
    "getCellClassName": getCellClassName,
    "getCellDate": generateConfig.addYear,
    "titleCell": date => formatValue(date, {
      locale,
      format: 'YYYY',
      generateConfig
    })
  }), null);
}
YearBody.displayName = 'YearBody';
YearBody.inheritAttrs = false;
export default YearBody;