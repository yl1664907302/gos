import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode, resolveDirective as _resolveDirective } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import warning from '../_util/warning';
import Base, { baseProps } from './Base';
import omit from '../_util/omit';
export const linkProps = () => omit(_extends(_extends({}, baseProps()), {
  ellipsis: {
    type: Boolean,
    default: undefined
  }
}), ['component']);
const Link = (props, _ref) => {
  let {
    slots,
    attrs
  } = _ref;
  const _a = _extends(_extends({}, props), attrs),
    {
      ellipsis,
      rel
    } = _a,
    restProps = __rest(_a, ["ellipsis", "rel"]);
  warning(typeof ellipsis !== 'object', 'Typography.Link', '`ellipsis` only supports boolean value.');
  const mergedProps = _extends(_extends({}, restProps), {
    rel: rel === undefined && restProps.target === '_blank' ? 'noopener noreferrer' : rel,
    ellipsis: !!ellipsis,
    component: 'a'
  });
  // https://github.com/ant-design/ant-design/issues/26622
  // @ts-ignore
  delete mergedProps.navigate;
  return _createVNode(Base, mergedProps, slots);
};
Link.displayName = 'ATypographyLink';
Link.inheritAttrs = false;
Link.props = linkProps();
export default Link;