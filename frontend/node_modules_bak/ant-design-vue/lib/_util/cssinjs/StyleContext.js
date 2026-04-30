"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StyleProvider = exports.CSS_IN_JS_INSTANCE = exports.ATTR_TOKEN = exports.ATTR_MARK = exports.ATTR_CACHE_PATH = void 0;
exports.createCache = createCache;
exports.useStyleProvider = exports.useStyleInject = exports.styleProviderProps = exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vue = require("vue");
var _Cache = _interopRequireDefault(require("./Cache"));
var _type = require("../type");
const ATTR_TOKEN = exports.ATTR_TOKEN = 'data-token-hash';
const ATTR_MARK = exports.ATTR_MARK = 'data-css-hash';
const ATTR_CACHE_PATH = exports.ATTR_CACHE_PATH = 'data-cache-path';
// Mark css-in-js instance in style element
const CSS_IN_JS_INSTANCE = exports.CSS_IN_JS_INSTANCE = '__cssinjs_instance__';
function createCache() {
  const cssinjsInstanceId = Math.random().toString(12).slice(2);
  // Tricky SSR: Move all inline style to the head.
  // PS: We do not recommend tricky mode.
  if (typeof document !== 'undefined' && document.head && document.body) {
    const styles = document.body.querySelectorAll(`style[${ATTR_MARK}]`) || [];
    const {
      firstChild
    } = document.head;
    Array.from(styles).forEach(style => {
      style[CSS_IN_JS_INSTANCE] = style[CSS_IN_JS_INSTANCE] || cssinjsInstanceId;
      // Not force move if no head
      // Not force move if no head
      if (style[CSS_IN_JS_INSTANCE] === cssinjsInstanceId) {
        document.head.insertBefore(style, firstChild);
      }
    });
    // Deduplicate of moved styles
    const styleHash = {};
    Array.from(document.querySelectorAll(`style[${ATTR_MARK}]`)).forEach(style => {
      var _a;
      const hash = style.getAttribute(ATTR_MARK);
      if (styleHash[hash]) {
        if (style[CSS_IN_JS_INSTANCE] === cssinjsInstanceId) {
          (_a = style.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(style);
        }
      } else {
        styleHash[hash] = true;
      }
    });
  }
  return new _Cache.default(cssinjsInstanceId);
}
const StyleContextKey = Symbol('StyleContextKey');
// fix: https://github.com/vueComponent/ant-design-vue/issues/7023
const getCache = () => {
  var _a, _b, _c;
  const instance = (0, _vue.getCurrentInstance)();
  let cache;
  if (instance && instance.appContext) {
    const globalCache = (_c = (_b = (_a = instance.appContext) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.globalProperties) === null || _c === void 0 ? void 0 : _c.__ANTDV_CSSINJS_CACHE__;
    if (globalCache) {
      cache = globalCache;
    } else {
      cache = createCache();
      if (instance.appContext.config.globalProperties) {
        instance.appContext.config.globalProperties.__ANTDV_CSSINJS_CACHE__ = cache;
      }
    }
  } else {
    cache = createCache();
  }
  return cache;
};
const defaultStyleContext = {
  cache: createCache(),
  defaultCache: true,
  hashPriority: 'low'
};
// fix: https://github.com/vueComponent/ant-design-vue/issues/6912
const useStyleInject = () => {
  const cache = getCache();
  return (0, _vue.inject)(StyleContextKey, (0, _vue.shallowRef)((0, _extends2.default)((0, _extends2.default)({}, defaultStyleContext), {
    cache
  })));
};
exports.useStyleInject = useStyleInject;
const useStyleProvider = props => {
  const parentContext = useStyleInject();
  const context = (0, _vue.shallowRef)((0, _extends2.default)((0, _extends2.default)({}, defaultStyleContext), {
    cache: createCache()
  }));
  (0, _vue.watch)([() => (0, _vue.unref)(props), parentContext], () => {
    const mergedContext = (0, _extends2.default)({}, parentContext.value);
    const propsValue = (0, _vue.unref)(props);
    Object.keys(propsValue).forEach(key => {
      const value = propsValue[key];
      if (propsValue[key] !== undefined) {
        mergedContext[key] = value;
      }
    });
    const {
      cache
    } = propsValue;
    mergedContext.cache = mergedContext.cache || createCache();
    mergedContext.defaultCache = !cache && parentContext.value.defaultCache;
    context.value = mergedContext;
  }, {
    immediate: true
  });
  (0, _vue.provide)(StyleContextKey, context);
  return context;
};
exports.useStyleProvider = useStyleProvider;
const styleProviderProps = () => ({
  autoClear: (0, _type.booleanType)(),
  /** @private Test only. Not work in production. */
  mock: (0, _type.stringType)(),
  /**
   * Only set when you need ssr to extract style on you own.
   * If not provided, it will auto create <style /> on the end of Provider in server side.
   */
  cache: (0, _type.objectType)(),
  /** Tell children that this context is default generated context */
  defaultCache: (0, _type.booleanType)(),
  /** Use `:where` selector to reduce hashId css selector priority */
  hashPriority: (0, _type.stringType)(),
  /** Tell cssinjs where to inject style in */
  container: (0, _type.someType)(),
  /** Component wil render inline  `<style />` for fallback in SSR. Not recommend. */
  ssrInline: (0, _type.booleanType)(),
  /** Transform css before inject in document. Please note that `transformers` do not support dynamic update */
  transformers: (0, _type.arrayType)(),
  /**
   * Linters to lint css before inject in document.
   * Styles will be linted after transforming.
   * Please note that `linters` do not support dynamic update.
   */
  linters: (0, _type.arrayType)()
});
exports.styleProviderProps = styleProviderProps;
const StyleProvider = exports.StyleProvider = (0, _type.withInstall)((0, _vue.defineComponent)({
  name: 'AStyleProvider',
  inheritAttrs: false,
  props: styleProviderProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    useStyleProvider(props);
    return () => {
      var _a;
      return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
    };
  }
}));
var _default = exports.default = {
  useStyleInject,
  useStyleProvider,
  StyleProvider
};