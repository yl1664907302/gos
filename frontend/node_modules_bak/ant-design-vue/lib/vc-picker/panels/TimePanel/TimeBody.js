"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _TimeUnitColumn = _interopRequireDefault(require("./TimeUnitColumn"));
var _miscUtil = require("../../utils/miscUtil");
var _timeUtil = require("../../utils/timeUtil");
var _vnode = require("../../../_util/vnode");
function generateUnits(start, end, step, disabledUnits) {
  const units = [];
  for (let i = start; i <= end; i += step) {
    units.push({
      label: (0, _miscUtil.leftPad)(i, 2),
      value: i,
      disabled: (disabledUnits || []).includes(i)
    });
  }
  return units;
}
const TimeBody = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'TimeBody',
  inheritAttrs: false,
  props: ['generateConfig', 'prefixCls', 'operationRef', 'activeColumnIndex', 'value', 'showHour', 'showMinute', 'showSecond', 'use12Hours', 'hourStep', 'minuteStep', 'secondStep', 'disabledHours', 'disabledMinutes', 'disabledSeconds', 'disabledTime', 'hideDisabledOptions', 'onSelect'],
  setup(props) {
    const originHour = (0, _vue.computed)(() => props.value ? props.generateConfig.getHour(props.value) : -1);
    const isPM = (0, _vue.computed)(() => {
      if (props.use12Hours) {
        return originHour.value >= 12; // -1 means should display AM
      } else {
        return false;
      }
    });
    const hour = (0, _vue.computed)(() => {
      // Should additional logic to handle 12 hours
      if (props.use12Hours) {
        return originHour.value % 12;
      } else {
        return originHour.value;
      }
    });
    const minute = (0, _vue.computed)(() => props.value ? props.generateConfig.getMinute(props.value) : -1);
    const second = (0, _vue.computed)(() => props.value ? props.generateConfig.getSecond(props.value) : -1);
    const now = (0, _vue.ref)(props.generateConfig.getNow());
    const mergedDisabledHours = (0, _vue.ref)();
    const mergedDisabledMinutes = (0, _vue.ref)();
    const mergedDisabledSeconds = (0, _vue.ref)();
    (0, _vue.onBeforeUpdate)(() => {
      now.value = props.generateConfig.getNow();
    });
    (0, _vue.watchEffect)(() => {
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
      newDate = (0, _timeUtil.setTime)(props.generateConfig, newDate, !props.use12Hours || !isNewPM ? mergedHour : mergedHour + 12, mergedMinute, mergedSecond);
      return newDate;
    };
    // ========================= Unit =========================
    const rawHours = (0, _vue.computed)(() => {
      var _a;
      return generateUnits(0, 23, (_a = props.hourStep) !== null && _a !== void 0 ? _a : 1, mergedDisabledHours.value && mergedDisabledHours.value());
    });
    // const memorizedRawHours = useMemo(() => rawHours, rawHours, shouldUnitsUpdate);
    const AMPMDisabled = (0, _vue.computed)(() => {
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
    const hours = (0, _vue.computed)(() => {
      if (!props.use12Hours) return rawHours.value;
      return rawHours.value.filter(isPM.value ? hourMeta => hourMeta.value >= 12 : hourMeta => hourMeta.value < 12).map(hourMeta => {
        const hourValue = hourMeta.value % 12;
        const hourLabel = hourValue === 0 ? '12' : (0, _miscUtil.leftPad)(hourValue, 2);
        return (0, _extends2.default)((0, _extends2.default)({}, hourMeta), {
          label: hourLabel,
          value: hourValue
        });
      });
    });
    const minutes = (0, _vue.computed)(() => {
      var _a;
      return generateUnits(0, 59, (_a = props.minuteStep) !== null && _a !== void 0 ? _a : 1, mergedDisabledMinutes.value && mergedDisabledMinutes.value(originHour.value));
    });
    const seconds = (0, _vue.computed)(() => {
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
            node: (0, _vnode.cloneElement)(node, {
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
      addColumnNode(showHour, (0, _vue.createVNode)(_TimeUnitColumn.default, {
        "key": "hour"
      }, null), hour.value, hours.value, num => {
        onSelect(setTime(isPM.value, num, minute.value, second.value), 'mouse');
      });
      // Minute
      addColumnNode(showMinute, (0, _vue.createVNode)(_TimeUnitColumn.default, {
        "key": "minute"
      }, null), minute.value, minutes.value, num => {
        onSelect(setTime(isPM.value, hour.value, num, second.value), 'mouse');
      });
      // Second
      addColumnNode(showSecond, (0, _vue.createVNode)(_TimeUnitColumn.default, {
        "key": "second"
      }, null), second.value, seconds.value, num => {
        onSelect(setTime(isPM.value, hour.value, minute.value, num), 'mouse');
      });
      // 12 Hours
      let PMIndex = -1;
      if (typeof isPM.value === 'boolean') {
        PMIndex = isPM.value ? 1 : 0;
      }
      addColumnNode(use12Hours === true, (0, _vue.createVNode)(_TimeUnitColumn.default, {
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
      return (0, _vue.createVNode)("div", {
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
var _default = exports.default = TimeBody;