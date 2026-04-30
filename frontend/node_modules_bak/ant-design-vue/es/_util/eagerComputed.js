import { watchEffect, shallowRef } from 'vue';
export default function eagerComputed(fn) {
  const result = shallowRef();
  watchEffect(() => {
    result.value = fn();
  }, {
    flush: 'sync' // needed so updates are immediate.
  });
  return result;
}