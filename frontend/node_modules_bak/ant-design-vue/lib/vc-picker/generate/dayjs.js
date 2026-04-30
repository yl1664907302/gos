"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _dayjs = _interopRequireDefault(require("dayjs"));
var _weekday = _interopRequireDefault(require("dayjs/plugin/weekday"));
var _localeData = _interopRequireDefault(require("dayjs/plugin/localeData"));
var _weekOfYear = _interopRequireDefault(require("dayjs/plugin/weekOfYear"));
var _weekYear = _interopRequireDefault(require("dayjs/plugin/weekYear"));
var _quarterOfYear = _interopRequireDefault(require("dayjs/plugin/quarterOfYear"));
var _advancedFormat = _interopRequireDefault(require("dayjs/plugin/advancedFormat"));
var _customParseFormat = _interopRequireDefault(require("dayjs/plugin/customParseFormat"));
var _warning = require("../../vc-util/warning");
_dayjs.default.extend(_customParseFormat.default);
_dayjs.default.extend(_advancedFormat.default);
_dayjs.default.extend(_weekday.default);
_dayjs.default.extend(_localeData.default);
_dayjs.default.extend(_weekOfYear.default);
_dayjs.default.extend(_weekYear.default);
_dayjs.default.extend(_quarterOfYear.default);
_dayjs.default.extend((_o, c) => {
  // todo support Wo (ISO week)
  const proto = c.prototype;
  const oldFormat = proto.format;
  proto.format = function f(formatStr) {
    const str = (formatStr || '').replace('Wo', 'wo');
    return oldFormat.bind(this)(str);
  };
});
const localeMap = {
  // ar_EG:
  // az_AZ:
  // bg_BG:
  bn_BD: 'bn-bd',
  by_BY: 'be',
  // ca_ES:
  // cs_CZ:
  // da_DK:
  // de_DE:
  // el_GR:
  en_GB: 'en-gb',
  en_US: 'en',
  // es_ES:
  // et_EE:
  // fa_IR:
  // fi_FI:
  fr_BE: 'fr',
  fr_CA: 'fr-ca',
  // fr_FR:
  // ga_IE:
  // gl_ES:
  // he_IL:
  // hi_IN:
  // hr_HR:
  // hu_HU:
  hy_AM: 'hy-am',
  // id_ID:
  // is_IS:
  // it_IT:
  // ja_JP:
  // ka_GE:
  // kk_KZ:
  // km_KH:
  kmr_IQ: 'ku',
  // kn_IN:
  // ko_KR:
  // ku_IQ: // previous ku in antd
  // lt_LT:
  // lv_LV:
  // mk_MK:
  // ml_IN:
  // mn_MN:
  // ms_MY:
  // nb_NO:
  // ne_NP:
  nl_BE: 'nl-be',
  // nl_NL:
  // pl_PL:
  pt_BR: 'pt-br',
  // pt_PT:
  // ro_RO:
  // ru_RU:
  // sk_SK:
  // sl_SI:
  // sr_RS:
  // sv_SE:
  // ta_IN:
  // th_TH:
  // tr_TR:
  // uk_UA:
  // ur_PK:
  // vi_VN:
  zh_CN: 'zh-cn',
  zh_HK: 'zh-hk',
  zh_TW: 'zh-tw'
};
const parseLocale = locale => {
  const mapLocale = localeMap[locale];
  return mapLocale || locale.split('_')[0];
};
const parseNoMatchNotice = () => {
  /* istanbul ignore next */
  (0, _warning.noteOnce)(false, 'Not match any format. Please help to fire a issue about this.');
};
const advancedFormatRegex = /\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|k{1,2}|S/g;
function findTargetStr(val, index, segmentation) {
  const items = [...new Set(val.split(segmentation))];
  let idx = 0;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    idx += item.length;
    if (idx > index) {
      return item;
    }
    idx += segmentation.length;
  }
}
const toDateWithValueFormat = (val, valueFormat) => {
  if (!val) return null;
  if (_dayjs.default.isDayjs(val)) {
    return val;
  }
  const matchs = valueFormat.matchAll(advancedFormatRegex);
  let baseDate = (0, _dayjs.default)(val, valueFormat);
  if (matchs === null) {
    return baseDate;
  }
  for (const match of matchs) {
    const origin = match[0];
    const index = match['index'];
    if (origin === 'Q') {
      const segmentation = val.slice(index - 1, index);
      const quarterStr = findTargetStr(val, index, segmentation).match(/\d+/)[0];
      baseDate = baseDate.quarter(parseInt(quarterStr));
    }
    if (origin.toLowerCase() === 'wo') {
      const segmentation = val.slice(index - 1, index);
      const weekStr = findTargetStr(val, index, segmentation).match(/\d+/)[0];
      baseDate = baseDate.week(parseInt(weekStr));
    }
    if (origin.toLowerCase() === 'ww') {
      baseDate = baseDate.week(parseInt(val.slice(index, index + origin.length)));
    }
    if (origin.toLowerCase() === 'w') {
      baseDate = baseDate.week(parseInt(val.slice(index, index + origin.length + 1)));
    }
  }
  return baseDate;
};
const generateConfig = {
  // get
  getNow: () => (0, _dayjs.default)(),
  getFixedDate: string => (0, _dayjs.default)(string, ['YYYY-M-DD', 'YYYY-MM-DD']),
  getEndDate: date => date.endOf('month'),
  getWeekDay: date => {
    const clone = date.locale('en');
    return clone.weekday() + clone.localeData().firstDayOfWeek();
  },
  getYear: date => date.year(),
  getMonth: date => date.month(),
  getDate: date => date.date(),
  getHour: date => date.hour(),
  getMinute: date => date.minute(),
  getSecond: date => date.second(),
  // set
  addYear: (date, diff) => date.add(diff, 'year'),
  addMonth: (date, diff) => date.add(diff, 'month'),
  addDate: (date, diff) => date.add(diff, 'day'),
  setYear: (date, year) => date.year(year),
  setMonth: (date, month) => date.month(month),
  setDate: (date, num) => date.date(num),
  setHour: (date, hour) => date.hour(hour),
  setMinute: (date, minute) => date.minute(minute),
  setSecond: (date, second) => date.second(second),
  // Compare
  isAfter: (date1, date2) => date1.isAfter(date2),
  isValidate: date => date.isValid(),
  locale: {
    getWeekFirstDay: locale => (0, _dayjs.default)().locale(parseLocale(locale)).localeData().firstDayOfWeek(),
    getWeekFirstDate: (locale, date) => date.locale(parseLocale(locale)).weekday(0),
    getWeek: (locale, date) => date.locale(parseLocale(locale)).week(),
    getShortWeekDays: locale => (0, _dayjs.default)().locale(parseLocale(locale)).localeData().weekdaysMin(),
    getShortMonths: locale => (0, _dayjs.default)().locale(parseLocale(locale)).localeData().monthsShort(),
    format: (locale, date, format) => date.locale(parseLocale(locale)).format(format),
    parse: (locale, text, formats) => {
      const localeStr = parseLocale(locale);
      for (let i = 0; i < formats.length; i += 1) {
        const format = formats[i];
        const formatText = text;
        if (format.includes('wo') || format.includes('Wo')) {
          // parse Wo
          const year = formatText.split('-')[0];
          const weekStr = formatText.split('-')[1];
          const firstWeek = (0, _dayjs.default)(year, 'YYYY').startOf('year').locale(localeStr);
          for (let j = 0; j <= 52; j += 1) {
            const nextWeek = firstWeek.add(j, 'week');
            if (nextWeek.format('Wo') === weekStr) {
              return nextWeek;
            }
          }
          parseNoMatchNotice();
          return null;
        }
        const date = (0, _dayjs.default)(formatText, format, true).locale(localeStr);
        if (date.isValid()) {
          return date;
        }
      }
      if (!text) {
        parseNoMatchNotice();
      }
      return null;
    }
  },
  toDate: (value, valueFormat) => {
    if (Array.isArray(value)) {
      return value.map(val => toDateWithValueFormat(val, valueFormat));
    } else {
      return toDateWithValueFormat(value, valueFormat);
    }
  },
  toString: (value, valueFormat) => {
    if (Array.isArray(value)) {
      return value.map(val => _dayjs.default.isDayjs(val) ? val.format(valueFormat) : val);
    } else {
      return _dayjs.default.isDayjs(value) ? value.format(valueFormat) : value;
    }
  }
};
var _default = exports.default = generateConfig;