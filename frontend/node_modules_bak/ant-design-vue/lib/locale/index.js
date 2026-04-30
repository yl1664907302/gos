"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ANT_MARK = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vue = require("vue");
var _locale = require("../modal/locale");
var _warning = _interopRequireDefault(require("../_util/warning"));
var _type = require("../_util/type");
const ANT_MARK = exports.ANT_MARK = 'internalMark';
const LocaleProvider = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ALocaleProvider',
  props: {
    locale: {
      type: Object
    },
    ANT_MARK__: String
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    (0, _warning.default)(props.ANT_MARK__ === ANT_MARK, 'LocaleProvider', '`LocaleProvider` is deprecated. Please use `locale` with `ConfigProvider` instead');
    const state = (0, _vue.reactive)({
      antLocale: (0, _extends2.default)((0, _extends2.default)({}, props.locale), {
        exist: true
      }),
      ANT_MARK__: ANT_MARK
    });
    (0, _vue.provide)('localeData', state);
    (0, _vue.watch)(() => props.locale, locale => {
      (0, _locale.changeConfirmLocale)(locale && locale.Modal);
      state.antLocale = (0, _extends2.default)((0, _extends2.default)({}, locale), {
        exist: true
      });
    }, {
      immediate: true
    });
    return () => {
      var _a;
      return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
    };
  }
});
/* istanbul ignore next */
LocaleProvider.install = function (app) {
  app.component(LocaleProvider.name, LocaleProvider);
  return app;
};
var _default = exports.default = (0, _type.withInstall)(LocaleProvider);