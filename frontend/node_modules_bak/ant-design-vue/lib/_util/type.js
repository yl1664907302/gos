"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.anyType = anyType;
exports.arrayType = arrayType;
exports.booleanType = booleanType;
exports.eventType = eventType;
exports.functionType = functionType;
exports.objectType = objectType;
exports.someType = someType;
exports.stringType = stringType;
exports.tupleNum = exports.tuple = void 0;
exports.vNodeType = vNodeType;
exports.withInstall = void 0;
// https://stackoverflow.com/questions/46176165/ways-to-get-string-literal-type-of-array-values-without-enum-overhead
const tuple = function () {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return args;
};
exports.tuple = tuple;
const tupleNum = function () {
  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }
  return args;
};
exports.tupleNum = tupleNum;
const withInstall = comp => {
  const c = comp;
  c.install = function (app) {
    app.component(c.displayName || c.name, comp);
  };
  return comp;
};
exports.withInstall = withInstall;
function eventType() {
  return {
    type: [Function, Array]
  };
}
function objectType(defaultVal) {
  return {
    type: Object,
    default: defaultVal
  };
}
function booleanType(defaultVal) {
  return {
    type: Boolean,
    default: defaultVal
  };
}
function functionType(defaultVal) {
  return {
    type: Function,
    default: defaultVal
  };
}
function anyType(defaultVal, required) {
  const type = {
    validator: () => true,
    default: defaultVal
  };
  return required ? type : type;
}
function vNodeType() {
  return {
    validator: () => true
  };
}
function arrayType(defaultVal) {
  return {
    type: Array,
    default: defaultVal
  };
}
function stringType(defaultVal) {
  return {
    type: String,
    default: defaultVal
  };
}
function someType(types, defaultVal) {
  return types ? {
    type: types,
    default: defaultVal
  } : anyType(defaultVal);
}