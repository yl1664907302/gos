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
import omit from '../_util/omit';
import { tupleNum } from '../_util/type';
import warning from '../_util/warning';
import Base, { baseProps } from './Base';
const TITLE_ELE_LIST = tupleNum(1, 2, 3, 4, 5);
export const titleProps = () => _extends(_extends({}, omit(baseProps(), ['component', 'strong'])), {
  level: Number
});
const Title = (props, _ref) => {
  let {
    slots,
    attrs
  } = _ref;
  const {
      level = 1
    } = props,
    restProps = __rest(props, ["level"]);
  let component;
  if (TITLE_ELE_LIST.includes(level)) {
    component = `h${level}`;
  } else {
    warning(false, 'Typography', 'Title only accept `1 | 2 | 3 | 4 | 5` as `level` value.');
    component = 'h1';
  }
  const titleProps = _extends(_extends(_extends({}, restProps), {
    component
  }), attrs);
  return _createVNode(Base, titleProps, slots);
};
Title.displayName = 'ATypographyTitle';
Title.inheritAttrs = false;
Title.props = titleProps();
export default Title;