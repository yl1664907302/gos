"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.setDefaultIndicator = setDefaultIndicator;
exports.spinProps = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _throttleDebounce = require("throttle-debounce");
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _propsUtil = require("../_util/props-util");
var _initDefaultProps = _interopRequireDefault(require("../_util/props-util/initDefaultProps"));
var _style = _interopRequireDefault(require("./style"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const spinProps = () => ({
  prefixCls: String,
  spinning: {
    type: Boolean,
    default: undefined
  },
  size: String,
  wrapperClassName: String,
  tip: _vueTypes.default.any,
  delay: Number,
  indicator: _vueTypes.default.any
});
// Render indicator
exports.spinProps = spinProps;
let defaultIndicator = null;
function shouldDelay(spinning, delay) {
  return !!spinning && !!delay && !isNaN(Number(delay));
}
function setDefaultIndicator(Content) {
  const Indicator = Content.indicator;
  defaultIndicator = typeof Indicator === 'function' ? Indicator : () => (0, _vue.createVNode)(Indicator, null, null);
}
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ASpin',
  inheritAttrs: false,
  props: (0, _initDefaultProps.default)(spinProps(), {
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
    } = (0, _useConfigInject.default)('spin', props);
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const sSpinning = (0, _vue.shallowRef)(props.spinning && !shouldDelay(props.spinning, props.delay));
    let updateSpinning;
    (0, _vue.watch)([() => props.spinning, () => props.delay], () => {
      updateSpinning === null || updateSpinning === void 0 ? void 0 : updateSpinning.cancel();
      updateSpinning = (0, _throttleDebounce.debounce)(props.delay, () => {
        sSpinning.value = props.spinning;
      });
      updateSpinning === null || updateSpinning === void 0 ? void 0 : updateSpinning();
    }, {
      immediate: true,
      flush: 'post'
    });
    (0, _vue.onBeforeUnmount)(() => {
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
        let indicator = (0, _propsUtil.getPropsSlot)(slots, props, 'indicator');
        // should not be render default indicator when indicator value is null
        if (indicator === null) {
          return null;
        }
        if (Array.isArray(indicator)) {
          indicator = indicator.length === 1 ? indicator[0] : indicator;
        }
        if ((0, _vue.isVNode)(indicator)) {
          return (0, _vue.cloneVNode)(indicator, {
            class: dotClassName
          });
        }
        if (defaultIndicator && (0, _vue.isVNode)(defaultIndicator())) {
          return (0, _vue.cloneVNode)(defaultIndicator(), {
            class: dotClassName
          });
        }
        return (0, _vue.createVNode)("span", {
          "class": `${dotClassName} ${prefixCls}-dot-spin`
        }, [(0, _vue.createVNode)("i", {
          "class": `${prefixCls}-dot-item`
        }, null), (0, _vue.createVNode)("i", {
          "class": `${prefixCls}-dot-item`
        }, null), (0, _vue.createVNode)("i", {
          "class": `${prefixCls}-dot-item`
        }, null), (0, _vue.createVNode)("i", {
          "class": `${prefixCls}-dot-item`
        }, null)]);
      }
      const spinElement = (0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, divProps), {}, {
        "class": spinClassName,
        "aria-live": "polite",
        "aria-busy": sSpinning.value
      }), [renderIndicator(prefixCls.value), tip ? (0, _vue.createVNode)("div", {
        "class": `${prefixCls.value}-text`
      }, [tip]) : null]);
      if (children && (0, _propsUtil.filterEmpty)(children).length) {
        const containerClassName = {
          [`${prefixCls.value}-container`]: true,
          [`${prefixCls.value}-blur`]: sSpinning.value
        };
        return wrapSSR((0, _vue.createVNode)("div", {
          "class": [`${prefixCls.value}-nested-loading`, props.wrapperClassName, hashId.value]
        }, [sSpinning.value && (0, _vue.createVNode)("div", {
          "key": "loading"
        }, [spinElement]), (0, _vue.createVNode)("div", {
          "class": containerClassName,
          "key": "container"
        }, [children])]));
      }
      return wrapSSR(spinElement);
    };
  }
});