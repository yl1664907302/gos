"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sortGradient = exports.lineProps = exports.handleGradient = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _colors = require("@ant-design/colors");
var _props = require("./props");
var _utils = require("./utils");
var _devWarning = _interopRequireDefault(require("../vc-util/devWarning"));
var _type = require("../_util/type");
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const lineProps = () => (0, _extends2.default)((0, _extends2.default)({}, (0, _props.progressProps)()), {
  strokeColor: (0, _type.anyType)(),
  direction: (0, _type.stringType)()
});
/**
 * {
 *   '0%': '#afc163',
 *   '75%': '#009900',
 *   '50%': 'green',     ====>     '#afc163 0%, #66FF00 25%, #00CC00 50%, #009900 75%, #ffffff 100%'
 *   '25%': '#66FF00',
 *   '100%': '#ffffff'
 * }
 */
exports.lineProps = lineProps;
const sortGradient = gradients => {
  let tempArr = [];
  Object.keys(gradients).forEach(key => {
    const formattedKey = parseFloat(key.replace(/%/g, ''));
    if (!isNaN(formattedKey)) {
      tempArr.push({
        key: formattedKey,
        value: gradients[key]
      });
    }
  });
  tempArr = tempArr.sort((a, b) => a.key - b.key);
  return tempArr.map(_ref => {
    let {
      key,
      value
    } = _ref;
    return `${value} ${key}%`;
  }).join(', ');
};
/**
 * Then this man came to realize the truth: Besides six pence, there is the moon. Besides bread and
 * butter, there is the bug. And... Besides women, there is the code.
 *
 * @example
 *   {
 *     "0%": "#afc163",
 *     "25%": "#66FF00",
 *     "50%": "#00CC00", // ====>  linear-gradient(to right, #afc163 0%, #66FF00 25%,
 *     "75%": "#009900", //        #00CC00 50%, #009900 75%, #ffffff 100%)
 *     "100%": "#ffffff"
 *   }
 */
exports.sortGradient = sortGradient;
const handleGradient = (strokeColor, directionConfig) => {
  const {
      from = _colors.presetPrimaryColors.blue,
      to = _colors.presetPrimaryColors.blue,
      direction = directionConfig === 'rtl' ? 'to left' : 'to right'
    } = strokeColor,
    rest = __rest(strokeColor, ["from", "to", "direction"]);
  if (Object.keys(rest).length !== 0) {
    const sortedGradients = sortGradient(rest);
    return {
      backgroundImage: `linear-gradient(${direction}, ${sortedGradients})`
    };
  }
  return {
    backgroundImage: `linear-gradient(${direction}, ${from}, ${to})`
  };
};
exports.handleGradient = handleGradient;
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ProgressLine',
  inheritAttrs: false,
  props: lineProps(),
  setup(props, _ref2) {
    let {
      slots,
      attrs
    } = _ref2;
    const backgroundProps = (0, _vue.computed)(() => {
      const {
        strokeColor,
        direction
      } = props;
      return strokeColor && typeof strokeColor !== 'string' ? handleGradient(strokeColor, direction) : {
        backgroundColor: strokeColor
      };
    });
    const borderRadius = (0, _vue.computed)(() => props.strokeLinecap === 'square' || props.strokeLinecap === 'butt' ? 0 : undefined);
    const trailStyle = (0, _vue.computed)(() => props.trailColor ? {
      backgroundColor: props.trailColor
    } : undefined);
    const mergedSize = (0, _vue.computed)(() => {
      var _a;
      return (_a = props.size) !== null && _a !== void 0 ? _a : [-1, props.strokeWidth || (props.size === 'small' ? 6 : 8)];
    });
    const sizeRef = (0, _vue.computed)(() => (0, _utils.getSize)(mergedSize.value, 'line', {
      strokeWidth: props.strokeWidth
    }));
    if (process.env.NODE_ENV !== 'production') {
      (0, _devWarning.default)('strokeWidth' in props, 'Progress', '`strokeWidth` is deprecated. Please use `size` instead.');
    }
    const percentStyle = (0, _vue.computed)(() => {
      const {
        percent
      } = props;
      return (0, _extends2.default)({
        width: `${(0, _utils.validProgress)(percent)}%`,
        height: `${sizeRef.value.height}px`,
        borderRadius: borderRadius.value
      }, backgroundProps.value);
    });
    const successPercent = (0, _vue.computed)(() => {
      return (0, _utils.getSuccessPercent)(props);
    });
    const successPercentStyle = (0, _vue.computed)(() => {
      const {
        success
      } = props;
      return {
        width: `${(0, _utils.validProgress)(successPercent.value)}%`,
        height: `${sizeRef.value.height}px`,
        borderRadius: borderRadius.value,
        backgroundColor: success === null || success === void 0 ? void 0 : success.strokeColor
      };
    });
    const outerStyle = {
      width: sizeRef.value.width < 0 ? '100%' : sizeRef.value.width,
      height: `${sizeRef.value.height}px`
    };
    return () => {
      var _a;
      return (0, _vue.createVNode)(_vue.Fragment, null, [(0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "class": [`${props.prefixCls}-outer`, attrs.class],
        "style": [attrs.style, outerStyle]
      }), [(0, _vue.createVNode)("div", {
        "class": `${props.prefixCls}-inner`,
        "style": trailStyle.value
      }, [(0, _vue.createVNode)("div", {
        "class": `${props.prefixCls}-bg`,
        "style": percentStyle.value
      }, null), successPercent.value !== undefined ? (0, _vue.createVNode)("div", {
        "class": `${props.prefixCls}-success-bg`,
        "style": successPercentStyle.value
      }, null) : null])]), (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]);
    };
  }
});