import _extends from "@babel/runtime/helpers/esm/extends";
import CalendarLocale from '../../vc-picker/locale/is_IS';
import TimePickerLocale from '../../time-picker/locale/is_IS';
// Merge into a locale object
const locale = {
  lang: _extends({
    placeholder: 'Veldu dag',
    rangePlaceholder: ['Upphafsdagur', 'Lokadagur']
  }, CalendarLocale),
  timePickerLocale: _extends({}, TimePickerLocale)
};
// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json
export default locale;