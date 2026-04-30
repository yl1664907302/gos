import _extends from "@babel/runtime/helpers/esm/extends";
import CalendarLocale from '../../vc-picker/locale/ca_ES';
import TimePickerLocale from '../../time-picker/locale/ca_ES';
// Merge into a locale object
const locale = {
  lang: _extends({
    placeholder: 'Seleccionar data',
    rangePlaceholder: ['Data inicial', 'Data final']
  }, CalendarLocale),
  timePickerLocale: _extends({}, TimePickerLocale)
};
// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json
export default locale;