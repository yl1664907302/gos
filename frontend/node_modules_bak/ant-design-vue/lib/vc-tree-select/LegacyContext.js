"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useInjectLegacySelectContext;
exports.useProvideLegacySelectContext = useProvideLegacySelectContext;
var _vue = require("vue");
/**
 * BaseSelect provide some parsed data into context.
 * You can use this hooks to get them.
 */

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
function useProvideLegacySelectContext(props) {
  return (0, _vue.provide)(TreeSelectLegacyContextPropsKey, props);
}
function useInjectLegacySelectContext() {
  return (0, _vue.inject)(TreeSelectLegacyContextPropsKey, {});
}