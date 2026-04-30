"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useMemo;
var _vue = require("vue");
function useMemo(getValue, condition, shouldUpdate) {
  const cacheRef = (0, _vue.ref)(getValue());
  (0, _vue.watch)(condition, (next, pre) => {
    if (shouldUpdate) {
      if (shouldUpdate(next, pre)) {
        cacheRef.value = getValue();
      }
    } else {
      cacheRef.value = getValue();
    }
  });
  return cacheRef;
}