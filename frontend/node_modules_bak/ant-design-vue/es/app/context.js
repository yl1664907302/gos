import { provide, inject, reactive } from 'vue';
export const AppConfigContextKey = Symbol('appConfigContext');
export const useProvideAppConfigContext = appConfigContext => {
  return provide(AppConfigContextKey, appConfigContext);
};
export const useInjectAppConfigContext = () => {
  return inject(AppConfigContextKey, {});
};
export const AppContextKey = Symbol('appContext');
export const useProvideAppContext = appContext => {
  return provide(AppContextKey, appContext);
};
const defaultAppContext = reactive({
  message: {},
  notification: {},
  modal: {}
});
export const useInjectAppContext = () => {
  return inject(AppContextKey, defaultAppContext);
};