/**
 * BaseSelect provide some parsed data into context.
 * You can use this hooks to get them.
 */
import { inject, provide } from 'vue';
const BaseSelectContextKey = Symbol('BaseSelectContextKey');
export function useProvideBaseSelectProps(props) {
  return provide(BaseSelectContextKey, props);
}
export default function useBaseProps() {
  return inject(BaseSelectContextKey, {});
}