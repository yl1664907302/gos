"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useHeights;
var _vue = require("vue");
var _raf = _interopRequireDefault(require("../../_util/raf"));
function useHeights(mergedData, getKey, onItemAdd, onItemRemove) {
  const instance = new Map();
  const heights = new Map();
  const updatedMark = (0, _vue.ref)(Symbol('update'));
  (0, _vue.watch)(mergedData, () => {
    updatedMark.value = Symbol('update');
  });
  let collectRaf = undefined;
  function cancelRaf() {
    _raf.default.cancel(collectRaf);
  }
  function collectHeight() {
    cancelRaf();
    collectRaf = (0, _raf.default)(() => {
      instance.forEach((element, key) => {
        if (element && element.offsetParent) {
          const {
            offsetHeight
          } = element;
          if (heights.get(key) !== offsetHeight) {
            //changed = true;
            updatedMark.value = Symbol('update');
            heights.set(key, element.offsetHeight);
          }
        }
      });
    });
  }
  function setInstance(item, ins) {
    const key = getKey(item);
    const origin = instance.get(key);
    if (ins) {
      instance.set(key, ins.$el || ins);
      collectHeight();
    } else {
      instance.delete(key);
    }
    // Instance changed
    if (!origin !== !ins) {
      if (ins) {
        onItemAdd === null || onItemAdd === void 0 ? void 0 : onItemAdd(item);
      } else {
        onItemRemove === null || onItemRemove === void 0 ? void 0 : onItemRemove(item);
      }
    }
  }
  (0, _vue.onUnmounted)(() => {
    cancelRaf();
  });
  return [setInstance, collectHeight, heights, updatedMark];
}