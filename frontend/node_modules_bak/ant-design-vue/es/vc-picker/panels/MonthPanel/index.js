import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
import MonthHeader from './MonthHeader';
import MonthBody, { MONTH_COL_COUNT } from './MonthBody';
import { createKeydownHandler } from '../../utils/uiUtil';
import useMergeProps from '../../hooks/useMergeProps';
function MonthPanel(_props) {
  const props = useMergeProps(_props);
  const {
    prefixCls,
    operationRef,
    onViewDateChange,
    generateConfig,
    value,
    viewDate,
    onPanelChange,
    onSelect
  } = props;
  const panelPrefixCls = `${prefixCls}-month-panel`;
  // ======================= Keyboard =======================
  operationRef.value = {
    onKeydown: event => createKeydownHandler(event, {
      onLeftRight: diff => {
        onSelect(generateConfig.addMonth(value || viewDate, diff), 'key');
      },
      onCtrlLeftRight: diff => {
        onSelect(generateConfig.addYear(value || viewDate, diff), 'key');
      },
      onUpDown: diff => {
        onSelect(generateConfig.addMonth(value || viewDate, diff * MONTH_COL_COUNT), 'key');
      },
      onEnter: () => {
        onPanelChange('date', value || viewDate);
      }
    })
  };
  // ==================== View Operation ====================
  const onYearChange = diff => {
    const newDate = generateConfig.addYear(viewDate, diff);
    onViewDateChange(newDate);
    onPanelChange(null, newDate);
  };
  return _createVNode("div", {
    "class": panelPrefixCls
  }, [_createVNode(MonthHeader, _objectSpread(_objectSpread({}, props), {}, {
    "prefixCls": prefixCls,
    "onPrevYear": () => {
      onYearChange(-1);
    },
    "onNextYear": () => {
      onYearChange(1);
    },
    "onYearClick": () => {
      onPanelChange('year', viewDate);
    }
  }), null), _createVNode(MonthBody, _objectSpread(_objectSpread({}, props), {}, {
    "prefixCls": prefixCls,
    "onSelect": date => {
      onSelect(date, 'mouse');
      onPanelChange('date', date);
    }
  }), null)]);
}
MonthPanel.displayName = 'MonthPanel';
MonthPanel.inheritAttrs = false;
export default MonthPanel;