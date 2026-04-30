"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _default = exports.default = (0, _vue.defineComponent)({
  name: 'PresetPanel',
  props: {
    prefixCls: String,
    presets: {
      type: Array,
      default: () => []
    },
    onClick: Function,
    onHover: Function
  },
  setup(props) {
    return () => {
      if (!props.presets.length) {
        return null;
      }
      return (0, _vue.createVNode)("div", {
        "class": `${props.prefixCls}-presets`
      }, [(0, _vue.createVNode)("ul", null, [props.presets.map((_ref, index) => {
        let {
          label,
          value
        } = _ref;
        return (0, _vue.createVNode)("li", {
          "key": index,
          "onClick": e => {
            e.stopPropagation();
            props.onClick(value);
          },
          "onMouseenter": () => {
            var _a;
            (_a = props.onHover) === null || _a === void 0 ? void 0 : _a.call(props, value);
          },
          "onMouseleave": () => {
            var _a;
            (_a = props.onHover) === null || _a === void 0 ? void 0 : _a.call(props, null);
          }
        }, [label]);
      })])]);
    };
  }
});