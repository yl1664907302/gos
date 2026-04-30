import _extends from "@babel/runtime/helpers/esm/extends";
import { inject, provide, reactive, watchEffect } from 'vue';
function createContext(defaultValue) {
  const contextKey = Symbol('contextKey');
  const useProvide = (props, newProps) => {
    const mergedProps = reactive({});
    provide(contextKey, mergedProps);
    watchEffect(() => {
      _extends(mergedProps, props, newProps || {});
    });
    return mergedProps;
  };
  const useInject = () => {
    return inject(contextKey, defaultValue) || {};
  };
  return {
    useProvide,
    useInject
  };
}
export default createContext;