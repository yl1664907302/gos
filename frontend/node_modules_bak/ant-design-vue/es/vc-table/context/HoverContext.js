import { shallowRef, inject, provide } from 'vue';
export const HoverContextKey = Symbol('HoverContextProps');
export const useProvideHover = props => {
  provide(HoverContextKey, props);
};
export const useInjectHover = () => {
  return inject(HoverContextKey, {
    startRow: shallowRef(-1),
    endRow: shallowRef(-1),
    onHover() {}
  });
};