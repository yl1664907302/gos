import _extends from "@babel/runtime/helpers/esm/extends";
import { ref, shallowRef, watchEffect } from 'vue';
import { warning } from '../../vc-util/warning';
// Convert `showSearch` to unique config
export default function useSearchConfig(showSearch) {
  const mergedShowSearch = shallowRef(false);
  const mergedSearchConfig = ref({});
  watchEffect(() => {
    if (!showSearch.value) {
      mergedShowSearch.value = false;
      mergedSearchConfig.value = {};
      return;
    }
    let searchConfig = {
      matchInputWidth: true,
      limit: 50
    };
    if (showSearch.value && typeof showSearch.value === 'object') {
      searchConfig = _extends(_extends({}, searchConfig), showSearch.value);
    }
    if (searchConfig.limit <= 0) {
      delete searchConfig.limit;
      if (process.env.NODE_ENV !== 'production') {
        warning(false, "'limit' of showSearch should be positive number or false.");
      }
    }
    mergedShowSearch.value = true;
    mergedSearchConfig.value = searchConfig;
    return;
  });
  return {
    showSearch: mergedShowSearch,
    searchConfig: mergedSearchConfig
  };
}