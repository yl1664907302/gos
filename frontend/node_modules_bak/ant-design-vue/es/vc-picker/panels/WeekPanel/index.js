import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
import DatePanel from '../DatePanel';
import { isSameWeek } from '../../utils/dateUtil';
import classNames from '../../../_util/classNames';
import useMergeProps from '../../hooks/useMergeProps';
function WeekPanel(_props) {
  const props = useMergeProps(_props);
  const {
    prefixCls,
    generateConfig,
    locale,
    value
  } = props;
  // Render additional column
  const cellPrefixCls = `${prefixCls}-cell`;
  const prefixColumn = date => _createVNode("td", {
    "key": "week",
    "class": classNames(cellPrefixCls, `${cellPrefixCls}-week`)
  }, [generateConfig.locale.getWeek(locale.locale, date)]);
  // Add row className
  const rowPrefixCls = `${prefixCls}-week-panel-row`;
  const rowClassName = date => classNames(rowPrefixCls, {
    [`${rowPrefixCls}-selected`]: isSameWeek(generateConfig, locale.locale, value, date)
  });
  return _createVNode(DatePanel, _objectSpread(_objectSpread({}, props), {}, {
    "panelName": "week",
    "prefixColumn": prefixColumn,
    "rowClassName": rowClassName,
    "keyboardConfig": {
      onLeftRight: null
    }
  }), null);
}
WeekPanel.displayName = 'WeekPanel';
WeekPanel.inheritAttrs = false;
export default WeekPanel;