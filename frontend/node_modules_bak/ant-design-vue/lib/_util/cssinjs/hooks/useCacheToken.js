"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useCacheToken;
exports.getComputedToken = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _hash = _interopRequireDefault(require("@emotion/hash"));
var _StyleContext = require("../StyleContext");
var _useGlobalCache = _interopRequireDefault(require("./useGlobalCache"));
var _util = require("../util");
var _vue = require("vue");
const EMPTY_OVERRIDE = {};
const isProduction = process.env.NODE_ENV === 'production';
// nuxt generate when NODE_ENV is prerender
const isPrerender = process.env.NODE_ENV === 'prerender';
// Generate different prefix to make user selector break in production env.
// This helps developer not to do style override directly on the hash id.
const hashPrefix = !isProduction && !isPrerender ? 'css-dev-only-do-not-override' : 'css';
const tokenKeys = new Map();
function recordCleanToken(tokenKey) {
  tokenKeys.set(tokenKey, (tokenKeys.get(tokenKey) || 0) + 1);
}
function removeStyleTags(key, instanceId) {
  if (typeof document !== 'undefined') {
    const styles = document.querySelectorAll(`style[${_StyleContext.ATTR_TOKEN}="${key}"]`);
    styles.forEach(style => {
      var _a;
      if (style[_StyleContext.CSS_IN_JS_INSTANCE] === instanceId) {
        (_a = style.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(style);
      }
    });
  }
}
const TOKEN_THRESHOLD = 0;
// Remove will check current keys first
function cleanTokenStyle(tokenKey, instanceId) {
  tokenKeys.set(tokenKey, (tokenKeys.get(tokenKey) || 0) - 1);
  const tokenKeyList = Array.from(tokenKeys.keys());
  const cleanableKeyList = tokenKeyList.filter(key => {
    const count = tokenKeys.get(key) || 0;
    return count <= 0;
  });
  // Should keep tokens under threshold for not to insert style too often
  if (tokenKeyList.length - cleanableKeyList.length > TOKEN_THRESHOLD) {
    cleanableKeyList.forEach(key => {
      removeStyleTags(key, instanceId);
      tokenKeys.delete(key);
    });
  }
}
const getComputedToken = (originToken, overrideToken, theme, format) => {
  const derivativeToken = theme.getDerivativeToken(originToken);
  // Merge with override
  let mergedDerivativeToken = (0, _extends2.default)((0, _extends2.default)({}, derivativeToken), overrideToken);
  // Format if needed
  if (format) {
    mergedDerivativeToken = format(mergedDerivativeToken);
  }
  return mergedDerivativeToken;
};
/**
 * Cache theme derivative token as global shared one
 * @param theme Theme entity
 * @param tokens List of tokens, used for cache. Please do not dynamic generate object directly
 * @param option Additional config
 * @returns Call Theme.getDerivativeToken(tokenObject) to get token
 */
exports.getComputedToken = getComputedToken;
function useCacheToken(theme, tokens) {
  let option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : (0, _vue.ref)({});
  const style = (0, _StyleContext.useStyleInject)();
  // Basic - We do basic cache here
  const mergedToken = (0, _vue.computed)(() => (0, _extends2.default)({}, ...tokens.value));
  const tokenStr = (0, _vue.computed)(() => (0, _util.flattenToken)(mergedToken.value));
  const overrideTokenStr = (0, _vue.computed)(() => (0, _util.flattenToken)(option.value.override || EMPTY_OVERRIDE));
  const cachedToken = (0, _useGlobalCache.default)('token', (0, _vue.computed)(() => [option.value.salt || '', theme.value.id, tokenStr.value, overrideTokenStr.value]), () => {
    const {
      salt = '',
      override = EMPTY_OVERRIDE,
      formatToken,
      getComputedToken: compute
    } = option.value;
    const mergedDerivativeToken = compute ? compute(mergedToken.value, override, theme.value) : getComputedToken(mergedToken.value, override, theme.value, formatToken);
    // Optimize for `useStyleRegister` performance
    const tokenKey = (0, _util.token2key)(mergedDerivativeToken, salt);
    mergedDerivativeToken._tokenKey = tokenKey;
    recordCleanToken(tokenKey);
    const hashId = `${hashPrefix}-${(0, _hash.default)(tokenKey)}`;
    mergedDerivativeToken._hashId = hashId; // Not used
    return [mergedDerivativeToken, hashId];
  }, cache => {
    var _a;
    // Remove token will remove all related style
    cleanTokenStyle(cache[0]._tokenKey, (_a = style.value) === null || _a === void 0 ? void 0 : _a.cache.instanceId);
  });
  return cachedToken;
}