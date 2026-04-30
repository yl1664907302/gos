import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
import { formatValue, isSameMonth } from '../../utils/dateUtil';
import { useInjectRange } from '../../RangeContext';
import useCellClassName from '../../hooks/useCellClassName';
import PanelBody from '../PanelBody';
import useMergeProps from '../../hooks/useMergeProps';
export const MONTH_COL_COUNT = 3;
const MONTH_ROW_COUNT = 4;
function MonthBody(_props) {
  const props = useMergeProps(_props);
  const {
    prefixCls,
    locale,
    value,
    viewDate,
    generateConfig,
    monthCellRender
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
    isSameCell: (current, target) => isSameMonth(generateConfig, current, target),
    isInView: () => true,
    offsetCell: (date, offset) => generateConfig.addMonth(date, offset)
  });
  const monthsLocale = locale.shortMonths || (generateConfig.locale.getShortMonths ? generateConfig.locale.getShortMonths(locale.locale) : []);
  const baseMonth = generateConfig.setMonth(viewDate, 0);
  const getCellNode = monthCellRender ? date => monthCellRender({
    current: date,
    locale
  }) : undefined;
  return _createVNode(PanelBody, _objectSpread(_objectSpread({}, props), {}, {
    "rowNum": MONTH_ROW_COUNT,
    "colNum": MONTH_COL_COUNT,
    "baseDate": baseMonth,
    "getCellNode": getCellNode,
    "getCellText": date => locale.monthFormat ? formatValue(date, {
      locale,
      format: locale.monthFormat,
      generateConfig
    }) : monthsLocale[generateConfig.getMonth(date)],
    "getCellClassName": getCellClassName,
    "getCellDate": generateConfig.addMonth,
    "titleCell": date => formatValue(date, {
      locale,
      format: 'YYYY-MM',
      generateConfig
    })
  }), null);
}
MonthBody.displayName = 'MonthBody';
MonthBody.inheritAttrs = false;
export default MonthBody;