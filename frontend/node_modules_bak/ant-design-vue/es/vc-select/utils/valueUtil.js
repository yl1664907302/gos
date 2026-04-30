import _extends from "@babel/runtime/helpers/esm/extends";
import { warning } from '../../vc-util/warning';
function getKey(data, index) {
  const {
    key
  } = data;
  let value;
  if ('value' in data) {
    ({
      value
    } = data);
  }
  if (key !== null && key !== undefined) {
    return key;
  }
  if (value !== undefined) {
    return value;
  }
  return `rc-index-key-${index}`;
}
export function fillFieldNames(fieldNames, childrenAsData) {
  const {
    label,
    value,
    options
  } = fieldNames || {};
  return {
    label: label || (childrenAsData ? 'children' : 'label'),
    value: value || 'value',
    options: options || 'options'
  };
}
/**
 * Flat options into flatten list.
 * We use `optionOnly` here is aim to avoid user use nested option group.
 * Here is simply set `key` to the index if not provided.
 */
export function flattenOptions(options) {
  let {
    fieldNames,
    childrenAsData
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const flattenList = [];
  const {
    label: fieldLabel,
    value: fieldValue,
    options: fieldOptions
  } = fillFieldNames(fieldNames, false);
  function dig(list, isGroupOption) {
    list.forEach(data => {
      const label = data[fieldLabel];
      if (isGroupOption || !(fieldOptions in data)) {
        const value = data[fieldValue];
        // Option
        flattenList.push({
          key: getKey(data, flattenList.length),
          groupOption: isGroupOption,
          data,
          label,
          value
        });
      } else {
        let grpLabel = label;
        if (grpLabel === undefined && childrenAsData) {
          grpLabel = data.label;
        }
        // Option Group
        flattenList.push({
          key: getKey(data, flattenList.length),
          group: true,
          data,
          label: grpLabel
        });
        dig(data[fieldOptions], true);
      }
    });
  }
  dig(options, false);
  return flattenList;
}
/**
 * Inject `props` into `option` for legacy usage
 */
export function injectPropsWithOption(option) {
  const newOption = _extends({}, option);
  if (!('props' in newOption)) {
    Object.defineProperty(newOption, 'props', {
      get() {
        warning(false, 'Return type is option instead of Option instance. Please read value directly instead of reading from `props`.');
        return newOption;
      }
    });
  }
  return newOption;
}
export function getSeparatedContent(text, tokens) {
  if (!tokens || !tokens.length) {
    return null;
  }
  let match = false;
  function separate(str, _ref) {
    let [token, ...restTokens] = _ref;
    if (!token) {
      return [str];
    }
    const list = str.split(token);
    match = match || list.length > 1;
    return list.reduce((prevList, unitStr) => [...prevList, ...separate(unitStr, restTokens)], []).filter(unit => unit);
  }
  const list = separate(text, tokens);
  return match ? list : null;
}