import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
import { formatValue, isSameQuarter } from '../../utils/dateUtil';
import { useInjectRange } from '../../RangeContext';
import useCellClassName from '../../hooks/useCellClassName';
import PanelBody from '../PanelBody';
import useMergeProps from '../../hooks/useMergeProps';
export const QUARTER_COL_COUNT = 4;
const QUARTER_ROW_COUNT = 1;
function QuarterBody(_props) {
  const props = useMergeProps(_props);
  const {
    prefixCls,
    locale,
    value,
    viewDate,
    generateConfig
  } = props;
  const {
    rangedValue,
    hoverRangedValue
  } = useInjectRange();
  const cellPrefixCls = `${prefixCls}-cell`;
  const getCellClassName = useCellClassName({
    cellPrefixCls,
    value,
    generateConfig,
    rangedValue: rangedValue.value,
    hoverRangedValue: hoverRangedValue.value,
    isSameCell: (current, target) => isSameQuarter(generateConfig, current, target),
    isInView: () => true,
    offsetCell: (date, offset) => generateConfig.addMonth(date, offset * 3)
  });
  const baseQuarter = generateConfig.setDate(generateConfig.setMonth(viewDate, 0), 1);
  return _createVNode(PanelBody, _objectSpread(_objectSpread({}, props), {}, {
    "rowNum": QUARTER_ROW_COUNT,
    "colNum": QUARTER_COL_COUNT,
    "baseDate": baseQuarter,
    "getCellText": date => formatValue(date, {
      locale,
      format: locale.quarterFormat || '[Q]Q',
      generateConfig
    }),
    "getCellClassName": getCellClassName,
    "getCellDate": (date, offset) => generateConfig.addMonth(date, offset * 3),
    "titleCell": date => formatValue(date, {
      locale,
      format: 'YYYY-[Q]Q',
      generateConfig
    })
  }), null);
}
QuarterBody.displayName = 'QuarterBody';
QuarterBody.inheritAttrs = false;
export default QuarterBody;