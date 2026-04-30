"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _legacyUtil = require("./utils/legacyUtil");
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
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
    const additionalProps = column && column[_legacyUtil.INTERNAL_COL_DEFINE];
    if (width || additionalProps || mustInsert) {
      const _a = additionalProps || {},
        {
          columnType
        } = _a,
        restAdditionalProps = __rest(_a, ["columnType"]);
      cols.unshift((0, _vue.createVNode)("col", (0, _objectSpread2.default)({
        "key": i,
        "style": {
          width: typeof width === 'number' ? `${width}px` : width
        }
      }, restAdditionalProps), null));
      mustInsert = true;
    }
  }
  return (0, _vue.createVNode)("colgroup", null, [cols]);
}
var _default = exports.default = ColGroup;