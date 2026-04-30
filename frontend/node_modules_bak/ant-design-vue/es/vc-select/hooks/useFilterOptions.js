import _extends from "@babel/runtime/helpers/esm/extends";
import { toArray } from '../utils/commonUtil';
import { injectPropsWithOption } from '../utils/valueUtil';
import { computed } from 'vue';
function includes(test, search) {
  return toArray(test).join('').toUpperCase().includes(search);
}
export default ((options, fieldNames, searchValue, filterOption, optionFilterProp) => computed(() => {
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
  const wrapOption = customizeFilter ? opt => injectPropsWithOption(opt) : opt => opt;
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
          filteredOptions.push(_extends(_extends({}, item), {
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
}));