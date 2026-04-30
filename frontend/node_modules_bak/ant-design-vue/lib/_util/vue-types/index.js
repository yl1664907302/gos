"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.withUndefined = withUndefined;
var _vueTypes = require("vue-types");
const PropTypes = (0, _vueTypes.createTypes)({
  func: undefined,
  bool: undefined,
  string: undefined,
  number: undefined,
  array: undefined,
  object: undefined,
  integer: undefined
});
PropTypes.extend([{
  name: 'looseBool',
  getter: true,
  type: Boolean,
  default: undefined
}, {
  name: 'style',
  getter: true,
  type: [String, Object],
  default: undefined
}, {
  name: 'VueNode',
  getter: true,
  type: null
}]);
function withUndefined(type) {
  type.default = undefined;
  return type;
}
var _default = exports.default = PropTypes;