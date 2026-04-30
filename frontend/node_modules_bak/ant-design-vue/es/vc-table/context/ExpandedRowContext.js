import { inject, provide } from 'vue';
export const ExpandedRowContextKey = Symbol('ExpandedRowProps');
export const useProvideExpandedRow = props => {
  provide(ExpandedRowContextKey, props);
};
export const useInjectExpandedRow = () => {
  return inject(ExpandedRowContextKey, {});
};