import { computed, inject, provide } from 'vue';
import { objectType } from '../_util/type';
export const defaultIconPrefixCls = 'anticon';
export const GlobalFormContextKey = Symbol('GlobalFormContextKey');
export const useProvideGlobalForm = state => {
  provide(GlobalFormContextKey, state);
};
export const useInjectGlobalForm = () => {
  return inject(GlobalFormContextKey, {
    validateMessages: computed(() => undefined)
  });
};
export const GlobalConfigContextKey = Symbol('GlobalConfigContextKey');
export const configProviderProps = () => ({
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
  csp: objectType(),
  input: objectType(),
  autoInsertSpaceInButton: {
    type: Boolean,
    default: undefined
  },
  locale: objectType(),
  pageHeader: objectType(),
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
  space: objectType(),
  virtual: {
    type: Boolean,
    default: undefined
  },
  dropdownMatchSelectWidth: {
    type: [Number, Boolean],
    default: true
  },
  form: objectType(),
  pagination: objectType(),
  theme: objectType(),
  select: objectType(),
  wave: objectType()
});
export const configProviderKey = Symbol('configProvider');
export const defaultConfigProvider = {
  getPrefixCls: (suffixCls, customizePrefixCls) => {
    if (customizePrefixCls) return customizePrefixCls;
    return suffixCls ? `ant-${suffixCls}` : 'ant';
  },
  iconPrefixCls: computed(() => defaultIconPrefixCls),
  getPopupContainer: computed(() => () => document.body),
  direction: computed(() => 'ltr')
};
export const useConfigContextInject = () => {
  return inject(configProviderKey, defaultConfigProvider);
};
export const useConfigContextProvider = props => {
  return provide(configProviderKey, props);
};