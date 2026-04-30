import { computed, inject, provide } from 'vue';
export const RowContextKey = Symbol('rowContextKey');
const useProvideRow = state => {
  provide(RowContextKey, state);
};
const useInjectRow = () => {
  return inject(RowContextKey, {
    gutter: computed(() => undefined),
    wrap: computed(() => undefined),
    supportFlexGap: computed(() => undefined)
  });
};
export { useInjectRow, useProvideRow };
export default useProvideRow;