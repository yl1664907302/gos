import _extends from "@babel/runtime/helpers/esm/extends";
import { defaultConfig } from '../../theme/internal';
import { computed } from 'vue';
export default function useTheme(theme, parentTheme) {
  const themeConfig = computed(() => (theme === null || theme === void 0 ? void 0 : theme.value) || {});
  const parentThemeConfig = computed(() => themeConfig.value.inherit === false || !(parentTheme === null || parentTheme === void 0 ? void 0 : parentTheme.value) ? defaultConfig : parentTheme.value);
  const mergedTheme = computed(() => {
    if (!(theme === null || theme === void 0 ? void 0 : theme.value)) {
      return parentTheme === null || parentTheme === void 0 ? void 0 : parentTheme.value;
    }
    // Override
    const mergedComponents = _extends({}, parentThemeConfig.value.components);
    Object.keys(theme.value.components || {}).forEach(componentName => {
      mergedComponents[componentName] = _extends(_extends({}, mergedComponents[componentName]), theme.value.components[componentName]);
    });
    // Base token
    return _extends(_extends(_extends({}, parentThemeConfig.value), themeConfig.value), {
      token: _extends(_extends({}, parentThemeConfig.value.token), themeConfig.value.token),
      components: mergedComponents
    });
  });
  return mergedTheme;
}