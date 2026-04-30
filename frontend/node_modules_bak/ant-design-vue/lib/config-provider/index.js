"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.configConsumerProps = void 0;
Object.defineProperty(exports, "defaultIconPrefixCls", {
  enumerable: true,
  get: function () {
    return _context.defaultIconPrefixCls;
  }
});
exports.globalConfigForApi = exports.globalConfig = exports.defaultPrefixCls = void 0;
var _vue = require("vue");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _renderEmpty = _interopRequireDefault(require("./renderEmpty"));
var _localeProvider = _interopRequireWildcard(require("../locale-provider"));
var _LocaleReceiver = _interopRequireDefault(require("../locale-provider/LocaleReceiver"));
var _message = _interopRequireDefault(require("../message"));
var _notification = _interopRequireDefault(require("../notification"));
var _cssVariables = require("./cssVariables");
var _en_US = _interopRequireDefault(require("../locale/en_US"));
var _style = _interopRequireDefault(require("./style"));
var _useTheme = _interopRequireDefault(require("./hooks/useTheme"));
var _seed = _interopRequireDefault(require("../theme/themes/seed"));
var _context = require("./context");
var _SizeContext = require("./SizeContext");
var _DisabledContext = require("./DisabledContext");
var _cssinjs = require("../_util/cssinjs");
var _internal = require("../theme/internal");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const defaultPrefixCls = exports.defaultPrefixCls = 'ant';
function getGlobalPrefixCls() {
  return globalConfigForApi.prefixCls || defaultPrefixCls;
}
function getGlobalIconPrefixCls() {
  return globalConfigForApi.iconPrefixCls || _context.defaultIconPrefixCls;
}
const globalConfigBySet = (0, _vue.reactive)({}); // 权重最大
const globalConfigForApi = exports.globalConfigForApi = (0, _vue.reactive)({});
const configConsumerProps = exports.configConsumerProps = ['getTargetContainer', 'getPopupContainer', 'rootPrefixCls', 'getPrefixCls', 'renderEmpty', 'csp', 'autoInsertSpaceInButton', 'locale', 'pageHeader'];
(0, _vue.watchEffect)(() => {
  (0, _extends2.default)(globalConfigForApi, globalConfigBySet);
  globalConfigForApi.prefixCls = getGlobalPrefixCls();
  globalConfigForApi.iconPrefixCls = getGlobalIconPrefixCls();
  globalConfigForApi.getPrefixCls = (suffixCls, customizePrefixCls) => {
    if (customizePrefixCls) return customizePrefixCls;
    return suffixCls ? `${globalConfigForApi.prefixCls}-${suffixCls}` : globalConfigForApi.prefixCls;
  };
  globalConfigForApi.getRootPrefixCls = () => {
    // If Global prefixCls provided, use this
    if (globalConfigForApi.prefixCls) {
      return globalConfigForApi.prefixCls;
    }
    // Fallback to default prefixCls
    return getGlobalPrefixCls();
  };
});
let stopWatchEffect;
const setGlobalConfig = params => {
  if (stopWatchEffect) {
    stopWatchEffect();
  }
  stopWatchEffect = (0, _vue.watchEffect)(() => {
    (0, _extends2.default)(globalConfigBySet, (0, _vue.reactive)(params));
    (0, _extends2.default)(globalConfigForApi, (0, _vue.reactive)(params));
  });
  if (params.theme) {
    (0, _cssVariables.registerTheme)(getGlobalPrefixCls(), params.theme);
  }
};
const globalConfig = () => ({
  getPrefixCls: (suffixCls, customizePrefixCls) => {
    if (customizePrefixCls) return customizePrefixCls;
    return suffixCls ? `${getGlobalPrefixCls()}-${suffixCls}` : getGlobalPrefixCls();
  },
  getIconPrefixCls: getGlobalIconPrefixCls,
  getRootPrefixCls: () => {
    // If Global prefixCls provided, use this
    if (globalConfigForApi.prefixCls) {
      return globalConfigForApi.prefixCls;
    }
    // Fallback to default prefixCls
    return getGlobalPrefixCls();
  }
});
exports.globalConfig = globalConfig;
const ConfigProvider = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'AConfigProvider',
  inheritAttrs: false,
  props: (0, _context.configProviderProps)(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const parentContext = (0, _context.useConfigContextInject)();
    const getPrefixCls = (suffixCls, customizePrefixCls) => {
      const {
        prefixCls = 'ant'
      } = props;
      if (customizePrefixCls) return customizePrefixCls;
      const mergedPrefixCls = prefixCls || parentContext.getPrefixCls('');
      return suffixCls ? `${mergedPrefixCls}-${suffixCls}` : mergedPrefixCls;
    };
    const iconPrefixCls = (0, _vue.computed)(() => props.iconPrefixCls || parentContext.iconPrefixCls.value || _context.defaultIconPrefixCls);
    const shouldWrapSSR = (0, _vue.computed)(() => iconPrefixCls.value !== parentContext.iconPrefixCls.value);
    const csp = (0, _vue.computed)(() => {
      var _a;
      return props.csp || ((_a = parentContext.csp) === null || _a === void 0 ? void 0 : _a.value);
    });
    const wrapSSR = (0, _style.default)(iconPrefixCls);
    const mergedTheme = (0, _useTheme.default)((0, _vue.computed)(() => props.theme), (0, _vue.computed)(() => {
      var _a;
      return (_a = parentContext.theme) === null || _a === void 0 ? void 0 : _a.value;
    }));
    const renderEmptyComponent = name => {
      const renderEmpty = props.renderEmpty || slots.renderEmpty || parentContext.renderEmpty || _renderEmpty.default;
      return renderEmpty(name);
    };
    const autoInsertSpaceInButton = (0, _vue.computed)(() => {
      var _a, _b;
      return (_a = props.autoInsertSpaceInButton) !== null && _a !== void 0 ? _a : (_b = parentContext.autoInsertSpaceInButton) === null || _b === void 0 ? void 0 : _b.value;
    });
    const locale = (0, _vue.computed)(() => {
      var _a;
      return props.locale || ((_a = parentContext.locale) === null || _a === void 0 ? void 0 : _a.value);
    });
    (0, _vue.watch)(locale, () => {
      globalConfigBySet.locale = locale.value;
    }, {
      immediate: true
    });
    const direction = (0, _vue.computed)(() => {
      var _a;
      return props.direction || ((_a = parentContext.direction) === null || _a === void 0 ? void 0 : _a.value);
    });
    const space = (0, _vue.computed)(() => {
      var _a, _b;
      return (_a = props.space) !== null && _a !== void 0 ? _a : (_b = parentContext.space) === null || _b === void 0 ? void 0 : _b.value;
    });
    const virtual = (0, _vue.computed)(() => {
      var _a, _b;
      return (_a = props.virtual) !== null && _a !== void 0 ? _a : (_b = parentContext.virtual) === null || _b === void 0 ? void 0 : _b.value;
    });
    const dropdownMatchSelectWidth = (0, _vue.computed)(() => {
      var _a, _b;
      return (_a = props.dropdownMatchSelectWidth) !== null && _a !== void 0 ? _a : (_b = parentContext.dropdownMatchSelectWidth) === null || _b === void 0 ? void 0 : _b.value;
    });
    const getTargetContainer = (0, _vue.computed)(() => {
      var _a;
      return props.getTargetContainer !== undefined ? props.getTargetContainer : (_a = parentContext.getTargetContainer) === null || _a === void 0 ? void 0 : _a.value;
    });
    const getPopupContainer = (0, _vue.computed)(() => {
      var _a;
      return props.getPopupContainer !== undefined ? props.getPopupContainer : (_a = parentContext.getPopupContainer) === null || _a === void 0 ? void 0 : _a.value;
    });
    const pageHeader = (0, _vue.computed)(() => {
      var _a;
      return props.pageHeader !== undefined ? props.pageHeader : (_a = parentContext.pageHeader) === null || _a === void 0 ? void 0 : _a.value;
    });
    const input = (0, _vue.computed)(() => {
      var _a;
      return props.input !== undefined ? props.input : (_a = parentContext.input) === null || _a === void 0 ? void 0 : _a.value;
    });
    const pagination = (0, _vue.computed)(() => {
      var _a;
      return props.pagination !== undefined ? props.pagination : (_a = parentContext.pagination) === null || _a === void 0 ? void 0 : _a.value;
    });
    const form = (0, _vue.computed)(() => {
      var _a;
      return props.form !== undefined ? props.form : (_a = parentContext.form) === null || _a === void 0 ? void 0 : _a.value;
    });
    const select = (0, _vue.computed)(() => {
      var _a;
      return props.select !== undefined ? props.select : (_a = parentContext.select) === null || _a === void 0 ? void 0 : _a.value;
    });
    const componentSize = (0, _vue.computed)(() => props.componentSize);
    const componentDisabled = (0, _vue.computed)(() => props.componentDisabled);
    const wave = (0, _vue.computed)(() => {
      var _a, _b;
      return (_a = props.wave) !== null && _a !== void 0 ? _a : (_b = parentContext.wave) === null || _b === void 0 ? void 0 : _b.value;
    });
    const configProvider = {
      csp,
      autoInsertSpaceInButton,
      locale,
      direction,
      space,
      virtual,
      dropdownMatchSelectWidth,
      getPrefixCls,
      iconPrefixCls,
      theme: (0, _vue.computed)(() => {
        var _a, _b;
        return (_a = mergedTheme.value) !== null && _a !== void 0 ? _a : (_b = parentContext.theme) === null || _b === void 0 ? void 0 : _b.value;
      }),
      renderEmpty: renderEmptyComponent,
      getTargetContainer,
      getPopupContainer,
      pageHeader,
      input,
      pagination,
      form,
      select,
      componentSize,
      componentDisabled,
      transformCellText: (0, _vue.computed)(() => props.transformCellText),
      wave
    };
    // ================================ Dynamic theme ================================
    const memoTheme = (0, _vue.computed)(() => {
      const _a = mergedTheme.value || {},
        {
          algorithm,
          token
        } = _a,
        rest = __rest(_a, ["algorithm", "token"]);
      const themeObj = algorithm && (!Array.isArray(algorithm) || algorithm.length > 0) ? (0, _cssinjs.createTheme)(algorithm) : undefined;
      return (0, _extends2.default)((0, _extends2.default)({}, rest), {
        theme: themeObj,
        token: (0, _extends2.default)((0, _extends2.default)({}, _seed.default), token)
      });
    });
    const validateMessagesRef = (0, _vue.computed)(() => {
      var _a, _b;
      // Additional Form provider
      let validateMessages = {};
      if (locale.value) {
        validateMessages = ((_a = locale.value.Form) === null || _a === void 0 ? void 0 : _a.defaultValidateMessages) || ((_b = _en_US.default.Form) === null || _b === void 0 ? void 0 : _b.defaultValidateMessages) || {};
      }
      if (props.form && props.form.validateMessages) {
        validateMessages = (0, _extends2.default)((0, _extends2.default)({}, validateMessages), props.form.validateMessages);
      }
      return validateMessages;
    });
    (0, _context.useConfigContextProvider)(configProvider);
    (0, _context.useProvideGlobalForm)({
      validateMessages: validateMessagesRef
    });
    (0, _SizeContext.useProviderSize)(componentSize);
    (0, _DisabledContext.useProviderDisabled)(componentDisabled);
    const renderProvider = legacyLocale => {
      var _a, _b;
      let childNode = shouldWrapSSR.value ? wrapSSR((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)) : (_b = slots.default) === null || _b === void 0 ? void 0 : _b.call(slots);
      if (props.theme) {
        const _childNode = function () {
          return childNode;
        }();
        childNode = (0, _vue.createVNode)(_internal.DesignTokenProvider, {
          "value": memoTheme.value
        }, {
          default: () => [_childNode]
        });
      }
      return (0, _vue.createVNode)(_localeProvider.default, {
        "locale": locale.value || legacyLocale,
        "ANT_MARK__": _localeProvider.ANT_MARK
      }, {
        default: () => [childNode]
      });
    };
    (0, _vue.watchEffect)(() => {
      if (direction.value) {
        _message.default.config({
          rtl: direction.value === 'rtl'
        });
        _notification.default.config({
          rtl: direction.value === 'rtl'
        });
      }
    });
    return () => (0, _vue.createVNode)(_LocaleReceiver.default, {
      "children": (_, __, legacyLocale) => renderProvider(legacyLocale)
    }, null);
  }
});
ConfigProvider.config = setGlobalConfig;
ConfigProvider.install = function (app) {
  app.component(ConfigProvider.name, ConfigProvider);
};
var _default = exports.default = ConfigProvider;