import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import Select from '../select';
import { Group, Button } from '../radio';
import { defineComponent, ref } from 'vue';
import { FormItemInputContext } from '../form/FormItemContext';
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
  return _createVNode(Select, {
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
  return _createVNode(Select, {
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
  return _createVNode(Group, {
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
    default: () => [_createVNode(Button, {
      "value": "month"
    }, {
      default: () => [locale.month]
    }), _createVNode(Button, {
      "value": "year"
    }, {
      default: () => [locale.year]
    })]
  });
}
ModeSwitch.inheritAttrs = false;
export default defineComponent({
  name: 'CalendarHeader',
  inheritAttrs: false,
  props: ['mode', 'prefixCls', 'value', 'validRange', 'generateConfig', 'locale', 'mode', 'fullscreen'],
  setup(_props, _ref2) {
    let {
      attrs
    } = _ref2;
    const divRef = ref(null);
    const formItemInputContext = FormItemInputContext.useInject();
    FormItemInputContext.useProvide(formItemInputContext, {
      isFormItemInput: false
    });
    return () => {
      const props = _extends(_extends({}, _props), attrs);
      const {
        prefixCls,
        fullscreen,
        mode,
        onChange,
        onModeChange
      } = props;
      const sharedProps = _extends(_extends({}, props), {
        fullscreen,
        divRef
      });
      return _createVNode("div", {
        "class": `${prefixCls}-header`,
        "ref": divRef
      }, [_createVNode(YearSelect, _objectSpread(_objectSpread({}, sharedProps), {}, {
        "onChange": v => {
          onChange(v, 'year');
        }
      }), null), mode === 'month' && _createVNode(MonthSelect, _objectSpread(_objectSpread({}, sharedProps), {}, {
        "onChange": v => {
          onChange(v, 'month');
        }
      }), null), _createVNode(ModeSwitch, _objectSpread(_objectSpread({}, sharedProps), {}, {
        "onModeChange": onModeChange
      }), null)]);
    };
  }
});