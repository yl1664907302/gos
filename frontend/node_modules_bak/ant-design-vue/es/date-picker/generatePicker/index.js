import _extends from "@babel/runtime/helpers/esm/extends";
import PickerButton from '../PickerButton';
import PickerTag from '../PickerTag';
import generateSinglePicker from './generateSinglePicker';
import generateRangePicker from './generateRangePicker';
export * from './interface';
export const Components = {
  button: PickerButton,
  rangeItem: PickerTag
};
function toArray(list) {
  if (!list) {
    return [];
  }
  return Array.isArray(list) ? list : [list];
}
export function getTimeProps(props) {
  const {
    format,
    picker,
    showHour,
    showMinute,
    showSecond,
    use12Hours
  } = props;
  const firstFormat = toArray(format)[0];
  const showTimeObj = _extends({}, props);
  if (firstFormat && typeof firstFormat === 'string') {
    if (!firstFormat.includes('s') && showSecond === undefined) {
      showTimeObj.showSecond = false;
    }
    if (!firstFormat.includes('m') && showMinute === undefined) {
      showTimeObj.showMinute = false;
    }
    if (!firstFormat.includes('H') && !firstFormat.includes('h') && showHour === undefined) {
      showTimeObj.showHour = false;
    }
    if ((firstFormat.includes('a') || firstFormat.includes('A')) && use12Hours === undefined) {
      showTimeObj.use12Hours = true;
    }
  }
  if (picker === 'time') {
    return showTimeObj;
  }
  if (typeof firstFormat === 'function') {
    // format of showTime should use default when format is custom format function
    delete showTimeObj.format;
  }
  return {
    showTime: showTimeObj
  };
}
function generatePicker(generateConfig, extraProps) {
  // =========================== Picker ===========================
  const {
    DatePicker,
    WeekPicker,
    MonthPicker,
    YearPicker,
    TimePicker,
    QuarterPicker
  } = generateSinglePicker(generateConfig, extraProps);
  // ======================== Range Picker ========================
  const RangePicker = generateRangePicker(generateConfig, extraProps);
  return {
    DatePicker,
    WeekPicker,
    MonthPicker,
    YearPicker,
    TimePicker,
    QuarterPicker,
    RangePicker
  };
}
export default generatePicker;