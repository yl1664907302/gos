export function leftPad(str, length) {
  let fill = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '0';
  let current = String(str);
  while (current.length < length) {
    current = `${fill}${str}`;
  }
  return current;
}
export const tuple = function () {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return args;
};
export function toArray(val) {
  if (val === null || val === undefined) {
    return [];
  }
  return Array.isArray(val) ? val : [val];
}
export default function getDataOrAriaProps(props) {
  const retProps = {};
  Object.keys(props).forEach(key => {
    if ((key.startsWith('data-') || key.startsWith('aria-') || key === 'role' || key === 'name') && !key.startsWith('data-__')) {
      retProps[key] = props[key];
    }
  });
  return retProps;
}
export function getValue(values, index) {
  return values ? values[index] : null;
}
export function updateValues(values, value, index) {
  const newValues = [getValue(values, 0), getValue(values, 1)];
  newValues[index] = typeof value === 'function' ? value(newValues[index]) : value;
  if (!newValues[0] && !newValues[1]) {
    return null;
  }
  return newValues;
}