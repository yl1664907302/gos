"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _classNames = _interopRequireDefault(require("../../_util/classNames"));
var _useMenuContext = require("./hooks/useMenuContext");
const InternalSubMenuList = (_props, _ref) => {
  let {
    slots,
    attrs
  } = _ref;
  var _a;
  const {
    prefixCls,
    mode
  } = (0, _useMenuContext.useInjectMenu)();
  return (0, _vue.createVNode)("ul", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
    "class": (0, _classNames.default)(prefixCls.value, `${prefixCls.value}-sub`, `${prefixCls.value}-${mode.value === 'inline' ? 'inline' : 'vertical'}`),
    "data-menu-list": true
  }), [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]);
};
InternalSubMenuList.displayName = 'SubMenuList';
var _default = exports.default = InternalSubMenuList;