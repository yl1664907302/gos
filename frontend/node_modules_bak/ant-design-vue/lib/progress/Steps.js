"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stepsProps = exports.default = void 0;
var _vue = require("vue");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _type = require("../_util/type");
var _props = require("./props");
var _utils = require("./utils");
const stepsProps = () => (0, _extends2.default)((0, _extends2.default)({}, (0, _props.progressProps)()), {
  steps: Number,
  strokeColor: (0, _type.someType)(),
  trailColor: String
});
exports.stepsProps = stepsProps;
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'Steps',
  props: stepsProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const current = (0, _vue.computed)(() => Math.round(props.steps * ((props.percent || 0) / 100)));
    const mergedSize = (0, _vue.computed)(() => {
      var _a;
      return (_a = props.size) !== null && _a !== void 0 ? _a : [props.size === 'small' ? 2 : 14, props.strokeWidth || 8];
    });
    const sizeRef = (0, _vue.computed)(() => (0, _utils.getSize)(mergedSize.value, 'step', {
      steps: props.steps,
      strokeWidth: props.strokeWidth || 8
    }));
    const styledSteps = (0, _vue.computed)(() => {
      const {
        steps,
        strokeColor,
        trailColor,
        prefixCls
      } = props;
      const temp = [];
      for (let i = 0; i < steps; i += 1) {
        const color = Array.isArray(strokeColor) ? strokeColor[i] : strokeColor;
        const cls = {
          [`${prefixCls}-steps-item`]: true,
          [`${prefixCls}-steps-item-active`]: i <= current.value - 1
        };
        temp.push((0, _vue.createVNode)("div", {
          "key": i,
          "class": cls,
          "style": {
            backgroundColor: i <= current.value - 1 ? color : trailColor,
            width: `${sizeRef.value.width / steps}px`,
            height: `${sizeRef.value.height}px`
          }
        }, null));
      }
      return temp;
    });
    return () => {
      var _a;
      return (0, _vue.createVNode)("div", {
        "class": `${props.prefixCls}-steps-outer`
      }, [styledSteps.value, (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]);
    };
  }
});