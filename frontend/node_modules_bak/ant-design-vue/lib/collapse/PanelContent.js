"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _commonProps = require("./commonProps");
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'PanelContent',
  props: (0, _commonProps.collapsePanelProps)(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const rendered = (0, _vue.shallowRef)(false);
    (0, _vue.watchEffect)(() => {
      if (props.isActive || props.forceRender) {
        rendered.value = true;
      }
    });
    return () => {
      var _a;
      if (!rendered.value) return null;
      const {
        prefixCls,
        isActive,
        role
      } = props;
      return (0, _vue.createVNode)("div", {
        "class": (0, _classNames.default)(`${prefixCls}-content`, {
          [`${prefixCls}-content-active`]: isActive,
          [`${prefixCls}-content-inactive`]: !isActive
        }),
        "role": role
      }, [(0, _vue.createVNode)("div", {
        "class": `${prefixCls}-content-box`
      }, [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)])]);
    };
  }
});