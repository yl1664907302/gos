import { reactive, toRef } from 'vue';
import fromPairs from 'lodash-es/fromPairs';
/**
 * Reactively pick fields from a reactive object
 *
 * @see https://vueuse.js.org/reactivePick
 */
export function reactivePick(obj) {
  for (var _len = arguments.length, keys = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    keys[_key - 1] = arguments[_key];
  }
  return reactive(fromPairs(keys.map(k => [k, toRef(obj, k)])));
}