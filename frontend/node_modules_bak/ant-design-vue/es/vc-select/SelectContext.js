/**
 * BaseSelect provide some parsed data into context.
 * You can use this hooks to get them.
 */
import { inject, provide } from 'vue';
const SelectContextKey = Symbol('SelectContextKey');
export function useProvideSelectProps(props) {
  return provide(SelectContextKey, props);
}
export default function useSelectProps() {
  return inject(SelectContextKey, {});
}