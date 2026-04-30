import { inject, provide } from 'vue';
export const SummaryContextKey = Symbol('SummaryContextProps');
export const useProvideSummary = props => {
  provide(SummaryContextKey, props);
};
export const useInjectSummary = () => {
  return inject(SummaryContextKey, {});
};