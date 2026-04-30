import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
import DecadeHeader from './DecadeHeader';
import DecadeBody, { DECADE_COL_COUNT } from './DecadeBody';
import { createKeydownHandler } from '../../utils/uiUtil';
import useMergeProps from '../../hooks/useMergeProps';
export const DECADE_UNIT_DIFF = 10;
export const DECADE_DISTANCE_COUNT = DECADE_UNIT_DIFF * 10;
function DecadePanel(_props) {
  const props = useMergeProps(_props);
  const {
    prefixCls,
    onViewDateChange,
    generateConfig,
    viewDate,
    operationRef,
    onSelect,
    onPanelChange
  } = props;
  const panelPrefixCls = `${prefixCls}-decade-panel`;
  // ======================= Keyboard =======================
  operationRef.value = {
    onKeydown: event => createKeydownHandler(event, {
      onLeftRight: diff => {
        onSelect(generateConfig.addYear(viewDate, diff * DECADE_UNIT_DIFF), 'key');
      },
      onCtrlLeftRight: diff => {
        onSelect(generateConfig.addYear(viewDate, diff * DECADE_DISTANCE_COUNT), 'key');
      },
      onUpDown: diff => {
        onSelect(generateConfig.addYear(viewDate, diff * DECADE_UNIT_DIFF * DECADE_COL_COUNT), 'key');
      },
      onEnter: () => {
        onPanelChange('year', viewDate);
      }
    })
  };
  // ==================== View Operation ====================
  const onDecadesChange = diff => {
    const newDate = generateConfig.addYear(viewDate, diff * DECADE_DISTANCE_COUNT);
    onViewDateChange(newDate);
    onPanelChange(null, newDate);
  };
  const onInternalSelect = date => {
    onSelect(date, 'mouse');
    onPanelChange('year', date);
  };
  return _createVNode("div", {
    "class": panelPrefixCls
  }, [_createVNode(DecadeHeader, _objectSpread(_objectSpread({}, props), {}, {
    "prefixCls": prefixCls,
    "onPrevDecades": () => {
      onDecadesChange(-1);
    },
    "onNextDecades": () => {
      onDecadesChange(1);
    }
  }), null), _createVNode(DecadeBody, _objectSpread(_objectSpread({}, props), {}, {
    "prefixCls": prefixCls,
    "onSelect": onInternalSelect
  }), null)]);
}
DecadePanel.displayName = 'DecadePanel';
DecadePanel.inheritAttrs = false;
export default DecadePanel;