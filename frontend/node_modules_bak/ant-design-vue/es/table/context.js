import { computed, inject, provide } from 'vue';
const SlotsContextKey = Symbol('SlotsContextProps');
export const useProvideSlots = props => {
  provide(SlotsContextKey, props);
};
export const useInjectSlots = () => {
  return inject(SlotsContextKey, computed(() => ({})));
};
const ContextKey = Symbol('ContextProps');
export const useProvideTableContext = props => {
  provide(ContextKey, props);
};
export const useInjectTableContext = () => {
  return inject(ContextKey, {
    onResizeColumn: () => {}
  });
};