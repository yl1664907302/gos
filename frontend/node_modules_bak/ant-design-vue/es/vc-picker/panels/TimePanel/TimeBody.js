import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import TimeUnitColumn from './TimeUnitColumn';
import { leftPad } from '../../utils/miscUtil';
import { setTime as utilSetTime } from '../../utils/timeUtil';
import { cloneElement } from '../../../_util/vnode';
import { onBeforeUpdate, ref, watchEffect, computed, defineComponent } from 'vue';
function generateUnits(start, end, step, disabledUnits) {
  const units = [];
  for (let i = start; i <= end; i += step) {
    units.push({
      label: leftPad(i, 2),
      value: i,
      disabled: (disabledUnits || []).includes(i)
    });
  }
  return units;
}
const TimeBody = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'TimeBody',
  inheritAttrs: false,
  props: ['generateConfig', 'prefixCls', 'operationRef', 'activeColumnIndex', 'value', 'showHour', 'showMinute', 'showSecond', 'use12Hours', 'hourStep', 'minuteStep', 'secondStep', 'disabledHours', 'disabledMinutes', 'disabledSeconds', 'disabledTime', 'hideDisabledOptions', 'onSelect'],
  setup(props) {
    const originHour = computed(() => props.value ? props.generateConfig.getHour(props.value) : -1);
    const isPM = computed(() => {
      if (props.use12Hours) {
        return originHour.value >= 12; // -1 means should display AM
      } else {
        return false;
      }
    });
    const hour = computed(() => {
      // Should additional logic to handle 12 hours
      if (props.use12Hours) {
        return originHour.value % 12;
      } else {
        return originHour.value;
      }
    });
    const minute = computed(() => props.value ? props.generateConfig.getMinute(props.value) : -1);
    const second = computed(() => props.value ? props.generateConfig.getSecond(props.value) : -1);
    const now = ref(props.generateConfig.getNow());
    const mergedDisabledHours = ref();
    const mergedDisabledMinutes = ref();
    const mergedDisabledSeconds = ref();
    onBeforeUpdate(() => {
      now.value = props.generateConfig.getNow();
    });
    watchEffect(() => {
      if (props.disabledTime) {
        const disabledConfig = props.disabledTime(now);
        [mergedDisabledHours.value, mergedDisabledMinutes.value, mergedDisabledSeconds.value] = [disabledConfig.disabledHours, disabledConfig.disabledMinutes, disabledConfig.disabledSeconds];
      } else {
        [mergedDisabledHours.value, mergedDisabledMinutes.value, mergedDisabledSeconds.value] = [props.disabledHours, props.disabledMinutes, props.disabledSeconds];
      }
    });
    const setTime = (isNewPM, newHour, newMinute, newSecond) => {
      let newDate = props.value || props.generateConfig.getNow();
      const mergedHour = Math.max(0, newHour);
      const mergedMinute = Math.max(0, newMinute);
      const mergedSecond = Math.max(0, newSecond);
      newDate = utilSetTime(props.generateConfig, newDate, !props.use12Hours || !isNewPM ? mergedHour : mergedHour + 12, mergedMinute, mergedSecond);
      return newDate;
    };
    // ========================= Unit =========================
    const rawHours = computed(() => {
      var _a;
      return generateUnits(0, 23, (_a = props.hourStep) !== null && _a !== void 0 ? _a : 1, mergedDisabledHours.value && mergedDisabledHours.value());
    });
    // const memorizedRawHours = useMemo(() => rawHours, rawHours, shouldUnitsUpdate);
    const AMPMDisabled = computed(() => {
      if (!props.use12Hours) {
        return [false, false];
      }
      const AMPMDisabled = [true, true];
      rawHours.value.forEach(_ref => {
        let {
          disabled,
          value: hourValue
        } = _ref;
        if (disabled) return;
        if (hourValue >= 12) {
          AMPMDisabled[1] = false;
        } else {
          AMPMDisabled[0] = false;
        }
      });
      return AMPMDisabled;
    });
    const hours = computed(() => {
      if (!props.use12Hours) return rawHours.value;
      return rawHours.value.filter(isPM.value ? hourMeta => hourMeta.value >= 12 : hourMeta => hourMeta.value < 12).map(hourMeta => {
        const hourValue = hourMeta.value % 12;
        const hourLabel = hourValue === 0 ? '12' : leftPad(hourValue, 2);
        return _extends(_extends({}, hourMeta), {
          label: hourLabel,
          value: hourValue
        });
      });
    });
    const minutes = computed(() => {
      var _a;
      return generateUnits(0, 59, (_a = props.minuteStep) !== null && _a !== void 0 ? _a : 1, mergedDisabledMinutes.value && mergedDisabledMinutes.value(originHour.value));
    });
    const seconds = computed(() => {
      var _a;
      return generateUnits(0, 59, (_a = props.secondStep) !== null && _a !== void 0 ? _a : 1, mergedDisabledSeconds.value && mergedDisabledSeconds.value(originHour.value, minute.value));
    });
    return () => {
      const {
        prefixCls,
        operationRef,
        activeColumnIndex,
        showHour,
        showMinute,
        showSecond,
        use12Hours,
        hideDisabledOptions,
        onSelect
      } = props;
      const columns = [];
      const contentPrefixCls = `${prefixCls}-content`;
      const columnPrefixCls = `${prefixCls}-time-panel`;
      // ====================== Operations ======================
      operationRef.value = {
        onUpDown: diff => {
          const column = columns[activeColumnIndex];
          if (column) {
            const valueIndex = column.units.findIndex(unit => unit.value === column.value);
            const unitLen = column.units.length;
            for (let i = 1; i < unitLen; i += 1) {
              const nextUnit = column.units[(valueIndex + diff * i + unitLen) % unitLen];
              if (nextUnit.disabled !== true) {
                column.onSelect(nextUnit.value);
                break;
              }
            }
          }
        }
      };
      // ======================== Render ========================
      function addColumnNode(condition, node, columnValue, units, onColumnSelect) {
        if (condition !== false) {
          columns.push({
            node: cloneElement(node, {
              prefixCls: columnPrefixCls,
              value: columnValue,
              active: activeColumnIndex === columns.length,
              onSelect: onColumnSelect,
              units,
              hideDisabledOptions
            }),
            onSelect: onColumnSelect,
            value: columnValue,
            units
          });
        }
      }
      // Hour
      addColumnNode(showHour, _createVNode(TimeUnitColumn, {
        "key": "hour"
      }, null), hour.value, hours.value, num => {
        onSelect(setTime(isPM.value, num, minute.value, second.value), 'mouse');
      });
      // Minute
      addColumnNode(showMinute, _createVNode(TimeUnitColumn, {
        "key": "minute"
      }, null), minute.value, minutes.value, num => {
        onSelect(setTime(isPM.value, hour.value, num, second.value), 'mouse');
      });
      // Second
      addColumnNode(showSecond, _createVNode(TimeUnitColumn, {
        "key": "second"
      }, null), second.value, seconds.value, num => {
        onSelect(setTime(isPM.value, hour.value, minute.value, num), 'mouse');
      });
      // 12 Hours
      let PMIndex = -1;
      if (typeof isPM.value === 'boolean') {
        PMIndex = isPM.value ? 1 : 0;
      }
      addColumnNode(use12Hours === true, _createVNode(TimeUnitColumn, {
        "key": "12hours"
      }, null), PMIndex, [{
        label: 'AM',
        value: 0,
        disabled: AMPMDisabled.value[0]
      }, {
        label: 'PM',
        value: 1,
        disabled: AMPMDisabled.value[1]
      }], num => {
        onSelect(setTime(!!num, hour.value, minute.value, second.value), 'mouse');
      });
      return _createVNode("div", {
        "class": contentPrefixCls
      }, [columns.map(_ref2 => {
        let {
          node
        } = _ref2;
        return node;
      })]);
    };
  }
});
export default TimeBody;