"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_PAGE_SIZE = void 0;
exports.default = usePagination;
exports.getPaginationParam = getPaginationParam;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _useState = _interopRequireDefault(require("../../_util/hooks/useState"));
var _vue = require("vue");
var _extendsObject = _interopRequireDefault(require("../../_util/extendsObject"));
const DEFAULT_PAGE_SIZE = exports.DEFAULT_PAGE_SIZE = 10;
function getPaginationParam(mergedPagination, pagination) {
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
function usePagination(totalRef, paginationRef, onChange) {
  const pagination = (0, _vue.computed)(() => paginationRef.value && typeof paginationRef.value === 'object' ? paginationRef.value : {});
  const paginationTotal = (0, _vue.computed)(() => pagination.value.total || 0);
  const [innerPagination, setInnerPagination] = (0, _useState.default)(() => ({
    current: 'defaultCurrent' in pagination.value ? pagination.value.defaultCurrent : 1,
    pageSize: 'defaultPageSize' in pagination.value ? pagination.value.defaultPageSize : DEFAULT_PAGE_SIZE
  }));
  // ============ Basic Pagination Config ============
  const mergedPagination = (0, _vue.computed)(() => {
    const mP = (0, _extendsObject.default)(innerPagination.value, pagination.value, {
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
  return [(0, _vue.computed)(() => {
    return paginationRef.value === false ? {} : (0, _extends2.default)((0, _extends2.default)({}, mergedPagination.value), {
      onChange: onInternalChange
    });
  }), refreshPagination];
}