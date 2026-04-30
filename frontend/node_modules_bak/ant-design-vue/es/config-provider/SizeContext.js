import { computed, inject, ref, provide } from 'vue';
const SizeContextKey = Symbol('SizeContextKey');
export const useInjectSize = () => {
  return inject(SizeContextKey, ref(undefined));
};
export const useProviderSize = size => {
  const parentSize = useInjectSize();
  provide(SizeContextKey, computed(() => size.value || parentSize.value));
  return size;
};