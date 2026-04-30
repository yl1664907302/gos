import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
import YearHeader from './YearHeader';
import YearBody, { YEAR_COL_COUNT } from './YearBody';
import { createKeydownHandler } from '../../utils/uiUtil';
import useMergeProps from '../../hooks/useMergeProps';
export const YEAR_DECADE_COUNT = 10;
function YearPanel(_props) {
  const props = useMergeProps(_props);
  const {
    prefixCls,
    operationRef,
    onViewDateChange,
    generateConfig,
    value,
    viewDate,
    sourceMode,
    onSelect,
    onPanelChange
  } = props;
  const panelPrefixCls = `${prefixCls}-year-panel`;
  // ======================= Keyboard =======================
  operationRef.value = {
    onKeydown: event => createKeydownHandler(event, {
      onLeftRight: diff => {
        onSelect(generateConfig.addYear(value || viewDate, diff), 'key');
      },
      onCtrlLeftRight: diff => {
        onSelect(generateConfig.addYear(value || viewDate, diff * YEAR_DECADE_COUNT), 'key');
      },
      onUpDown: diff => {
        onSelect(generateConfig.addYear(value || viewDate, diff * YEAR_COL_COUNT), 'key');
      },
      onEnter: () => {
        onPanelChange(sourceMode === 'date' ? 'date' : 'month', value || viewDate);
      }
    })
  };
  // ==================== View Operation ====================
  const onDecadeChange = diff => {
    const newDate = generateConfig.addYear(viewDate, diff * 10);
    onViewDateChange(newDate);
    onPanelChange(null, newDate);
  };
  return _createVNode("div", {
    "class": panelPrefixCls
  }, [_createVNode(YearHeader, _objectSpread(_objectSpread({}, props), {}, {
    "prefixCls": prefixCls,
    "onPrevDecade": () => {
      onDecadeChange(-1);
    },
    "onNextDecade": () => {
      onDecadeChange(1);
    },
    "onDecadeClick": () => {
      onPanelChange('decade', viewDate);
    }
  }), null), _createVNode(YearBody, _objectSpread(_objectSpread({}, props), {}, {
    "prefixCls": prefixCls,
    "onSelect": date => {
      onPanelChange(sourceMode === 'date' ? 'date' : 'month', date);
      onSelect(date, 'mouse');
    }
  }), null)]);
}
YearPanel.displayName = 'YearPanel';
YearPanel.inheritAttrs = false;
export default YearPanel;