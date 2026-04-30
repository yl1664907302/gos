import _extends from "@babel/runtime/helpers/esm/extends";
import { createTheme, useCacheToken, useStyleRegister } from '../_util/cssinjs';
import version from '../version';
import { PresetColors } from './interface';
import defaultDerivative from './themes/default';
import defaultSeedToken from './themes/seed';
import formatToken from './util/alias';
import genComponentStyleHook from './util/genComponentStyleHook';
import statisticToken, { merge as mergeToken, statistic } from './util/statistic';
import { objectType } from '../_util/type';
import { triggerRef, unref, defineComponent, provide, computed, inject, watch, shallowRef } from 'vue';
const defaultTheme = createTheme(defaultDerivative);
export {
// colors
PresetColors,
// Statistic
statistic, statisticToken, mergeToken,
// hooks
useStyleRegister, genComponentStyleHook };
// ================================ Context =================================
// To ensure snapshot stable. We disable hashed in test env.
export const defaultConfig = {
  token: defaultSeedToken,
  hashed: true
};
//defaultConfig
const DesignTokenContextKey = Symbol('DesignTokenContext');
export const globalDesignTokenApi = shallowRef();
export const useDesignTokenProvider = value => {
  provide(DesignTokenContextKey, value);
  watch(value, () => {
    globalDesignTokenApi.value = unref(value);
    triggerRef(globalDesignTokenApi);
  }, {
    immediate: true,
    deep: true
  });
};
export const useDesignTokenInject = () => {
  return inject(DesignTokenContextKey, computed(() => globalDesignTokenApi.value || defaultConfig));
};
export const DesignTokenProvider = defineComponent({
  props: {
    value: objectType()
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    useDesignTokenProvider(computed(() => props.value));
    return () => {
      var _a;
      return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
    };
  }
});
// ================================== Hook ==================================
export function useToken() {
  const designTokenContext = inject(DesignTokenContextKey, computed(() => globalDesignTokenApi.value || defaultConfig));
  const salt = computed(() => `${version}-${designTokenContext.value.hashed || ''}`);
  const mergedTheme = computed(() => designTokenContext.value.theme || defaultTheme);
  const cacheToken = useCacheToken(mergedTheme, computed(() => [defaultSeedToken, designTokenContext.value.token]), computed(() => ({
    salt: salt.value,
    override: _extends({
      override: designTokenContext.value.token
    }, designTokenContext.value.components),
    formatToken
  })));
  return [mergedTheme, computed(() => cacheToken.value[0]), computed(() => designTokenContext.value.hashed ? cacheToken.value[1] : '')];
}