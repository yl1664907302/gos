"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useSearchConfig;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vue = require("vue");
var _warning = require("../../vc-util/warning");
// Convert `showSearch` to unique config
function useSearchConfig(showSearch) {
  const mergedShowSearch = (0, _vue.shallowRef)(false);
  const mergedSearchConfig = (0, _vue.ref)({});
  (0, _vue.watchEffect)(() => {
    if (!showSearch.value) {
      mergedShowSearch.value = false;
      mergedSearchConfig.value = {};
      return;
    }
    let searchConfig = {
      matchInputWidth: true,
      limit: 50
    };
    if (showSearch.value && typeof showSearch.value === 'object') {
      searchConfig = (0, _extends2.default)((0, _extends2.default)({}, searchConfig), showSearch.value);
    }
    if (searchConfig.limit <= 0) {
      delete searchConfig.limit;
      if (process.env.NODE_ENV !== 'production') {
        (0, _warning.warning)(false, "'limit' of showSearch should be positive number or false.");
      }
    }
    mergedShowSearch.value = true;
    mergedSearchConfig.value = searchConfig;
    return;
  });
  return {
    showSearch: mergedShowSearch,
    searchConfig: mergedSearchConfig
  };
}