"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.cardGridProps = void 0;
var _vue = require("vue");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
const cardGridProps = () => ({
  prefixCls: String,
  hoverable: {
    type: Boolean,
    default: true
  }
});
exports.cardGridProps = cardGridProps;
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ACardGrid',
  __ANT_CARD_GRID: true,
  props: cardGridProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      prefixCls
    } = (0, _useConfigInject.default)('card', props);
    const classNames = (0, _vue.computed)(() => {
      return {
        [`${prefixCls.value}-grid`]: true,
        [`${prefixCls.value}-grid-hoverable`]: props.hoverable
      };
    });
    return () => {
      var _a;
      return (0, _vue.createVNode)("div", {
        "class": classNames.value
      }, [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]);
    };
  }
});