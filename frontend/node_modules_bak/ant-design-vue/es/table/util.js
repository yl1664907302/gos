import _extends from "@babel/runtime/helpers/esm/extends";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import { camelize, flattenChildren } from '../_util/props-util';
export function getColumnKey(column, defaultKey) {
  if ('key' in column && column.key !== undefined && column.key !== null) {
    return column.key;
  }
  if (column.dataIndex) {
    return Array.isArray(column.dataIndex) ? column.dataIndex.join('.') : column.dataIndex;
  }
  return defaultKey;
}
export function getColumnPos(index, pos) {
  return pos ? `${pos}-${index}` : `${index}`;
}
export function renderColumnTitle(title, props) {
  if (typeof title === 'function') {
    return title(props);
  }
  return title;
}
export function convertChildrenToColumns() {
  let elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  const flattenElements = flattenChildren(elements);
  const columns = [];
  flattenElements.forEach(element => {
    var _a, _b, _c, _d;
    if (!element) {
      return;
    }
    const key = element.key;
    const style = ((_a = element.props) === null || _a === void 0 ? void 0 : _a.style) || {};
    const cls = ((_b = element.props) === null || _b === void 0 ? void 0 : _b.class) || '';
    const props = element.props || {};
    for (const [k, v] of Object.entries(props)) {
      props[camelize(k)] = v;
    }
    const _e = element.children || {},
      {
        default: children
      } = _e,
      restSlots = __rest(_e, ["default"]);
    const column = _extends(_extends(_extends({}, restSlots), props), {
      style,
      class: cls
    });
    if (key) {
      column.key = key;
    }
    if ((_c = element.type) === null || _c === void 0 ? void 0 : _c.__ANT_TABLE_COLUMN_GROUP) {
      column.children = convertChildrenToColumns(typeof children === 'function' ? children() : children);
    } else {
      const customRender = (_d = element.children) === null || _d === void 0 ? void 0 : _d.default;
      column.customRender = column.customRender || customRender;
    }
    columns.push(column);
  });
  return columns;
}