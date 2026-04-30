import _extends from "@babel/runtime/helpers/esm/extends";
import momentGenerateConfig from '../vc-picker/generate/moment';
import generatePicker from './generatePicker';
const {
  DatePicker,
  WeekPicker,
  MonthPicker,
  YearPicker,
  TimePicker,
  QuarterPicker,
  RangePicker
} = generatePicker(momentGenerateConfig);
/* istanbul ignore next */
export { RangePicker, WeekPicker, MonthPicker, QuarterPicker };
export default _extends(DatePicker, {
  WeekPicker,
  MonthPicker,
  YearPicker,
  RangePicker,
  TimePicker,
  QuarterPicker,
  install: app => {
    app.component(DatePicker.name, DatePicker);
    app.component(RangePicker.name, RangePicker);
    app.component(MonthPicker.name, MonthPicker);
    app.component(WeekPicker.name, WeekPicker);
    app.component(QuarterPicker.name, QuarterPicker);
    return app;
  }
});