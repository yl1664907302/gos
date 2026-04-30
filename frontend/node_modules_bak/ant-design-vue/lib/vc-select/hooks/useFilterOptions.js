"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _commonUtil = require("../utils/commonUtil");
var _valueUtil = require("../utils/valueUtil");
var _vue = require("vue");
function includes(test, search) {
  return (0, _commonUtil.toArray)(test).join('').toUpperCase().includes(search);
}
var _default = (options, fieldNames, searchValue, filterOption, optionFilterProp) => (0, _vue.computed)(() => {
  const searchValueVal = searchValue.value;
  const optionFilterPropValue = optionFilterProp === null || optionFilterProp === void 0 ? void 0 : optionFilterProp.value;
  const filterOptionValue = filterOption === null || filterOption === void 0 ? void 0 : filterOption.value;
  if (!searchValueVal || filterOptionValue === false) {
    return options.value;
  }
  const {
    options: fieldOptions,
    label: fieldLabel,
    value: fieldValue
  } = fieldNames.value;
  const filteredOptions = [];
  const customizeFilter = typeof filterOptionValue === 'function';
  const upperSearch = searchValueVal.toUpperCase();
  const filterFunc = customizeFilter ? filterOptionValue : (_, option) => {
    // Use provided `optionFilterProp`
    if (optionFilterPropValue) {
      return includes(option[optionFilterPropValue], upperSearch);
    }
    // Auto select `label` or `value` by option type
    if (option[fieldOptions]) {
      // hack `fieldLabel` since `OptionGroup` children is not `label`
      return includes(option[fieldLabel !== 'children' ? fieldLabel : 'label'], upperSearch);
    }
    return includes(option[fieldValue], upperSearch);
  };
  const wrapOption = customizeFilter ? opt => (0, _valueUtil.injectPropsWithOption)(opt) : opt => opt;
  options.value.forEach(item => {
    // Group should check child options
    if (item[fieldOptions]) {
      // Check group first
      const matchGroup = filterFunc(searchValueVal, wrapOption(item));
      if (matchGroup) {
        filteredOptions.push(item);
      } else {
        // Check option
        const subOptions = item[fieldOptions].filter(subItem => filterFunc(searchValueVal, wrapOption(subItem)));
        if (subOptions.length) {
          filteredOptions.push((0, _extends2.default)((0, _extends2.default)({}, item), {
            [fieldOptions]: subOptions
          }));
        }
      }
      return;
    }
    if (filterFunc(searchValueVal, wrapOption(item))) {
      filteredOptions.push(item);
    }
  });
  return filteredOptions;
});
exports.default = _default;