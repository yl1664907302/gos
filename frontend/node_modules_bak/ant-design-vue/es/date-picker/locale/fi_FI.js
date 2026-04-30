import _extends from "@babel/runtime/helpers/esm/extends";
import CalendarLocale from '../../vc-picker/locale/fi_FI';
import TimePickerLocale from '../../time-picker/locale/fi_FI';
// Merge into a locale object
const locale = {
  lang: _extends({
    placeholder: 'Valitse päivä',
    rangePlaceholder: ['Alkamispäivä', 'Päättymispäivä']
  }, CalendarLocale),
  timePickerLocale: _extends({}, TimePickerLocale)
};
// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json
export default locale;