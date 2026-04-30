"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _select = _interopRequireDefault(require("../select"));
var _radio = require("../radio");
var _FormItemContext = require("../form/FormItemContext");
const YearSelectOffset = 10;
const YearSelectTotal = 20;
function YearSelect(props) {
  const {
    fullscreen,
    validRange,
    generateConfig,
    locale,
    prefixCls,
    value,
    onChange,
    divRef
  } = props;
  const year = generateConfig.getYear(value || generateConfig.getNow());
  let start = year - YearSelectOffset;
  let end = start + YearSelectTotal;
  if (validRange) {
    start = generateConfig.getYear(validRange[0]);
    end = generateConfig.getYear(validRange[1]) + 1;
  }
  const suffix = locale && locale.year === '年' ? '年' : '';
  const options = [];
  for (let index = start; index < end; index++) {
    options.push({
      label: `${index}${suffix}`,
      value: index
    });
  }
  return (0, _vue.createVNode)(_select.default, {
    "size": fullscreen ? undefined : 'small',
    "options": options,
    "value": year,
    "class": `${prefixCls}-year-select`,
    "onChange": numYear => {
      let newDate = generateConfig.setYear(value, numYear);
      if (validRange) {
        const [startDate, endDate] = validRange;
        const newYear = generateConfig.getYear(newDate);
        const newMonth = generateConfig.getMonth(newDate);
        if (newYear === generateConfig.getYear(endDate) && newMonth > generateConfig.getMonth(endDate)) {
          newDate = generateConfig.setMonth(newDate, generateConfig.getMonth(endDate));
        }
        if (newYear === generateConfig.getYear(startDate) && newMonth < generateConfig.getMonth(startDate)) {
          newDate = generateConfig.setMonth(newDate, generateConfig.getMonth(startDate));
        }
      }
      onChange(newDate);
    },
    "getPopupContainer": () => divRef.value
  }, null);
}
YearSelect.inheritAttrs = false;
function MonthSelect(props) {
  const {
    prefixCls,
    fullscreen,
    validRange,
    value,
    generateConfig,
    locale,
    onChange,
    divRef
  } = props;
  const month = generateConfig.getMonth(value || generateConfig.getNow());
  let start = 0;
  let end = 11;
  if (validRange) {
    const [rangeStart, rangeEnd] = validRange;
    const currentYear = generateConfig.getYear(value);
    if (generateConfig.getYear(rangeEnd) === currentYear) {
      end = generateConfig.getMonth(rangeEnd);
    }
    if (generateConfig.getYear(rangeStart) === currentYear) {
      start = generateConfig.getMonth(rangeStart);
    }
  }
  const months = locale.shortMonths || generateConfig.locale.getShortMonths(locale.locale);
  const options = [];
  for (let index = start; index <= end; index += 1) {
    options.push({
      label: months[index],
      value: index
    });
  }
  return (0, _vue.createVNode)(_select.default, {
    "size": fullscreen ? undefined : 'small',
    "class": `${prefixCls}-month-select`,
    "value": month,
    "options": options,
    "onChange": newMonth => {
      onChange(generateConfig.setMonth(value, newMonth));
    },
    "getPopupContainer": () => divRef.value
  }, null);
}
MonthSelect.inheritAttrs = false;
function ModeSwitch(props) {
  const {
    prefixCls,
    locale,
    mode,
    fullscreen,
    onModeChange
  } = props;
  return (0, _vue.createVNode)(_radio.Group, {
    "onChange": _ref => {
      let {
        target: {
          value
        }
      } = _ref;
      onModeChange(value);
    },
    "value": mode,
    "size": fullscreen ? undefined : 'small',
    "class": `${prefixCls}-mode-switch`
  }, {
    default: () => [(0, _vue.createVNode)(_radio.Button, {
      "value": "month"
    }, {
      default: () => [locale.month]
    }), (0, _vue.createVNode)(_radio.Button, {
      "value": "year"
    }, {
      default: () => [locale.year]
    })]
  });
}
ModeSwitch.inheritAttrs = false;
var _default = exports.default = (0, _vue.defineComponent)({
  name: 'CalendarHeader',
  inheritAttrs: false,
  props: ['mode', 'prefixCls', 'value', 'validRange', 'generateConfig', 'locale', 'mode', 'fullscreen'],
  setup(_props, _ref2) {
    let {
      attrs
    } = _ref2;
    const divRef = (0, _vue.ref)(null);
    const formItemInputContext = _FormItemContext.FormItemInputContext.useInject();
    _FormItemContext.FormItemInputContext.useProvide(formItemInputContext, {
      isFormItemInput: false
    });
    return () => {
      const props = (0, _extends2.default)((0, _extends2.default)({}, _props), attrs);
      const {
        prefixCls,
        fullscreen,
        mode,
        onChange,
        onModeChange
      } = props;
      const sharedProps = (0, _extends2.default)((0, _extends2.default)({}, props), {
        fullscreen,
        divRef
      });
      return (0, _vue.createVNode)("div", {
        "class": `${prefixCls}-header`,
        "ref": divRef
      }, [(0, _vue.createVNode)(YearSelect, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, sharedProps), {}, {
        "onChange": v => {
          onChange(v, 'year');
        }
      }), null), mode === 'month' && (0, _vue.createVNode)(MonthSelect, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, sharedProps), {}, {
        "onChange": v => {
          onChange(v, 'month');
        }
      }), null), (0, _vue.createVNode)(ModeSwitch, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, sharedProps), {}, {
        "onModeChange": onModeChange
      }), null)]);
    };
  }
});