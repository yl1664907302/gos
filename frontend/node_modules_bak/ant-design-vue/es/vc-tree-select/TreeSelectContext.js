import { provide, inject } from 'vue';
const TreeSelectContextPropsKey = Symbol('TreeSelectContextPropsKey');
export function useProvideSelectContext(props) {
  return provide(TreeSelectContextPropsKey, props);
}
export default function useInjectSelectContext() {
  return inject(TreeSelectContextPropsKey, {});
}