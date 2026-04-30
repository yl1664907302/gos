import { tryOnMounted } from './tryOnMounted';
import { shallowRef } from 'vue';
export function useSupported(callback) {
  let sync = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  const isSupported = shallowRef();
  const update = () => isSupported.value = Boolean(callback());
  update();
  tryOnMounted(update, sync);
  return isSupported;
}