import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import DatePanel from '../DatePanel';
import TimePanel from '../TimePanel';
import { tuple } from '../../utils/miscUtil';
import { setDateTime as setTime } from '../../utils/timeUtil';
import KeyCode from '../../../_util/KeyCode';
import classNames from '../../../_util/classNames';
import { ref } from 'vue';
import useMergeProps from '../../hooks/useMergeProps';
const ACTIVE_PANEL = tuple('date', 'time');
function DatetimePanel(_props) {
  const props = useMergeProps(_props);
  const {
    prefixCls,
    operationRef,
    generateConfig,
    value,
    defaultValue,
    disabledTime,
    showTime,
    onSelect
  } = props;
  const panelPrefixCls = `${prefixCls}-datetime-panel`;
  const activePanel = ref(null);
  const dateOperationRef = ref({});
  const timeOperationRef = ref({});
  const timeProps = typeof showTime === 'object' ? _extends({}, showTime) : {};
  // ======================= Keyboard =======================
  function getNextActive(offset) {
    const activeIndex = ACTIVE_PANEL.indexOf(activePanel.value) + offset;
    const nextActivePanel = ACTIVE_PANEL[activeIndex] || null;
    return nextActivePanel;
  }
  const onBlur = e => {
    if (timeOperationRef.value.onBlur) {
      timeOperationRef.value.onBlur(e);
    }
    activePanel.value = null;
  };
  operationRef.value = {
    onKeydown: event => {
      // Switch active panel
      if (event.which === KeyCode.TAB) {
        const nextActivePanel = getNextActive(event.shiftKey ? -1 : 1);
        activePanel.value = nextActivePanel;
        if (nextActivePanel) {
          event.preventDefault();
        }
        return true;
      }
      // Operate on current active panel
      if (activePanel.value) {
        const ref = activePanel.value === 'date' ? dateOperationRef : timeOperationRef;
        if (ref.value && ref.value.onKeydown) {
          ref.value.onKeydown(event);
        }
        return true;
      }
      // Switch first active panel if operate without panel
      if ([KeyCode.LEFT, KeyCode.RIGHT, KeyCode.UP, KeyCode.DOWN].includes(event.which)) {
        activePanel.value = 'date';
        return true;
      }
      return false;
    },
    onBlur,
    onClose: onBlur
  };
  // ======================== Events ========================
  const onInternalSelect = (date, source) => {
    let selectedDate = date;
    if (source === 'date' && !value && timeProps.defaultValue) {
      // Date with time defaultValue
      selectedDate = generateConfig.setHour(selectedDate, generateConfig.getHour(timeProps.defaultValue));
      selectedDate = generateConfig.setMinute(selectedDate, generateConfig.getMinute(timeProps.defaultValue));
      selectedDate = generateConfig.setSecond(selectedDate, generateConfig.getSecond(timeProps.defaultValue));
    } else if (source === 'time' && !value && defaultValue) {
      selectedDate = generateConfig.setYear(selectedDate, generateConfig.getYear(defaultValue));
      selectedDate = generateConfig.setMonth(selectedDate, generateConfig.getMonth(defaultValue));
      selectedDate = generateConfig.setDate(selectedDate, generateConfig.getDate(defaultValue));
    }
    if (onSelect) {
      onSelect(selectedDate, 'mouse');
    }
  };
  // ======================== Render ========================
  const disabledTimes = disabledTime ? disabledTime(value || null) : {};
  return _createVNode("div", {
    "class": classNames(panelPrefixCls, {
      [`${panelPrefixCls}-active`]: activePanel.value
    })
  }, [_createVNode(DatePanel, _objectSpread(_objectSpread({}, props), {}, {
    "operationRef": dateOperationRef,
    "active": activePanel.value === 'date',
    "onSelect": date => {
      onInternalSelect(setTime(generateConfig, date, !value && typeof showTime === 'object' ? showTime.defaultValue : null), 'date');
    }
  }), null), _createVNode(TimePanel, _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, props), {}, {
    "format": undefined
  }, timeProps), disabledTimes), {}, {
    "disabledTime": null,
    "defaultValue": undefined,
    "operationRef": timeOperationRef,
    "active": activePanel.value === 'time',
    "onSelect": date => {
      onInternalSelect(date, 'time');
    }
  }), null)]);
}
DatetimePanel.displayName = 'DatetimePanel';
DatetimePanel.inheritAttrs = false;
export default DatetimePanel;