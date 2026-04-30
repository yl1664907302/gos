import _extends from "@babel/runtime/helpers/esm/extends";
import CalendarLocale from '../../vc-picker/locale/de_DE';
import TimePickerLocale from '../../time-picker/locale/de_DE';
// Merge into a locale object
const locale = {
  lang: _extends({
    placeholder: 'Datum auswählen',
    rangePlaceholder: ['Startdatum', 'Enddatum']
  }, CalendarLocale),
  timePickerLocale: _extends({}, TimePickerLocale)
};
// All settings at:
// https://github.com/ant-design/ant-design/issues/424
export default locale;