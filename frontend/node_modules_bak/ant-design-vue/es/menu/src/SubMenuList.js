import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
import classNames from '../../_util/classNames';
import { useInjectMenu } from './hooks/useMenuContext';
const InternalSubMenuList = (_props, _ref) => {
  let {
    slots,
    attrs
  } = _ref;
  var _a;
  const {
    prefixCls,
    mode
  } = useInjectMenu();
  return _createVNode("ul", _objectSpread(_objectSpread({}, attrs), {}, {
    "class": classNames(prefixCls.value, `${prefixCls.value}-sub`, `${prefixCls.value}-${mode.value === 'inline' ? 'inline' : 'vertical'}`),
    "data-menu-list": true
  }), [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]);
};
InternalSubMenuList.displayName = 'SubMenuList';
export default InternalSubMenuList;