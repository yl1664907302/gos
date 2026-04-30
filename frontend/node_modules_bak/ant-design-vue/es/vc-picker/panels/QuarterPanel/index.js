import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
import QuarterHeader from './QuarterHeader';
import QuarterBody from './QuarterBody';
import { createKeydownHandler } from '../../utils/uiUtil';
import useMergeProps from '../../hooks/useMergeProps';
function QuarterPanel(_props) {
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
  const panelPrefixCls = `${prefixCls}-quarter-panel`;
  // ======================= Keyboard =======================
  operationRef.value = {
    onKeydown: event => createKeydownHandler(event, {
      onLeftRight: diff => {
        onSelect(generateConfig.addMonth(value || viewDate, diff * 3), 'key');
      },
      onCtrlLeftRight: diff => {
        onSelect(generateConfig.addYear(value || viewDate, diff), 'key');
      },
      onUpDown: diff => {
        onSelect(generateConfig.addYear(value || viewDate, diff), 'key');
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
  }, [_createVNode(QuarterHeader, _objectSpread(_objectSpread({}, props), {}, {
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
  }), null), _createVNode(QuarterBody, _objectSpread(_objectSpread({}, props), {}, {
    "prefixCls": prefixCls,
    "onSelect": date => {
      onSelect(date, 'mouse');
    }
  }), null)]);
}
QuarterPanel.displayName = 'QuarterPanel';
QuarterPanel.inheritAttrs = false;
export default QuarterPanel;