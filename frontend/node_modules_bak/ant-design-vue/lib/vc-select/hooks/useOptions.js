"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useOptions;
var _vue = require("vue");
var _legacyUtil = require("../utils/legacyUtil");
/**
 * Parse `children` to `options` if `options` is not provided.
 * Then flatten the `options`.
 */
function useOptions(options, children, fieldNames) {
  const mergedOptions = (0, _vue.shallowRef)();
  const valueOptions = (0, _vue.shallowRef)();
  const labelOptions = (0, _vue.shallowRef)();
  const tempMergedOptions = (0, _vue.shallowRef)([]);
  (0, _vue.watch)([options, children], () => {
    if (options.value) {
      tempMergedOptions.value = (0, _vue.toRaw)(options.value).slice();
    } else {
      tempMergedOptions.value = (0, _legacyUtil.convertChildrenToData)(children.value);
    }
  }, {
    immediate: true,
    deep: true
  });
  (0, _vue.watchEffect)(() => {
    const newOptions = tempMergedOptions.value;
    const newValueOptions = new Map();
    const newLabelOptions = new Map();
    const fieldNamesValue = fieldNames.value;
    function dig(optionList) {
      let isChildren = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      // for loop to speed up collection speed
      for (let i = 0; i < optionList.length; i += 1) {
        const option = optionList[i];
        if (!option[fieldNamesValue.options] || isChildren) {
          newValueOptions.set(option[fieldNamesValue.value], option);
          newLabelOptions.set(option[fieldNamesValue.label], option);
        } else {
          dig(option[fieldNamesValue.options], true);
        }
      }
    }
    dig(newOptions);
    mergedOptions.value = newOptions;
    valueOptions.value = newValueOptions;
    labelOptions.value = newLabelOptions;
  });
  return {
    options: mergedOptions,
    valueOptions,
    labelOptions
  };
}