"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DesignTokenProvider = void 0;
Object.defineProperty(exports, "PresetColors", {
  enumerable: true,
  get: function () {
    return _interface.PresetColors;
  }
});
exports.defaultConfig = void 0;
Object.defineProperty(exports, "genComponentStyleHook", {
  enumerable: true,
  get: function () {
    return _genComponentStyleHook.default;
  }
});
exports.globalDesignTokenApi = void 0;
Object.defineProperty(exports, "mergeToken", {
  enumerable: true,
  get: function () {
    return _statistic.merge;
  }
});
Object.defineProperty(exports, "statistic", {
  enumerable: true,
  get: function () {
    return _statistic.statistic;
  }
});
Object.defineProperty(exports, "statisticToken", {
  enumerable: true,
  get: function () {
    return _statistic.default;
  }
});
exports.useDesignTokenProvider = exports.useDesignTokenInject = void 0;
Object.defineProperty(exports, "useStyleRegister", {
  enumerable: true,
  get: function () {
    return _cssinjs.useStyleRegister;
  }
});
exports.useToken = useToken;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _cssinjs = require("../_util/cssinjs");
var _version = _interopRequireDefault(require("../version"));
var _interface = require("./interface");
var _default = _interopRequireDefault(require("./themes/default"));
var _seed = _interopRequireDefault(require("./themes/seed"));
var _alias = _interopRequireDefault(require("./util/alias"));
var _genComponentStyleHook = _interopRequireDefault(require("./util/genComponentStyleHook"));
var _statistic = _interopRequireWildcard(require("./util/statistic"));
var _type = require("../_util/type");
var _vue = require("vue");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const defaultTheme = (0, _cssinjs.createTheme)(_default.default);
// ================================ Context =================================
// To ensure snapshot stable. We disable hashed in test env.
const defaultConfig = exports.defaultConfig = {
  token: _seed.default,
  hashed: true
};
//defaultConfig
const DesignTokenContextKey = Symbol('DesignTokenContext');
const globalDesignTokenApi = exports.globalDesignTokenApi = (0, _vue.shallowRef)();
const useDesignTokenProvider = value => {
  (0, _vue.provide)(DesignTokenContextKey, value);
  (0, _vue.watch)(value, () => {
    globalDesignTokenApi.value = (0, _vue.unref)(value);
    (0, _vue.triggerRef)(globalDesignTokenApi);
  }, {
    immediate: true,
    deep: true
  });
};
exports.useDesignTokenProvider = useDesignTokenProvider;
const useDesignTokenInject = () => {
  return (0, _vue.inject)(DesignTokenContextKey, (0, _vue.computed)(() => globalDesignTokenApi.value || defaultConfig));
};
exports.useDesignTokenInject = useDesignTokenInject;
const DesignTokenProvider = exports.DesignTokenProvider = (0, _vue.defineComponent)({
  props: {
    value: (0, _type.objectType)()
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    useDesignTokenProvider((0, _vue.computed)(() => props.value));
    return () => {
      var _a;
      return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
    };
  }
});
// ================================== Hook ==================================
function useToken() {
  const designTokenContext = (0, _vue.inject)(DesignTokenContextKey, (0, _vue.computed)(() => globalDesignTokenApi.value || defaultConfig));
  const salt = (0, _vue.computed)(() => `${_version.default}-${designTokenContext.value.hashed || ''}`);
  const mergedTheme = (0, _vue.computed)(() => designTokenContext.value.theme || defaultTheme);
  const cacheToken = (0, _cssinjs.useCacheToken)(mergedTheme, (0, _vue.computed)(() => [_seed.default, designTokenContext.value.token]), (0, _vue.computed)(() => ({
    salt: salt.value,
    override: (0, _extends2.default)({
      override: designTokenContext.value.token
    }, designTokenContext.value.components),
    formatToken: _alias.default
  })));
  return [mergedTheme, (0, _vue.computed)(() => cacheToken.value[0]), (0, _vue.computed)(() => designTokenContext.value.hashed ? cacheToken.value[1] : '')];
}