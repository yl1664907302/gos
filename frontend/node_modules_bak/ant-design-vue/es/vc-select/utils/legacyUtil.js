import _extends from "@babel/runtime/helpers/esm/extends";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import { flattenChildren, isValidElement } from '../../_util/props-util';
function convertNodeToOption(node) {
  const _a = node,
    {
      key,
      children
    } = _a,
    _b = _a.props,
    {
      value,
      disabled
    } = _b,
    restProps = __rest(_b, ["value", "disabled"]);
  const child = children === null || children === void 0 ? void 0 : children.default;
  return _extends({
    key,
    value: value !== undefined ? value : key,
    children: child,
    disabled: disabled || disabled === ''
  }, restProps);
}
export function convertChildrenToData(nodes) {
  let optionOnly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  const dd = flattenChildren(nodes).map((node, index) => {
    var _a;
    if (!isValidElement(node) || !node.type) {
      return null;
    }
    const {
      type: {
        isSelectOptGroup
      },
      key,
      children,
      props
    } = node;
    if (optionOnly || !isSelectOptGroup) {
      return convertNodeToOption(node);
    }
    const child = children && children.default ? children.default() : undefined;
    const label = (props === null || props === void 0 ? void 0 : props.label) || ((_a = children.label) === null || _a === void 0 ? void 0 : _a.call(children)) || key;
    return _extends(_extends({
      key: `__RC_SELECT_GRP__${key === null ? index : String(key)}__`
    }, props), {
      label,
      options: convertChildrenToData(child || [])
    });
  }).filter(data => data);
  return dd;
}