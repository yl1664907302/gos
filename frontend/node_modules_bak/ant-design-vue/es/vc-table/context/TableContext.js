import { inject, provide } from 'vue';
export const TableContextKey = Symbol('TableContextProps');
export const useProvideTable = props => {
  provide(TableContextKey, props);
};
export const useInjectTable = () => {
  return inject(TableContextKey, {});
};