import _extends from "@babel/runtime/helpers/esm/extends";
import hash from '@emotion/hash';
// @ts-ignore
import unitless from '@emotion/unitless';
import { compile, serialize, stringify } from 'stylis';
import { contentQuotesLinter, hashedAnimationLinter } from '../../linters';
import { useStyleInject, ATTR_CACHE_PATH, ATTR_MARK, ATTR_TOKEN, CSS_IN_JS_INSTANCE } from '../../StyleContext';
import { supportLayer } from '../../util';
import useGlobalCache from '../useGlobalCache';
import { removeCSS, updateCSS } from '../../../../vc-util/Dom/dynamicCSS';
import { computed } from 'vue';
import canUseDom from '../../../../_util/canUseDom';
import { ATTR_CACHE_MAP, existPath, getStyleAndHash, serialize as serializeCacheMap } from './cacheMapUtil';
const isClientSide = canUseDom();
const SKIP_CHECK = '_skip_check_';
const MULTI_VALUE = '_multi_value_';
// ============================================================================
// ==                                 Parser                                 ==
// ============================================================================
// Preprocessor style content to browser support one
export function normalizeStyle(styleStr) {
  const serialized = serialize(compile(styleStr), stringify);
  return serialized.replace(/\{%%%\:[^;];}/g, ';');
}
function isCompoundCSSProperty(value) {
  return typeof value === 'object' && value && (SKIP_CHECK in value || MULTI_VALUE in value);
}
// 注入 hash 值
function injectSelectorHash(key, hashId, hashPriority) {
  if (!hashId) {
    return key;
  }
  const hashClassName = `.${hashId}`;
  const hashSelector = hashPriority === 'low' ? `:where(${hashClassName})` : hashClassName;
  // 注入 hashId
  const keys = key.split(',').map(k => {
    var _a;
    const fullPath = k.trim().split(/\s+/);
    // 如果 Selector 第一个是 HTML Element，那我们就插到它的后面。反之，就插到最前面。
    let firstPath = fullPath[0] || '';
    const htmlElement = ((_a = firstPath.match(/^\w+/)) === null || _a === void 0 ? void 0 : _a[0]) || '';
    firstPath = `${htmlElement}${hashSelector}${firstPath.slice(htmlElement.length)}`;
    return [firstPath, ...fullPath.slice(1)].join(' ');
  });
  return keys.join(',');
}
// Global effect style will mount once and not removed
// The effect will not save in SSR cache (e.g. keyframes)
const globalEffectStyleKeys = new Set();
/**
 * @private Test only. Clear the global effect style keys.
 */
