import { onMounted, shallowRef } from 'vue';
/**
 * Similar with `useLock`, but this hook will always execute last value.
 * When set to `true`, it will keep `true` for a short time even if `false` is set.
 */
export default function useDelayReset() {
  let timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
  const bool = shallowRef(false);
  let delay;
  const cancelLatest = () => {
    clearTimeout(delay);
  };
  onMounted(() => {
    cancelLatest();
  });
  const delaySetBool = (value, callback) => {
    cancelLatest();
    delay = setTimeout(() => {
      bool.value = value;
      if (callback) {
        callback();
      }
    }, timeout);
  };
  return [bool, delaySetBool, cancelLatest];
}