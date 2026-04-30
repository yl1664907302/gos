import _extends from "@babel/runtime/helpers/esm/extends";
import { computed } from 'vue';
export const SEARCH_MARK = '__rc_cascader_search_mark__';
const defaultFilter = (search, options, _ref) => {
  let {
    label
  } = _ref;
  return options.some(opt => String(opt[label]).toLowerCase().includes(search.toLowerCase()));
};
const defaultRender = _ref2 => {
  let {
    path,
    fieldNames
  } = _ref2;
  return path.map(opt => opt[fieldNames.label]).join(' / ');
};
export default ((search, options, fieldNames, prefixCls, config, changeOnSelect) => {
  return computed(() => {
    const {
      filter = defaultFilter,
      render = defaultRender,
      limit = 50,
      sort
    } = config.value;
    const filteredOptions = [];
    if (!search.value) {
      return [];
    }
    function dig(list, pathOptions) {
      list.forEach(option => {
        // Perf saving when `sort` is disabled and `limit` is provided
        if (!sort && limit > 0 && filteredOptions.length >= limit) {
          return;
        }
        const connectedPathOptions = [...pathOptions, option];
        const children = option[fieldNames.value.children];
        // If current option is filterable
        if (
        // If is leaf option
        !children || children.length === 0 ||
        // If is changeOnSelect
        changeOnSelect.value) {
          if (filter(search.value, connectedPathOptions, {
            label: fieldNames.value.label
          })) {
            filteredOptions.push(_extends(_extends({}, option), {
              [fieldNames.value.label]: render({
                inputValue: search.value,
                path: connectedPathOptions,
                prefixCls: prefixCls.value,
                fieldNames: fieldNames.value
              }),
              [SEARCH_MARK]: connectedPathOptions
            }));
          }
        }
        if (children) {
          dig(option[fieldNames.value.children], connectedPathOptions);
        }
      });
    }
    dig(options.value, []);
    // Do sort
    if (sort) {
      filteredOptions.sort((a, b) => {
        return sort(a[SEARCH_MARK], b[SEARCH_MARK], search.value, fieldNames.value);
      });
    }
    return limit > 0 ? filteredOptions.slice(0, limit) : filteredOptions;
  });
});