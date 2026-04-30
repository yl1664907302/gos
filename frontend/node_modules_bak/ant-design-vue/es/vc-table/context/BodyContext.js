import { inject, provide } from 'vue';
export const BodyContextKey = Symbol('BodyContextProps');
export const useProvideBody = props => {
  provide(BodyContextKey, props);
};
export const useInjectBody = () => {
  return inject(BodyContextKey, {});
};