export const _cf = process.env.NODE_ENV !== 'production' ? () => globalEffectStyleKeys.clear() : undefined;
// Parse CSSObject to style content
export const parseStyle = function (interpolation) {
  let config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let {
    root,
    injectHash,
    parentSelectors
  } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    root: true,
    parentSelectors: []
  };
  const {
    hashId,
    layer,
    path,
    hashPriority,
    transformers = [],
    linters = []
  } = config;
  let styleStr = '';
  let effectStyle = {};
  function parseKeyframes(keyframes) {
    const animationName = keyframes.getName(hashId);
    if (!effectStyle[animationName]) {
      const [parsedStr] = parseStyle(keyframes.style, config, {
        root: false,
        parentSelectors
      });
      effectStyle[animationName] = `@keyframes ${keyframes.getName(hashId)}${parsedStr}`;
    }
  }
  function flattenList(list) {
    let fullList = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    list.forEach(item => {
      if (Array.isArray(item)) {
        flattenList(item, fullList);
      } else if (item) {
        fullList.push(item);
      }
    });
    return fullList;
  }
  const flattenStyleList = flattenList(Array.isArray(interpolation) ? interpolation : [interpolation]);
  flattenStyleList.forEach(originStyle => {
    // Only root level can use raw string
    const style = typeof originStyle === 'string' && !root ? {} : originStyle;
    if (typeof style === 'string') {
      styleStr += `${style}\n`;
    } else if (style._keyframe) {
      // Keyframe
      parseKeyframes(style);
    } else {
      const mergedStyle = transformers.reduce((prev, trans) => {
        var _a;
        return ((_a = trans === null || trans === void 0 ? void 0 : trans.visit) === null || _a === void 0 ? void 0 : _a.call(trans, prev)) || prev;
      }, style);
      // Normal CSSObject
      Object.keys(mergedStyle).forEach(key => {
        var _a;
        const value = mergedStyle[key];
        if (typeof value === 'object' && value && (key !== 'animationName' || !value._keyframe) && !isCompoundCSSProperty(value)) {
          let subInjectHash = false;
          // 当成嵌套对象来处理
          let mergedKey = key.trim();
          // Whether treat child as root. In most case it is false.
          let nextRoot = false;
          // 拆分多个选择器
          if ((root || injectHash) && hashId) {
            if (mergedKey.startsWith('@')) {
              // 略过媒体查询，交给子节点继续插入 hashId
              subInjectHash = true;
            } else {
              // 注入 hashId
              mergedKey = injectSelectorHash(key, hashId, hashPriority);
            }
          } else if (root && !hashId && (mergedKey === '&' || mergedKey === '')) {
            // In case of `{ '&': { a: { color: 'red' } } }` or `{ '': { a: { color: 'red' } } }` without hashId,
            // we will get `&{a:{color:red;}}` or `{a:{color:red;}}` string for stylis to compile.
            // But it does not conform to stylis syntax,
            // and finally we will get `{color:red;}` as css, which is wrong.
            // So we need to remove key in root, and treat child `{ a: { color: 'red' } }` as root.
            mergedKey = '';
            nextRoot = true;
          }
          const [parsedStr, childEffectStyle] = parseStyle(value, config, {
            root: nextRoot,
            injectHash: subInjectHash,
            parentSelectors: [...parentSelectors, mergedKey]
          });
          effectStyle = _extends(_extends({}, effectStyle), childEffectStyle);
          styleStr += `${mergedKey}${parsedStr}`;
        } else {
          function appendStyle(cssKey, cssValue) {
            if (process.env.NODE_ENV !== 'production' && (typeof value !== 'object' || !(value === null || value === void 0 ? void 0 : value[SKIP_CHECK]))) {
              [contentQuotesLinter, hashedAnimationLinter, ...linters].forEach(linter => linter(cssKey, cssValue, {
                path,
                hashId,
                parentSelectors
              }));
            }
            // 如果是样式则直接插入
            const styleName = cssKey.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
            // Auto suffix with px
            let formatValue = cssValue;
            if (!unitless[cssKey] && typeof formatValue === 'number' && formatValue !== 0) {
              formatValue = `${formatValue}px`;
            }
            // handle animationName & Keyframe value
            if (cssKey === 'animationName' && (cssValue === null || cssValue === void 0 ? void 0 : cssValue._keyframe)) {
              parseKeyframes(cssValue);
              formatValue = cssValue.getName(hashId);
            }
            styleStr += `${styleName}:${formatValue};`;
          }
          const actualValue = (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : value;
          if (typeof value === 'object' && (value === null || value === void 0 ? void 0 : value[MULTI_VALUE]) && Array.isArray(actualValue)) {
            actualValue.forEach(item => {
              appendStyle(key, item);
            });
          } else {
            appendStyle(key, actualValue);
          }
        }
      });
    }
  });
  if (!root) {
    styleStr = `{${styleStr}}`;
  } else if (layer && supportLayer()) {
    const layerCells = layer.split(',');
    const layerName = layerCells[layerCells.length - 1].trim();
    styleStr = `@layer ${layerName} {${styleStr}}`;
    // Order of layer if needed
    if (layerCells.length > 1) {
      // zombieJ: stylis do not support layer order, so we need to handle it manually.
      styleStr = `@layer ${layer}{%%%:%}${styleStr}`;
    }
  }
  return [styleStr, effectStyle];
};
// ============================================================================
// ==                                Register                                ==
// ============================================================================
function uniqueHash(path, styleStr) {
  return hash(`${path.join('%')}${styleStr}`);
}
// function Empty() {
//   return null;
// }
/**
 * Register a style to the global style sheet.
 */
