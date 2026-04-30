"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useState;
var _vue = require("vue");
function useState(defaultStateValue) {
  const initValue = typeof defaultStateValue === 'function' ? defaultStateValue() : defaultStateValue;
  const innerValue = (0, _vue.ref)(initValue);
  function triggerChange(newValue) {
    innerValue.value = newValue;
  }
  return [innerValue, triggerChange];
}