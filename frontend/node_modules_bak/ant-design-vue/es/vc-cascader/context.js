import { inject, provide } from 'vue';
const CascaderContextKey = Symbol('CascaderContextKey');
export const useProvideCascader = props => {
  provide(CascaderContextKey, props);
};
export const useInjectCascader = () => {
  return inject(CascaderContextKey);
};