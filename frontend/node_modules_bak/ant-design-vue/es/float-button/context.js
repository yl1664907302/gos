import { inject, provide, ref } from 'vue';
const contextKey = Symbol('floatButtonGroupContext');
export const useProvideFloatButtonGroupContext = props => {
  provide(contextKey, props);
  return props;
};
export const useInjectFloatButtonGroupContext = () => {
  return inject(contextKey, {
    shape: ref()
  });
};