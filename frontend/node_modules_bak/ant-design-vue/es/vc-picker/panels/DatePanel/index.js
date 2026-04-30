import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import DateBody from './DateBody';
import DateHeader from './DateHeader';
import { WEEK_DAY_COUNT } from '../../utils/dateUtil';
import { createKeydownHandler } from '../../utils/uiUtil';
import classNames from '../../../_util/classNames';
import useMergeProps from '../../hooks/useMergeProps';
const DATE_ROW_COUNT = 6;
function DatePanel(_props) {
  const props = useMergeProps(_props);
  const {
    prefixCls,
    panelName = 'date',
    keyboardConfig,
    active,
    operationRef,
    generateConfig,
    value,
    viewDate,
    onViewDateChange,
    onPanelChange,
    onSelect
  } = props;
  const panelPrefixCls = `${prefixCls}-${panelName}-panel`;
  // ======================= Keyboard =======================
  operationRef.value = {
    onKeydown: event => createKeydownHandler(event, _extends({
      onLeftRight: diff => {
        onSelect(generateConfig.addDate(value || viewDate, diff), 'key');
      },
      onCtrlLeftRight: diff => {
        onSelect(generateConfig.addYear(value || viewDate, diff), 'key');
      },
      onUpDown: diff => {
        onSelect(generateConfig.addDate(value || viewDate, diff * WEEK_DAY_COUNT), 'key');
      },
      onPageUpDown: diff => {
        onSelect(generateConfig.addMonth(value || viewDate, diff), 'key');
      }
    }, keyboardConfig))
  };
  // ==================== View Operation ====================
  const onYearChange = diff => {
    const newDate = generateConfig.addYear(viewDate, diff);
    onViewDateChange(newDate);
    onPanelChange(null, newDate);
  };
  const onMonthChange = diff => {
    const newDate = generateConfig.addMonth(viewDate, diff);
    onViewDateChange(newDate);
    onPanelChange(null, newDate);
  };
  return _createVNode("div", {
    "class": classNames(panelPrefixCls, {
      [`${panelPrefixCls}-active`]: active
    })
  }, [_createVNode(DateHeader, _objectSpread(_objectSpread({}, props), {}, {
    "prefixCls": prefixCls,
    "value": value,
    "viewDate": viewDate,
    "onPrevYear": () => {
      onYearChange(-1);
    },
    "onNextYear": () => {
      onYearChange(1);
    },
    "onPrevMonth": () => {
      onMonthChange(-1);
    },
    "onNextMonth": () => {
      onMonthChange(1);
    },
    "onMonthClick": () => {
      onPanelChange('month', viewDate);
    },
    "onYearClick": () => {
      onPanelChange('year', viewDate);
    }
  }), null), _createVNode(DateBody, _objectSpread(_objectSpread({}, props), {}, {
    "onSelect": date => onSelect(date, 'mouse'),
    "prefixCls": prefixCls,
    "value": value,
    "viewDate": viewDate,
    "rowCount": DATE_ROW_COUNT
  }), null)]);
}
DatePanel.displayName = 'DatePanel';
DatePanel.inheritAttrs = false;
export default DatePanel;