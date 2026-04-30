import { unref } from 'vue';
/**
 * Get the value of value/ref/getter.
 */
export function resolveUnref(r) {
  return typeof r === 'function' ? r() : unref(r);
}