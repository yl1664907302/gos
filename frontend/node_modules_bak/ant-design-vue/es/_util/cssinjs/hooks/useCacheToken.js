import _extends from "@babel/runtime/helpers/esm/extends";
import hash from '@emotion/hash';
import { ATTR_TOKEN, CSS_IN_JS_INSTANCE, useStyleInject } from '../StyleContext';
import useGlobalCache from './useGlobalCache';
import { flattenToken, token2key } from '../util';
import { ref, computed } from 'vue';
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
    const styles = document.querySelectorAll(`style[${ATTR_TOKEN}="${key}"]`);
    styles.forEach(style => {
      var _a;
      if (style[CSS_IN_JS_INSTANCE] === instanceId) {
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
export const getComputedToken = (originToken, overrideToken, theme, format) => {
  const derivativeToken = theme.getDerivativeToken(originToken);
  // Merge with override
  let mergedDerivativeToken = _extends(_extends({}, derivativeToken), overrideToken);
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
export default function useCacheToken(theme, tokens) {
  let option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ref({});
  const style = useStyleInject();
  // Basic - We do basic cache here
  const mergedToken = computed(() => _extends({}, ...tokens.value));
  const tokenStr = computed(() => flattenToken(mergedToken.value));
  const overrideTokenStr = computed(() => flattenToken(option.value.override || EMPTY_OVERRIDE));
  const cachedToken = useGlobalCache('token', computed(() => [option.value.salt || '', theme.value.id, tokenStr.value, overrideTokenStr.value]), () => {
    const {
      salt = '',
      override = EMPTY_OVERRIDE,
      formatToken,
      getComputedToken: compute
    } = option.value;
    const mergedDerivativeToken = compute ? compute(mergedToken.value, override, theme.value) : getComputedToken(mergedToken.value, override, theme.value, formatToken);
    // Optimize for `useStyleRegister` performance
    const tokenKey = token2key(mergedDerivativeToken, salt);
    mergedDerivativeToken._tokenKey = tokenKey;
    recordCleanToken(tokenKey);
    const hashId = `${hashPrefix}-${hash(tokenKey)}`;
    mergedDerivativeToken._hashId = hashId; // Not used
    return [mergedDerivativeToken, hashId];
  }, cache => {
    var _a;
    // Remove token will remove all related style
    cleanTokenStyle(cache[0]._tokenKey, (_a = style.value) === null || _a === void 0 ? void 0 : _a.cache.instanceId);
  });
  return cachedToken;
}