import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import { INTERNAL_COL_DEFINE } from './utils/legacyUtil';
function ColGroup(_ref) {
  let {
    colWidths,
    columns,
    columCount
  } = _ref;
  const cols = [];
  const len = columCount || columns.length;
  // Only insert col with width & additional props
  // Skip if rest col do not have any useful info
  let mustInsert = false;
  for (let i = len - 1; i >= 0; i -= 1) {
    const width = colWidths[i];
    const column = columns && columns[i];
    const additionalProps = column && column[INTERNAL_COL_DEFINE];
    if (width || additionalProps || mustInsert) {
      const _a = additionalProps || {},
        {
          columnType
        } = _a,
        restAdditionalProps = __rest(_a, ["columnType"]);
      cols.unshift(_createVNode("col", _objectSpread({
        "key": i,
        "style": {
          width: typeof width === 'number' ? `${width}px` : width
        }
      }, restAdditionalProps), null));
      mustInsert = true;
    }
  }
  return _createVNode("colgroup", null, [cols]);
}
export default ColGroup;