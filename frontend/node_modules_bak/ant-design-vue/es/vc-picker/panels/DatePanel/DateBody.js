import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
import { WEEK_DAY_COUNT, getWeekStartDate, isSameDate, isSameMonth, formatValue } from '../../utils/dateUtil';
import useCellClassName from '../../hooks/useCellClassName';
import PanelBody from '../PanelBody';
import { useInjectRange } from '../../RangeContext';
import useMergeProps from '../../hooks/useMergeProps';
function DateBody(_props) {
  const props = useMergeProps(_props);
  const {
    prefixCls,
    generateConfig,
    prefixColumn,
    locale,
    rowCount,
    viewDate,
    value,
    dateRender
  } = props;
  const {
    rangedValue,
    hoverRangedValue
  } = useInjectRange();
  const baseDate = getWeekStartDate(locale.locale, generateConfig, viewDate);
  const cellPrefixCls = `${prefixCls}-cell`;
  const weekFirstDay = generateConfig.locale.getWeekFirstDay(locale.locale);
  const today = generateConfig.getNow();
  // ============================== Header ==============================
  const headerCells = [];
  const weekDaysLocale = locale.shortWeekDays || (generateConfig.locale.getShortWeekDays ? generateConfig.locale.getShortWeekDays(locale.locale) : []);
  if (prefixColumn) {
    headerCells.push(_createVNode("th", {
      "key": "empty",
      "aria-label": "empty cell"
    }, null));
  }
  for (let i = 0; i < WEEK_DAY_COUNT; i += 1) {
    headerCells.push(_createVNode("th", {
      "key": i
    }, [weekDaysLocale[(i + weekFirstDay) % WEEK_DAY_COUNT]]));
  }
  // =============================== Body ===============================
  const getCellClassName = useCellClassName({
    cellPrefixCls,
    today,
    value,
    generateConfig,
    rangedValue: prefixColumn ? null : rangedValue.value,
    hoverRangedValue: prefixColumn ? null : hoverRangedValue.value,
    isSameCell: (current, target) => isSameDate(generateConfig, current, target),
    isInView: date => isSameMonth(generateConfig, date, viewDate),
    offsetCell: (date, offset) => generateConfig.addDate(date, offset)
  });
  const getCellNode = dateRender ? date => dateRender({
    current: date,
    today
  }) : undefined;
  return _createVNode(PanelBody, _objectSpread(_objectSpread({}, props), {}, {
    "rowNum": rowCount,
    "colNum": WEEK_DAY_COUNT,
    "baseDate": baseDate,
    "getCellNode": getCellNode,
    "getCellText": generateConfig.getDate,
    "getCellClassName": getCellClassName,
    "getCellDate": generateConfig.addDate,
    "titleCell": date => formatValue(date, {
      locale,
      format: 'YYYY-MM-DD',
      generateConfig
    }),
    "headerCells": headerCells
  }), null);
}
DateBody.displayName = 'DateBody';
DateBody.inheritAttrs = false;
DateBody.props = ['prefixCls', 'generateConfig', 'value?', 'viewDate', 'locale', 'rowCount', 'onSelect', 'dateRender?', 'disabledDate?',
// Used for week panel
'prefixColumn?', 'rowClassName?'];
export default DateBody;