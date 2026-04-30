import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode, Fragment as _Fragment } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import { presetPrimaryColors } from '@ant-design/colors';
import { computed, defineComponent } from 'vue';
import { progressProps } from './props';
import { getSize, getSuccessPercent, validProgress } from './utils';
import devWarning from '../vc-util/devWarning';
import { anyType, stringType } from '../_util/type';
export const lineProps = () => _extends(_extends({}, progressProps()), {
  strokeColor: anyType(),
  direction: stringType()
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
export const sortGradient = gradients => {
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
export const handleGradient = (strokeColor, directionConfig) => {
  const {
      from = presetPrimaryColors.blue,
      to = presetPrimaryColors.blue,
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
export default defineComponent({
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
    const backgroundProps = computed(() => {
      const {
        strokeColor,
        direction
      } = props;
      return strokeColor && typeof strokeColor !== 'string' ? handleGradient(strokeColor, direction) : {
        backgroundColor: strokeColor
      };
    });
    const borderRadius = computed(() => props.strokeLinecap === 'square' || props.strokeLinecap === 'butt' ? 0 : undefined);
    const trailStyle = computed(() => props.trailColor ? {
      backgroundColor: props.trailColor
    } : undefined);
    const mergedSize = computed(() => {
      var _a;
      return (_a = props.size) !== null && _a !== void 0 ? _a : [-1, props.strokeWidth || (props.size === 'small' ? 6 : 8)];
    });
    const sizeRef = computed(() => getSize(mergedSize.value, 'line', {
      strokeWidth: props.strokeWidth
    }));
    if (process.env.NODE_ENV !== 'production') {
      devWarning('strokeWidth' in props, 'Progress', '`strokeWidth` is deprecated. Please use `size` instead.');
    }
    const percentStyle = computed(() => {
      const {
        percent
      } = props;
      return _extends({
        width: `${validProgress(percent)}%`,
        height: `${sizeRef.value.height}px`,
        borderRadius: borderRadius.value
      }, backgroundProps.value);
    });
    const successPercent = computed(() => {
      return getSuccessPercent(props);
    });
    const successPercentStyle = computed(() => {
      const {
        success
      } = props;
      return {
        width: `${validProgress(successPercent.value)}%`,
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
      return _createVNode(_Fragment, null, [_createVNode("div", _objectSpread(_objectSpread({}, attrs), {}, {
        "class": [`${props.prefixCls}-outer`, attrs.class],
        "style": [attrs.style, outerStyle]
      }), [_createVNode("div", {
        "class": `${props.prefixCls}-inner`,
        "style": trailStyle.value
      }, [_createVNode("div", {
        "class": `${props.prefixCls}-bg`,
        "style": percentStyle.value
      }, null), successPercent.value !== undefined ? _createVNode("div", {
        "class": `${props.prefixCls}-success-bg`,
        "style": successPercentStyle.value
      }, null) : null])]), (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]);
    };
  }
});