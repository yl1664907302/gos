"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _styleChecker = require("../styleChecker");
var _default = () => {
  const flexible = (0, _vue.shallowRef)(false);
  (0, _vue.onMounted)(() => {
    flexible.value = (0, _styleChecker.detectFlexGapSupported)();
  });
  return flexible;
};
exports.default = _default;