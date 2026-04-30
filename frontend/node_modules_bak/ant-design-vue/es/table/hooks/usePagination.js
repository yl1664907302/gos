import _extends from "@babel/runtime/helpers/esm/extends";
import useState from '../../_util/hooks/useState';
import { computed } from 'vue';
import extendsObject from '../../_util/extendsObject';
export const DEFAULT_PAGE_SIZE = 10;
export function getPaginationParam(mergedPagination, pagination) {
  const param = {
    current: mergedPagination.current,
    pageSize: mergedPagination.pageSize
  };
  const paginationObj = pagination && typeof pagination === 'object' ? pagination : {};
  Object.keys(paginationObj).forEach(pageProp => {
    const value = mergedPagination[pageProp];
    if (typeof value !== 'function') {
      param[pageProp] = value;
    }
  });
  return param;
}
export default function usePagination(totalRef, paginationRef, onChange) {
  const pagination = computed(() => paginationRef.value && typeof paginationRef.value === 'object' ? paginationRef.value : {});
  const paginationTotal = computed(() => pagination.value.total || 0);
  const [innerPagination, setInnerPagination] = useState(() => ({
    current: 'defaultCurrent' in pagination.value ? pagination.value.defaultCurrent : 1,
    pageSize: 'defaultPageSize' in pagination.value ? pagination.value.defaultPageSize : DEFAULT_PAGE_SIZE
  }));
  // ============ Basic Pagination Config ============
  const mergedPagination = computed(() => {
    const mP = extendsObject(innerPagination.value, pagination.value, {
      total: paginationTotal.value > 0 ? paginationTotal.value : totalRef.value
    });
    // Reset `current` if data length or pageSize changed
    const maxPage = Math.ceil((paginationTotal.value || totalRef.value) / mP.pageSize);
    if (mP.current > maxPage) {
      // Prevent a maximum page count of 0
      mP.current = maxPage || 1;
    }
    return mP;
  });
  const refreshPagination = (current, pageSize) => {
    if (paginationRef.value === false) return;
    setInnerPagination({
      current: current !== null && current !== void 0 ? current : 1,
      pageSize: pageSize || mergedPagination.value.pageSize
    });
  };
  const onInternalChange = (current, pageSize) => {
    var _a, _b;
    if (paginationRef.value) {
      (_b = (_a = pagination.value).onChange) === null || _b === void 0 ? void 0 : _b.call(_a, current, pageSize);
    }
    refreshPagination(current, pageSize);
    onChange(current, pageSize || mergedPagination.value.pageSize);
  };
  return [computed(() => {
    return paginationRef.value === false ? {} : _extends(_extends({}, mergedPagination.value), {
      onChange: onInternalChange
    });
  }), refreshPagination];
}