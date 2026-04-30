import _extends from "@babel/runtime/helpers/esm/extends";
import { unref, inject, defineComponent, computed } from 'vue';
import defaultLocaleData from './en_US';
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'LocaleReceiver',
  props: {
    componentName: String,
    defaultLocale: {
      type: [Object, Function]
    },
    children: {
      type: Function
    }
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const localeData = inject('localeData', {});
    const locale = computed(() => {
      const {
        componentName = 'global',
        defaultLocale
      } = props;
      const locale = defaultLocale || defaultLocaleData[componentName || 'global'];
      const {
        antLocale
      } = localeData;
      const localeFromContext = componentName && antLocale ? antLocale[componentName] : {};
      return _extends(_extends({}, typeof locale === 'function' ? locale() : locale), localeFromContext || {});
    });
    const localeCode = computed(() => {
      const {
        antLocale
      } = localeData;
      const localeCode = antLocale && antLocale.locale;
      // Had use LocaleProvide but didn't set locale
      if (antLocale && antLocale.exist && !localeCode) {
        return defaultLocaleData.locale;
      }
      return localeCode;
    });
    return () => {
      const children = props.children || slots.default;
      const {
        antLocale
      } = localeData;
      return children === null || children === void 0 ? void 0 : children(locale.value, localeCode.value, antLocale);
    };
  }
});
export function useLocaleReceiver(componentName, defaultLocale, propsLocale) {
  const localeData = inject('localeData', {});
  const componentLocale = computed(() => {
    const {
      antLocale
    } = localeData;
    const locale = unref(defaultLocale) || defaultLocaleData[componentName || 'global'];
    const localeFromContext = componentName && antLocale ? antLocale[componentName] : {};
    return _extends(_extends(_extends({}, typeof locale === 'function' ? locale() : locale), localeFromContext || {}), unref(propsLocale) || {});
  });
  return [componentLocale];
}