export default function useStyleRegister(info, styleFn) {
  const styleContext = useStyleInject();
  const tokenKey = computed(() => info.value.token._tokenKey);
  const fullPath = computed(() => [tokenKey.value, ...info.value.path]);
  // Check if need insert style
  let isMergedClientSide = isClientSide;
  if (process.env.NODE_ENV !== 'production' && styleContext.value.mock !== undefined) {
    isMergedClientSide = styleContext.value.mock === 'client';
  }
  // const [cacheStyle[0], cacheStyle[1], cacheStyle[2]]
  useGlobalCache('style', fullPath,
  // Create cache if needed
  () => {
    const {
      path,
      hashId,
      layer,
      nonce,
      clientOnly,
      order = 0
    } = info.value;
    const cachePath = fullPath.value.join('|');
    // Get style from SSR inline style directly
    if (existPath(cachePath)) {
      const [inlineCacheStyleStr, styleHash] = getStyleAndHash(cachePath);
      if (inlineCacheStyleStr) {
        return [inlineCacheStyleStr, tokenKey.value, styleHash, {}, clientOnly, order];
      }
    }
    const styleObj = styleFn();
    const {
      hashPriority,
      container,
      transformers,
      linters,
      cache
    } = styleContext.value;
    const [parsedStyle, effectStyle] = parseStyle(styleObj, {
      hashId,
      hashPriority,
      layer,
      path: path.join('-'),
      transformers,
      linters
    });
    const styleStr = normalizeStyle(parsedStyle);
    const styleId = uniqueHash(fullPath.value, styleStr);
    if (isMergedClientSide) {
      const mergedCSSConfig = {
        mark: ATTR_MARK,
        prepend: 'queue',
        attachTo: container,
        priority: order
      };
      const nonceStr = typeof nonce === 'function' ? nonce() : nonce;
      if (nonceStr) {
        mergedCSSConfig.csp = {
          nonce: nonceStr
        };
      }
      const style = updateCSS(styleStr, styleId, mergedCSSConfig);
      style[CSS_IN_JS_INSTANCE] = cache.instanceId;
      // Used for `useCacheToken` to remove on batch when token removed
      style.setAttribute(ATTR_TOKEN, tokenKey.value);
      // Dev usage to find which cache path made this easily
      if (process.env.NODE_ENV !== 'production') {
        style.setAttribute(ATTR_CACHE_PATH, fullPath.value.join('|'));
      }
      // Inject client side effect style
      Object.keys(effectStyle).forEach(effectKey => {
        if (!globalEffectStyleKeys.has(effectKey)) {
          globalEffectStyleKeys.add(effectKey);
          // Inject
          updateCSS(normalizeStyle(effectStyle[effectKey]), `_effect-${effectKey}`, {
            mark: ATTR_MARK,
            prepend: 'queue',
            attachTo: container
          });
        }
      });
    }
    return [styleStr, tokenKey.value, styleId, effectStyle, clientOnly, order];
  },
  // Remove cache if no need
  (_ref, fromHMR) => {
    let [,, styleId] = _ref;
    if ((fromHMR || styleContext.value.autoClear) && isClientSide) {
      removeCSS(styleId, {
        mark: ATTR_MARK
      });
    }
  });
  return node => {
    return node;
    // let styleNode: VueNode;
    // if (!styleContext.ssrInline || isMergedClientSide || !styleContext.defaultCache) {
    //   styleNode = <Empty />;
    // } else {
    //   styleNode = (
    //     <style
    //       {...{
    //         [ATTR_TOKEN]: cacheStyle.value[1],
    //         [ATTR_MARK]: cacheStyle.value[2],
    //       }}
    //       innerHTML={cacheStyle.value[0]}
    //     />
    //   );
    // }
    // return (
    //   <>
    //     {styleNode}
    //     {node}
    //   </>
    // );
  };
}
// ============================================================================
// ==                                  SSR                                   ==
// ============================================================================
export function extractStyle(cache) {
  let plain = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  const matchPrefix = `style%`;
  // prefix with `style` is used for `useStyleRegister` to cache style context
  const styleKeys = Array.from(cache.cache.keys()).filter(key => key.startsWith(matchPrefix));
  // Common effect styles like animation
  const effectStyles = {};
  // Mapping of cachePath to style hash
  const cachePathMap = {};
  let styleText = '';
  function toStyleStr(style, tokenKey, styleId) {
    let customizeAttrs = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    const attrs = _extends(_extends({}, customizeAttrs), {
      [ATTR_TOKEN]: tokenKey,
      [ATTR_MARK]: styleId
    });
    const attrStr = Object.keys(attrs).map(attr => {
      const val = attrs[attr];
      return val ? `${attr}="${val}"` : null;
    }).filter(v => v).join(' ');
    return plain ? style : `<style ${attrStr}>${style}</style>`;
  }
  const orderStyles = styleKeys.map(key => {
    const cachePath = key.slice(matchPrefix.length).replace(/%/g, '|');
    const [styleStr, tokenKey, styleId, effectStyle, clientOnly, order] = cache.cache.get(key)[1];
    // Skip client only style
    if (clientOnly) {
      return null;
    }
    // ====================== Style ======================
    // Used for vc-util
    const sharedAttrs = {
      'data-vc-order': 'prependQueue',
      'data-vc-priority': `${order}`
    };
    let keyStyleText = toStyleStr(styleStr, tokenKey, styleId, sharedAttrs);
    // Save cache path with hash mapping
    cachePathMap[cachePath] = styleId;
    // =============== Create effect style ===============
    if (effectStyle) {
      Object.keys(effectStyle).forEach(effectKey => {
        // Effect style can be reused
        if (!effectStyles[effectKey]) {
          effectStyles[effectKey] = true;
          keyStyleText += toStyleStr(normalizeStyle(effectStyle[effectKey]), tokenKey, `_effect-${effectKey}`, sharedAttrs);
        }
      });
    }
    const ret = [order, keyStyleText];
    return ret;
  }).filter(o => o);
  orderStyles.sort((o1, o2) => o1[0] - o2[0]).forEach(_ref2 => {
    let [, style] = _ref2;
    styleText += style;
  });
  // ==================== Fill Cache Path ====================
  styleText += toStyleStr(`.${ATTR_CACHE_MAP}{content:"${serializeCacheMap(cachePathMap)}";}`, undefined, undefined, {
    [ATTR_CACHE_MAP]: ATTR_CACHE_MAP
  });
  return styleText;
}