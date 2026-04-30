"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useProvideAppContext = exports.useProvideAppConfigContext = exports.useInjectAppContext = exports.useInjectAppConfigContext = exports.AppContextKey = exports.AppConfigContextKey = void 0;
var _vue = require("vue");
const AppConfigContextKey = exports.AppConfigContextKey = Symbol('appConfigContext');
const useProvideAppConfigContext = appConfigContext => {
  return (0, _vue.provide)(AppConfigContextKey, appConfigContext);
};
exports.useProvideAppConfigContext = useProvideAppConfigContext;
const useInjectAppConfigContext = () => {
  return (0, _vue.inject)(AppConfigContextKey, {});
};
exports.useInjectAppConfigContext = useInjectAppConfigContext;
const AppContextKey = exports.AppContextKey = Symbol('appContext');
const useProvideAppContext = appContext => {
  return (0, _vue.provide)(AppContextKey, appContext);
};
exports.useProvideAppContext = useProvideAppContext;
const defaultAppContext = (0, _vue.reactive)({
  message: {},
  notification: {},
  modal: {}
});
const useInjectAppContext = () => {
  return (0, _vue.inject)(AppContextKey, defaultAppContext);
};
exports.useInjectAppContext = useInjectAppContext;