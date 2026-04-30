"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WEEK_DAY_COUNT = void 0;
exports.formatValue = formatValue;
exports.getCellDateDisabled = getCellDateDisabled;
exports.getClosingViewDate = getClosingViewDate;
exports.getQuarter = getQuarter;
exports.getWeekStartDate = getWeekStartDate;
exports.isEqual = isEqual;
exports.isInRange = isInRange;
exports.isNullEqual = isNullEqual;
exports.isSameDate = isSameDate;
exports.isSameDecade = isSameDecade;
exports.isSameMonth = isSameMonth;
exports.isSameQuarter = isSameQuarter;
exports.isSameTime = isSameTime;
exports.isSameWeek = isSameWeek;
exports.isSameYear = isSameYear;
exports.parseValue = parseValue;
var _index = require("../panels/DecadePanel/index");
const WEEK_DAY_COUNT = exports.WEEK_DAY_COUNT = 7;
function isNullEqual(value1, value2) {
  if (!value1 && !value2) {
    return true;
  }
  if (!value1 || !value2) {
    return false;
  }
  return undefined;
}
function isSameDecade(generateConfig, decade1, decade2) {
  const equal = isNullEqual(decade1, decade2);
  if (typeof equal === 'boolean') {
    return equal;
  }
  const num1 = Math.floor(generateConfig.getYear(decade1) / 10);
  const num2 = Math.floor(generateConfig.getYear(decade2) / 10);
  return num1 === num2;
}
function isSameYear(generateConfig, year1, year2) {
  const equal = isNullEqual(year1, year2);
  if (typeof equal === 'boolean') {
    return equal;
  }
  return generateConfig.getYear(year1) === generateConfig.getYear(year2);
}
function getQuarter(generateConfig, date) {
  const quota = Math.floor(generateConfig.getMonth(date) / 3);
  return quota + 1;
}
function isSameQuarter(generateConfig, quarter1, quarter2) {
  const equal = isNullEqual(quarter1, quarter2);
  if (typeof equal === 'boolean') {
    return equal;
  }
  return isSameYear(generateConfig, quarter1, quarter2) && getQuarter(generateConfig, quarter1) === getQuarter(generateConfig, quarter2);
}
function isSameMonth(generateConfig, month1, month2) {
  const equal = isNullEqual(month1, month2);
  if (typeof equal === 'boolean') {
    return equal;
  }
  return isSameYear(generateConfig, month1, month2) && generateConfig.getMonth(month1) === generateConfig.getMonth(month2);
}
function isSameDate(generateConfig, date1, date2) {
  const equal = isNullEqual(date1, date2);
  if (typeof equal === 'boolean') {
    return equal;
  }
  return generateConfig.getYear(date1) === generateConfig.getYear(date2) && generateConfig.getMonth(date1) === generateConfig.getMonth(date2) && generateConfig.getDate(date1) === generateConfig.getDate(date2);
}
function isSameTime(generateConfig, time1, time2) {
  const equal = isNullEqual(time1, time2);
  if (typeof equal === 'boolean') {
    return equal;
  }
  return generateConfig.getHour(time1) === generateConfig.getHour(time2) && generateConfig.getMinute(time1) === generateConfig.getMinute(time2) && generateConfig.getSecond(time1) === generateConfig.getSecond(time2);
}
function isSameWeek(generateConfig, locale, date1, date2) {
  const equal = isNullEqual(date1, date2);
  if (typeof equal === 'boolean') {
    return equal;
  }
  return generateConfig.locale.getWeek(locale, date1) === generateConfig.locale.getWeek(locale, date2);
}
function isEqual(generateConfig, value1, value2) {
  return isSameDate(generateConfig, value1, value2) && isSameTime(generateConfig, value1, value2);
}
/** Between in date but not equal of date */
function isInRange(generateConfig, startDate, endDate, current) {
  if (!startDate || !endDate || !current) {
    return false;
  }
  return !isSameDate(generateConfig, startDate, current) && !isSameDate(generateConfig, endDate, current) && generateConfig.isAfter(current, startDate) && generateConfig.isAfter(endDate, current);
}
function getWeekStartDate(locale, generateConfig, value) {
  const weekFirstDay = generateConfig.locale.getWeekFirstDay(locale);
  const monthStartDate = generateConfig.setDate(value, 1);
  const startDateWeekDay = generateConfig.getWeekDay(monthStartDate);
  let alignStartDate = generateConfig.addDate(monthStartDate, weekFirstDay - startDateWeekDay);
  if (generateConfig.getMonth(alignStartDate) === generateConfig.getMonth(value) && generateConfig.getDate(alignStartDate) > 1) {
    alignStartDate = generateConfig.addDate(alignStartDate, -7);
  }
  return alignStartDate;
}
function getClosingViewDate(viewDate, picker, generateConfig) {
  let offset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  switch (picker) {
    case 'year':
      return generateConfig.addYear(viewDate, offset * 10);
    case 'quarter':
    case 'month':
      return generateConfig.addYear(viewDate, offset);
    default:
      return generateConfig.addMonth(viewDate, offset);
  }
}
function formatValue(value, _ref) {
  let {
    generateConfig,
    locale,
    format
  } = _ref;
  return typeof format === 'function' ? format(value) : generateConfig.locale.format(locale.locale, value, format);
}
function parseValue(value, _ref2) {
  let {
    generateConfig,
    locale,
    formatList
  } = _ref2;
  if (!value || typeof formatList[0] === 'function') {
    return null;
  }
  return generateConfig.locale.parse(locale.locale, value, formatList);
}
// eslint-disable-next-line consistent-return
function getCellDateDisabled(_ref3) {
  let {
    cellDate,
    mode,
    disabledDate,
    generateConfig
  } = _ref3;
  if (!disabledDate) return false;
  // Whether cellDate is disabled in range
  const getDisabledFromRange = (currentMode, start, end) => {
    let current = start;
    while (current <= end) {
      let date;
      switch (currentMode) {
        case 'date':
          {
            date = generateConfig.setDate(cellDate, current);
            if (!disabledDate(date)) {
              return false;
            }
            break;
          }
        case 'month':
          {
            date = generateConfig.setMonth(cellDate, current);
            if (!getCellDateDisabled({
              cellDate: date,
              mode: 'month',
              generateConfig,
              disabledDate
            })) {
              return false;
            }
            break;
          }
        case 'year':
          {
            date = generateConfig.setYear(cellDate, current);
            if (!getCellDateDisabled({
              cellDate: date,
              mode: 'year',
              generateConfig,
              disabledDate
            })) {
              return false;
            }
            break;
          }
      }
      current += 1;
    }
    return true;
  };
  switch (mode) {
    case 'date':
    case 'week':
      {
        return disabledDate(cellDate);
      }
    case 'month':
      {
        const startDate = 1;
        const endDate = generateConfig.getDate(generateConfig.getEndDate(cellDate));
        return getDisabledFromRange('date', startDate, endDate);
      }
    case 'quarter':
      {
        const startMonth = Math.floor(generateConfig.getMonth(cellDate) / 3) * 3;
        const endMonth = startMonth + 2;
        return getDisabledFromRange('month', startMonth, endMonth);
      }
    case 'year':
      {
        return getDisabledFromRange('month', 0, 11);
      }
    case 'decade':
      {
        const year = generateConfig.getYear(cellDate);
        const startYear = Math.floor(year / _index.DECADE_UNIT_DIFF) * _index.DECADE_UNIT_DIFF;
        const endYear = startYear + _index.DECADE_UNIT_DIFF - 1;
        return getDisabledFromRange('year', startYear, endYear);
      }
  }
}