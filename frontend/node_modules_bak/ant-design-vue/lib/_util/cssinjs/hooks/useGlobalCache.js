"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useClientCache;
var _StyleContext = require("../StyleContext");
var _useHMR = _interopRequireDefault(require("./useHMR"));
var _vue = require("vue");
function useClientCache(prefix, keyPath, cacheFn, onCacheRemove) {
  const styleContext = (0, _StyleContext.useStyleInject)();
  const fullPathStr = (0, _vue.shallowRef)('');
  const res = (0, _vue.shallowRef)();
  (0, _vue.watchEffect)(() => {
    fullPathStr.value = [prefix, ...keyPath.value].join('%');
  });
  const HMRUpdate = (0, _useHMR.default)();
  const clearCache = pathStr => {
    styleContext.value.cache.update(pathStr, prevCache => {
      const [times = 0, cache] = prevCache || [];
      const nextCount = times - 1;
      if (nextCount === 0) {
        onCacheRemove === null || onCacheRemove === void 0 ? void 0 : onCacheRemove(cache, false);
        return null;
      }
      return [times - 1, cache];
    });
  };
  (0, _vue.watch)(fullPathStr, (newStr, oldStr) => {
    if (oldStr) clearCache(oldStr);
    // Create cache
    styleContext.value.cache.update(newStr, prevCache => {
      const [times = 0, cache] = prevCache || [];
      // HMR should always ignore cache since developer may change it
      let tmpCache = cache;
      if (process.env.NODE_ENV !== 'production' && cache && HMRUpdate) {
        onCacheRemove === null || onCacheRemove === void 0 ? void 0 : onCacheRemove(tmpCache, HMRUpdate);
        tmpCache = null;
      }
      const mergedCache = tmpCache || cacheFn();
      return [times + 1, mergedCache];
    });
    res.value = styleContext.value.cache.get(fullPathStr.value)[1];
  }, {
    immediate: true
  });
  (0, _vue.onBeforeUnmount)(() => {
    clearCache(fullPathStr.value);
  });
  return res;
}