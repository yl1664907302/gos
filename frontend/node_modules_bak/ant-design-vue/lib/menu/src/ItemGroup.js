"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.menuItemGroupProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _propsUtil = require("../../_util/props-util");
var _vueTypes = _interopRequireDefault(require("../../_util/vue-types"));
var _useMenuContext = require("./hooks/useMenuContext");
var _useKeyPath = require("./hooks/useKeyPath");
var _type = require("../../_util/type");
const menuItemGroupProps = () => ({
  title: _vueTypes.default.any,
  // Internal user prop
  originItemValue: (0, _type.objectType)()
});
exports.menuItemGroupProps = menuItemGroupProps;
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'AMenuItemGroup',
  inheritAttrs: false,
  props: menuItemGroupProps(),
  slots: Object,
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const {
      prefixCls
    } = (0, _useMenuContext.useInjectMenu)();
    const groupPrefixCls = (0, _vue.computed)(() => `${prefixCls.value}-item-group`);
    const isMeasure = (0, _useKeyPath.useMeasure)();
    return () => {
      var _a, _b;
      if (isMeasure) return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
      return (0, _vue.createVNode)("li", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "onClick": e => e.stopPropagation(),
        "class": groupPrefixCls.value
      }), [(0, _vue.createVNode)("div", {
        "title": typeof props.title === 'string' ? props.title : undefined,
        "class": `${groupPrefixCls.value}-title`
      }, [(0, _propsUtil.getPropsSlot)(slots, props, 'title')]), (0, _vue.createVNode)("ul", {
        "class": `${groupPrefixCls.value}-list`
      }, [(_b = slots.default) === null || _b === void 0 ? void 0 : _b.call(slots)])]);
    };
  }
});