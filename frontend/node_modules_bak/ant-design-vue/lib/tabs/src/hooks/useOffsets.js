"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useOffsets;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vue = require("vue");
const DEFAULT_SIZE = {
  width: 0,
  height: 0,
  left: 0,
  top: 0
};
function useOffsets(tabs, tabSizes) {
  const offsetMap = (0, _vue.ref)(new Map());
  (0, _vue.watchEffect)(() => {
    var _a, _b;
    const map = new Map();
    const tabsValue = tabs.value;
    const lastOffset = tabSizes.value.get((_a = tabsValue[0]) === null || _a === void 0 ? void 0 : _a.key) || DEFAULT_SIZE;
    const rightOffset = lastOffset.left + lastOffset.width;
    for (let i = 0; i < tabsValue.length; i += 1) {
      const {
        key
      } = tabsValue[i];
      let data = tabSizes.value.get(key);
      // Reuse last one when not exist yet
      if (!data) {
        data = tabSizes.value.get((_b = tabsValue[i - 1]) === null || _b === void 0 ? void 0 : _b.key) || DEFAULT_SIZE;
      }
      const entity = map.get(key) || (0, _extends2.default)({}, data);
      // Right
      entity.right = rightOffset - entity.left - entity.width;
      // Update entity
      map.set(key, entity);
    }
    offsetMap.value = new Map(map);
  });
  return offsetMap;
}