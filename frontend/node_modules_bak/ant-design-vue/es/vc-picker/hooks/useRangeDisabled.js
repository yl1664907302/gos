import { getValue } from '../utils/miscUtil';
import { isSameDate, getQuarter } from '../utils/dateUtil';
import { computed } from 'vue';
export default function useRangeDisabled(_ref, openRecordsRef) {
  let {
    picker,
    locale,
    selectedValue,
    disabledDate,
    disabled,
    generateConfig
  } = _ref;
  const startDate = computed(() => getValue(selectedValue.value, 0));
  const endDate = computed(() => getValue(selectedValue.value, 1));
  function weekFirstDate(date) {
    return generateConfig.value.locale.getWeekFirstDate(locale.value.locale, date);
  }
  function monthNumber(date) {
    const year = generateConfig.value.getYear(date);
    const month = generateConfig.value.getMonth(date);
    return year * 100 + month;
  }
  function quarterNumber(date) {
    const year = generateConfig.value.getYear(date);
    const quarter = getQuarter(generateConfig.value, date);
    return year * 10 + quarter;
  }
  const disabledStartDate = date => {
    var _a;
    if (disabledDate && ((_a = disabledDate === null || disabledDate === void 0 ? void 0 : disabledDate.value) === null || _a === void 0 ? void 0 : _a.call(disabledDate, date))) {
      return true;
    }
    // Disabled range
    if (disabled[1] && endDate) {
      return !isSameDate(generateConfig.value, date, endDate.value) && generateConfig.value.isAfter(date, endDate.value);
    }
    // Disabled part
    if (openRecordsRef.value[1] && endDate.value) {
      switch (picker.value) {
        case 'quarter':
          return quarterNumber(date) > quarterNumber(endDate.value);
        case 'month':
          return monthNumber(date) > monthNumber(endDate.value);
        case 'week':
          return weekFirstDate(date) > weekFirstDate(endDate.value);
        default:
          return !isSameDate(generateConfig.value, date, endDate.value) && generateConfig.value.isAfter(date, endDate.value);
      }
    }
    return false;
  };
  const disabledEndDate = date => {
    var _a;
    if ((_a = disabledDate.value) === null || _a === void 0 ? void 0 : _a.call(disabledDate, date)) {
      return true;
    }
    // Disabled range
    if (disabled[0] && startDate) {
      return !isSameDate(generateConfig.value, date, endDate.value) && generateConfig.value.isAfter(startDate.value, date);
    }
    // Disabled part
    if (openRecordsRef.value[0] && startDate.value) {
      switch (picker.value) {
        case 'quarter':
          return quarterNumber(date) < quarterNumber(startDate.value);
        case 'month':
          return monthNumber(date) < monthNumber(startDate.value);
        case 'week':
          return weekFirstDate(date) < weekFirstDate(startDate.value);
        default:
          return !isSameDate(generateConfig.value, date, startDate.value) && generateConfig.value.isAfter(startDate.value, date);
      }
    }
    return false;
  };
  return [disabledStartDate, disabledEndDate];
}