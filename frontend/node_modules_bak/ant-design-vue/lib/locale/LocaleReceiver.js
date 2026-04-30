"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.useLocaleReceiver = useLocaleReceiver;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vue = require("vue");
var _en_US = _interopRequireDefault(require("./en_US"));
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'LocaleReceiver',
  props: {
    componentName: String,
    defaultLocale: {
      type: [Object, Function]
    },
    children: {
      type: Function
    }
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const localeData = (0, _vue.inject)('localeData', {});
    const locale = (0, _vue.computed)(() => {
      const {
        componentName = 'global',
        defaultLocale
      } = props;
      const locale = defaultLocale || _en_US.default[componentName || 'global'];
      const {
        antLocale
      } = localeData;
      const localeFromContext = componentName && antLocale ? antLocale[componentName] : {};
      return (0, _extends2.default)((0, _extends2.default)({}, typeof locale === 'function' ? locale() : locale), localeFromContext || {});
    });
    const localeCode = (0, _vue.computed)(() => {
      const {
        antLocale
      } = localeData;
      const localeCode = antLocale && antLocale.locale;
      // Had use LocaleProvide but didn't set locale
      if (antLocale && antLocale.exist && !localeCode) {
        return _en_US.default.locale;
      }
      return localeCode;
    });
    return () => {
      const children = props.children || slots.default;
      const {
        antLocale
      } = localeData;
      return children === null || children === void 0 ? void 0 : children(locale.value, localeCode.value, antLocale);
    };
  }
});
function useLocaleReceiver(componentName, defaultLocale, propsLocale) {
  const localeData = (0, _vue.inject)('localeData', {});
  const componentLocale = (0, _vue.computed)(() => {
    const {
      antLocale
    } = localeData;
    const locale = (0, _vue.unref)(defaultLocale) || _en_US.default[componentName || 'global'];
    const localeFromContext = componentName && antLocale ? antLocale[componentName] : {};
    return (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, typeof locale === 'function' ? locale() : locale), localeFromContext || {}), (0, _vue.unref)(propsLocale) || {});
  });
  return [componentLocale];
}