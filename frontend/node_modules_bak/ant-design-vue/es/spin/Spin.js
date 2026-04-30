import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import { onBeforeUnmount, cloneVNode, isVNode, defineComponent, shallowRef, watch } from 'vue';
import { debounce } from 'throttle-debounce';
import PropTypes from '../_util/vue-types';
import { filterEmpty, getPropsSlot } from '../_util/props-util';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import useStyle from './style';
import useConfigInject from '../config-provider/hooks/useConfigInject';
export const spinProps = () => ({
  prefixCls: String,
  spinning: {
    type: Boolean,
    default: undefined
  },
  size: String,
  wrapperClassName: String,
  tip: PropTypes.any,
  delay: Number,
  indicator: PropTypes.any
});
// Render indicator
let defaultIndicator = null;
function shouldDelay(spinning, delay) {
  return !!spinning && !!delay && !isNaN(Number(delay));
}
export function setDefaultIndicator(Content) {
  const Indicator = Content.indicator;
  defaultIndicator = typeof Indicator === 'function' ? Indicator : () => _createVNode(Indicator, null, null);
}
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ASpin',
  inheritAttrs: false,
  props: initDefaultProps(spinProps(), {
    size: 'default',
    spinning: true,
    wrapperClassName: ''
  }),
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const {
      prefixCls,
      size,
      direction
    } = useConfigInject('spin', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const sSpinning = shallowRef(props.spinning && !shouldDelay(props.spinning, props.delay));
    let updateSpinning;
    watch([() => props.spinning, () => props.delay], () => {
      updateSpinning === null || updateSpinning === void 0 ? void 0 : updateSpinning.cancel();
      updateSpinning = debounce(props.delay, () => {
        sSpinning.value = props.spinning;
      });
      updateSpinning === null || updateSpinning === void 0 ? void 0 : updateSpinning();
    }, {
      immediate: true,
      flush: 'post'
    });
    onBeforeUnmount(() => {
      updateSpinning === null || updateSpinning === void 0 ? void 0 : updateSpinning.cancel();
    });
    return () => {
      var _a, _b;
      const {
          class: cls
        } = attrs,
        divProps = __rest(attrs, ["class"]);
      const {
        tip = (_a = slots.tip) === null || _a === void 0 ? void 0 : _a.call(slots)
      } = props;
      const children = (_b = slots.default) === null || _b === void 0 ? void 0 : _b.call(slots);
      const spinClassName = {
        [hashId.value]: true,
        [prefixCls.value]: true,
        [`${prefixCls.value}-sm`]: size.value === 'small',
        [`${prefixCls.value}-lg`]: size.value === 'large',
        [`${prefixCls.value}-spinning`]: sSpinning.value,
        [`${prefixCls.value}-show-text`]: !!tip,
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        [cls]: !!cls
      };
      function renderIndicator(prefixCls) {
        const dotClassName = `${prefixCls}-dot`;
        let indicator = getPropsSlot(slots, props, 'indicator');
        // should not be render default indicator when indicator value is null
        if (indicator === null) {
          return null;
        }
        if (Array.isArray(indicator)) {
          indicator = indicator.length === 1 ? indicator[0] : indicator;
        }
        if (isVNode(indicator)) {
          return cloneVNode(indicator, {
            class: dotClassName
          });
        }
        if (defaultIndicator && isVNode(defaultIndicator())) {
          return cloneVNode(defaultIndicator(), {
            class: dotClassName
          });
        }
        return _createVNode("span", {
          "class": `${dotClassName} ${prefixCls}-dot-spin`
        }, [_createVNode("i", {
          "class": `${prefixCls}-dot-item`
        }, null), _createVNode("i", {
          "class": `${prefixCls}-dot-item`
        }, null), _createVNode("i", {
          "class": `${prefixCls}-dot-item`
        }, null), _createVNode("i", {
          "class": `${prefixCls}-dot-item`
        }, null)]);
      }
      const spinElement = _createVNode("div", _objectSpread(_objectSpread({}, divProps), {}, {
        "class": spinClassName,
        "aria-live": "polite",
        "aria-busy": sSpinning.value
      }), [renderIndicator(prefixCls.value), tip ? _createVNode("div", {
        "class": `${prefixCls.value}-text`
      }, [tip]) : null]);
      if (children && filterEmpty(children).length) {
        const containerClassName = {
          [`${prefixCls.value}-container`]: true,
          [`${prefixCls.value}-blur`]: sSpinning.value
        };
        return wrapSSR(_createVNode("div", {
          "class": [`${prefixCls.value}-nested-loading`, props.wrapperClassName, hashId.value]
        }, [sSpinning.value && _createVNode("div", {
          "key": "loading"
        }, [spinElement]), _createVNode("div", {
          "class": containerClassName,
          "key": "container"
        }, [children])]));
      }
      return wrapSSR(spinElement);
    };
  }
});