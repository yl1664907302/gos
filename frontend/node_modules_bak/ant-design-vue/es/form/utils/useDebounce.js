import { shallowRef, watchEffect } from 'vue';
export default function useDebounce(value) {
  const cacheValue = shallowRef(value.value.slice());
  let timeout = null;
  watchEffect(() => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cacheValue.value = value.value;
    }, value.value.length ? 0 : 10);
  });
  return cacheValue;
}