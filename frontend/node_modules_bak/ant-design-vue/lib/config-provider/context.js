"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useProvideGlobalForm = exports.useInjectGlobalForm = exports.useConfigContextProvider = exports.useConfigContextInject = exports.defaultIconPrefixCls = exports.defaultConfigProvider = exports.configProviderProps = exports.configProviderKey = exports.GlobalFormContextKey = exports.GlobalConfigContextKey = void 0;
var _vue = require("vue");
var _type = require("../_util/type");
const defaultIconPrefixCls = exports.defaultIconPrefixCls = 'anticon';
const GlobalFormContextKey = exports.GlobalFormContextKey = Symbol('GlobalFormContextKey');
const useProvideGlobalForm = state => {
  (0, _vue.provide)(GlobalFormContextKey, state);
};
exports.useProvideGlobalForm = useProvideGlobalForm;
const useInjectGlobalForm = () => {
  return (0, _vue.inject)(GlobalFormContextKey, {
    validateMessages: (0, _vue.computed)(() => undefined)
  });
};
exports.useInjectGlobalForm = useInjectGlobalForm;
const GlobalConfigContextKey = exports.GlobalConfigContextKey = Symbol('GlobalConfigContextKey');
const configProviderProps = () => ({
  iconPrefixCls: String,
  getTargetContainer: {
    type: Function
  },
  getPopupContainer: {
    type: Function
  },
  prefixCls: String,
  getPrefixCls: {
    type: Function
  },
  renderEmpty: {
    type: Function
  },
  transformCellText: {
    type: Function
  },
  csp: (0, _type.objectType)(),
  input: (0, _type.objectType)(),
  autoInsertSpaceInButton: {
    type: Boolean,
    default: undefined
  },
  locale: (0, _type.objectType)(),
  pageHeader: (0, _type.objectType)(),
  componentSize: {
    type: String
  },
  componentDisabled: {
    type: Boolean,
    default: undefined
  },
  direction: {
    type: String,
    default: 'ltr'
  },
  space: (0, _type.objectType)(),
  virtual: {
    type: Boolean,
    default: undefined
  },
  dropdownMatchSelectWidth: {
    type: [Number, Boolean],
    default: true
  },
  form: (0, _type.objectType)(),
  pagination: (0, _type.objectType)(),
  theme: (0, _type.objectType)(),
  select: (0, _type.objectType)(),
  wave: (0, _type.objectType)()
});
exports.configProviderProps = configProviderProps;
const configProviderKey = exports.configProviderKey = Symbol('configProvider');
const defaultConfigProvider = exports.defaultConfigProvider = {
  getPrefixCls: (suffixCls, customizePrefixCls) => {
    if (customizePrefixCls) return customizePrefixCls;
    return suffixCls ? `ant-${suffixCls}` : 'ant';
  },
  iconPrefixCls: (0, _vue.computed)(() => defaultIconPrefixCls),
  getPopupContainer: (0, _vue.computed)(() => () => document.body),
  direction: (0, _vue.computed)(() => 'ltr')
};
const useConfigContextInject = () => {
  return (0, _vue.inject)(configProviderKey, defaultConfigProvider);
};
exports.useConfigContextInject = useConfigContextInject;
const useConfigContextProvider = props => {
  return (0, _vue.provide)(configProviderKey, props);
};
exports.useConfigContextProvider = useConfigContextProvider;