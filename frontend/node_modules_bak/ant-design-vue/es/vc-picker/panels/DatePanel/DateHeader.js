import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
import Header from '../Header';
import { useInjectPanel } from '../../PanelContext';
import { formatValue } from '../../utils/dateUtil';
import useMergeProps from '../../hooks/useMergeProps';
function DateHeader(_props) {
  const props = useMergeProps(_props);
  const {
    prefixCls,
    generateConfig,
    locale,
    viewDate,
    onNextMonth,
    onPrevMonth,
    onNextYear,
    onPrevYear,
    onYearClick,
    onMonthClick
  } = props;
  const {
    hideHeader
  } = useInjectPanel();
  if (hideHeader.value) {
    return null;
  }
  const headerPrefixCls = `${prefixCls}-header`;
  const monthsLocale = locale.shortMonths || (generateConfig.locale.getShortMonths ? generateConfig.locale.getShortMonths(locale.locale) : []);
  const month = generateConfig.getMonth(viewDate);
  // =================== Month & Year ===================
  const yearNode = _createVNode("button", {
    "type": "button",
    "key": "year",
    "onClick": onYearClick,
    "tabindex": -1,
    "class": `${prefixCls}-year-btn`
  }, [formatValue(viewDate, {
    locale,
    format: locale.yearFormat,
    generateConfig
  })]);
  const monthNode = _createVNode("button", {
    "type": "button",
    "key": "month",
    "onClick": onMonthClick,
    "tabindex": -1,
    "class": `${prefixCls}-month-btn`
  }, [locale.monthFormat ? formatValue(viewDate, {
    locale,
    format: locale.monthFormat,
    generateConfig
  }) : monthsLocale[month]]);
  const monthYearNodes = locale.monthBeforeYear ? [monthNode, yearNode] : [yearNode, monthNode];
  return _createVNode(Header, _objectSpread(_objectSpread({}, props), {}, {
    "prefixCls": headerPrefixCls,
    "onSuperPrev": onPrevYear,
    "onPrev": onPrevMonth,
    "onNext": onNextMonth,
    "onSuperNext": onNextYear
  }), {
    default: () => [monthYearNodes]
  });
}
DateHeader.displayName = 'DateHeader';
DateHeader.inheritAttrs = false;
export default DateHeader;