"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.menuDividerProps = exports.default = void 0;
var _vue = require("vue");
var _useMenuContext = require("./hooks/useMenuContext");
const menuDividerProps = () => ({
  prefixCls: String,
  dashed: Boolean
});
exports.menuDividerProps = menuDividerProps;
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'AMenuDivider',
  props: menuDividerProps(),
  setup(props) {
    const {
      prefixCls
    } = (0, _useMenuContext.useInjectMenu)();
    const cls = (0, _vue.computed)(() => {
      return {
        [`${prefixCls.value}-item-divider`]: true,
        [`${prefixCls.value}-item-divider-dashed`]: !!props.dashed
      };
    });
    return () => {
      return (0, _vue.createVNode)("li", {
        "class": cls.value
      }, null);
    };
  }
});