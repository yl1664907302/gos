/**
 * BaseSelect provide some parsed data into context.
 * You can use this hooks to get them.
 */
import { inject, provide } from 'vue';
const TreeSelectLegacyContextPropsKey = Symbol('TreeSelectLegacyContextPropsKey');
// export const LegacySelectContext = defineComponent({
//  compatConfig: { MODE: 3 },
//   name: 'SelectContext',
//   props: {
//     value: { type: Object as PropType<LegacyContextProps> },
//   },
//   setup(props, { slots }) {
//     provide(
//       TreeSelectLegacyContextPropsKey,
//       computed(() => props.value),
//     );
//     return () => slots.default?.();
//   },
// });
export function useProvideLegacySelectContext(props) {
  return provide(TreeSelectLegacyContextPropsKey, props);
}
export default function useInjectLegacySelectContext() {
  return inject(TreeSelectLegacyContextPropsKey, {});
}