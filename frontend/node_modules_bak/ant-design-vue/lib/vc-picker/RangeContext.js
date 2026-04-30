"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useProvideRange = exports.useInjectRange = exports.default = exports.RangeContextProvider = void 0;
var _vue = require("vue");
const RangeContextKey = Symbol('RangeContextProps');
const useProvideRange = props => {
  (0, _vue.provide)(RangeContextKey, props);
};
exports.useProvideRange = useProvideRange;
const useInjectRange = () => {
  return (0, _vue.inject)(RangeContextKey, {
    rangedValue: (0, _vue.ref)(),
    hoverRangedValue: (0, _vue.ref)(),
    inRange: (0, _vue.ref)(),
    panelPosition: (0, _vue.ref)()
  });
};
exports.useInjectRange = useInjectRange;
const RangeContextProvider = exports.RangeContextProvider = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'PanelContextProvider',
  inheritAttrs: false,
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const value = {
      rangedValue: (0, _vue.ref)(props.value.rangedValue),
      hoverRangedValue: (0, _vue.ref)(props.value.hoverRangedValue),
      inRange: (0, _vue.ref)(props.value.inRange),
      panelPosition: (0, _vue.ref)(props.value.panelPosition)
    };
    useProvideRange(value);
    _vue.toRef;
    (0, _vue.watch)(() => props.value, () => {
      Object.keys(props.value).forEach(key => {
        if (value[key]) {
          value[key].value = props.value[key];
        }
      });
    });
    return () => {
      var _a;
      return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
    };
  }
});
var _default = exports.default = RangeContextKey;