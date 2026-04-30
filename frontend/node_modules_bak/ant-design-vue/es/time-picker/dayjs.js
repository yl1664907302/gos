import _extends from "@babel/runtime/helpers/esm/extends";
import createTimePicker from './time-picker';
import dayjsGenerateConfig from '../vc-picker/generate/dayjs';
const {
  TimePicker,
  TimeRangePicker
} = createTimePicker(dayjsGenerateConfig);
/* istanbul ignore next */
export { TimePicker, TimeRangePicker };
export default _extends(TimePicker, {
  TimePicker,
  TimeRangePicker,
  install: app => {
    app.component(TimePicker.name, TimePicker);
    app.component(TimeRangePicker.name, TimeRangePicker);
    return app;
  }
});