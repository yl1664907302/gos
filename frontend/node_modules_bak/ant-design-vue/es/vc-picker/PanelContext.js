import { inject, provide } from 'vue';
const PanelContextKey = Symbol('PanelContextProps');
export const useProvidePanel = props => {
  provide(PanelContextKey, props);
};
export const useInjectPanel = () => {
  return inject(PanelContextKey, {});
};
export default PanelContextKey;