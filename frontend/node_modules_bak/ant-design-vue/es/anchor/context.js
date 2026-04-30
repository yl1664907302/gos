import { computed, inject, provide } from 'vue';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function noop() {}
export const AnchorContextKey = Symbol('anchorContextKey');
const useProvideAnchor = state => {
  provide(AnchorContextKey, state);
};
const useInjectAnchor = () => {
  return inject(AnchorContextKey, {
    registerLink: noop,
    unregisterLink: noop,
    scrollTo: noop,
    activeLink: computed(() => ''),
    handleClick: noop,
    direction: computed(() => 'vertical')
  });
};
export { useInjectAnchor, useProvideAnchor };
export default useProvideAnchor;