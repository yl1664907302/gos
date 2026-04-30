import { getValue, updateValues } from '../utils/miscUtil';
import { getClosingViewDate, isSameYear, isSameMonth, isSameDecade } from '../utils/dateUtil';
import { watchEffect, computed, ref } from 'vue';
function getStartEndDistance(startDate, endDate, picker, generateConfig) {
  const startNext = getClosingViewDate(startDate, picker, generateConfig, 1);
  function getDistance(compareFunc) {
    if (compareFunc(startDate, endDate)) {
      return 'same';
    }
    if (compareFunc(startNext, endDate)) {
      return 'closing';
    }
    return 'far';
  }
  switch (picker) {
    case 'year':
      return getDistance((start, end) => isSameDecade(generateConfig, start, end));
    case 'quarter':
    case 'month':
      return getDistance((start, end) => isSameYear(generateConfig, start, end));
    default:
      return getDistance((start, end) => isSameMonth(generateConfig, start, end));
  }
}
function getRangeViewDate(values, index, picker, generateConfig) {
  const startDate = getValue(values, 0);
  const endDate = getValue(values, 1);
  if (index === 0) {
    return startDate;
  }
  if (startDate && endDate) {
    const distance = getStartEndDistance(startDate, endDate, picker, generateConfig);
    switch (distance) {
      case 'same':
        return startDate;
      case 'closing':
        return startDate;
      default:
        return getClosingViewDate(endDate, picker, generateConfig, -1);
    }
  }
  return startDate;
}
export default function useRangeViewDates(_ref) {
  let {
    values,
    picker,
    defaultDates,
    generateConfig
  } = _ref;
  const defaultViewDates = ref([getValue(defaultDates, 0), getValue(defaultDates, 1)]);
  const viewDates = ref(null);
  const startDate = computed(() => getValue(values.value, 0));
  const endDate = computed(() => getValue(values.value, 1));
  const getViewDate = index => {
    // If set default view date, use it
    if (defaultViewDates.value[index]) {
      return defaultViewDates.value[index];
    }
    return getValue(viewDates.value, index) || getRangeViewDate(values.value, index, picker.value, generateConfig.value) || startDate.value || endDate.value || generateConfig.value.getNow();
  };
  const startViewDate = ref(null);
  const endViewDate = ref(null);
  watchEffect(() => {
    startViewDate.value = getViewDate(0);
    endViewDate.value = getViewDate(1);
  });
  function setViewDate(viewDate, index) {
    if (viewDate) {
      let newViewDates = updateValues(viewDates.value, viewDate, index);
      // Set view date will clean up default one
      // Should always be an array
      defaultViewDates.value = updateValues(defaultViewDates.value, null, index) || [null, null];
      // Reset another one when not have value
      const anotherIndex = (index + 1) % 2;
      if (!getValue(values.value, anotherIndex)) {
        newViewDates = updateValues(newViewDates, viewDate, anotherIndex);
      }
      viewDates.value = newViewDates;
    } else if (startDate.value || endDate.value) {
      // Reset all when has values when `viewDate` is `null` which means from open trigger
      viewDates.value = null;
    }
  }
  return [startViewDate, endViewDate, setViewDate];
}