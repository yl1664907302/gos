// https://stackoverflow.com/questions/46176165/ways-to-get-string-literal-type-of-array-values-without-enum-overhead
export const tuple = function () {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return args;
};
export const tupleNum = function () {
  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }
  return args;
};
export const withInstall = comp => {
  const c = comp;
  c.install = function (app) {
    app.component(c.displayName || c.name, comp);
  };
  return comp;
};
export function eventType() {
  return {
    type: [Function, Array]
  };
}
export function objectType(defaultVal) {
  return {
    type: Object,
    default: defaultVal
  };
}
export function booleanType(defaultVal) {
  return {
    type: Boolean,
    default: defaultVal
  };
}
export function functionType(defaultVal) {
  return {
    type: Function,
    default: defaultVal
  };
}
export function anyType(defaultVal, required) {
  const type = {
    validator: () => true,
    default: defaultVal
  };
  return required ? type : type;
}
export function vNodeType() {
  return {
    validator: () => true
  };
}
export function arrayType(defaultVal) {
  return {
    type: Array,
    default: defaultVal
  };
}
export function stringType(defaultVal) {
  return {
    type: String,
    default: defaultVal
  };
}
export function someType(types, defaultVal) {
  return types ? {
    type: types,
    default: defaultVal
  } : anyType(defaultVal);
}