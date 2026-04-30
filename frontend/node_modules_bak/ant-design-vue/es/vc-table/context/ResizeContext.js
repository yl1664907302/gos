import { inject, provide } from 'vue';
export const ResizeContextKey = Symbol('ResizeContextProps');
export const useProvideResize = props => {
  provide(ResizeContextKey, props);
};
export const useInjectResize = () => {
  return inject(ResizeContextKey, {
    onColumnResize: () => {}
  });
};