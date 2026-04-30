import { inject, provide } from 'vue';
const radioGroupContextKey = Symbol('radioGroupContextKey');
export const useProvideRadioGroupContext = props => {
  provide(radioGroupContextKey, props);
};
export const useInjectRadioGroupContext = () => {
  return inject(radioGroupContextKey, undefined);
};
const radioOptionTypeContextKey = Symbol('radioOptionTypeContextKey');
export const useProvideRadioOptionTypeContext = props => {
  provide(radioOptionTypeContextKey, props);
};
export const useInjectRadioOptionTypeContext = () => {
  return inject(radioOptionTypeContextKey, undefined);
};