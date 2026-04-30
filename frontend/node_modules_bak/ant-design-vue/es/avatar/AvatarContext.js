import { inject, provide } from 'vue';
const AvatarContextKey = Symbol('AvatarContextKey');
export const useAvatarInjectContext = () => {
  return inject(AvatarContextKey, {});
};
export const useAvatarProviderContext = context => {
  return provide(AvatarContextKey, context);
};