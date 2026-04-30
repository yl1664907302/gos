"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
function UnitNumber(_ref) {
  let {
    prefixCls,
    value,
    current,
    offset = 0
  } = _ref;
  let style;
  if (offset) {
    style = {
      position: 'absolute',
      top: `${offset}00%`,
      left: 0
    };
  }
  return (0, _vue.createVNode)("p", {
    "style": style,
    "class": (0, _classNames.default)(`${prefixCls}-only-unit`, {
      current
    })
  }, [value]);
}
function getOffset(start, end, unit) {
  let index = start;
  let offset = 0;
  while ((index + 10) % 10 !== end) {
    index += unit;
    offset += unit;
  }
  return offset;
}
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'SingleNumber',
  props: {
    prefixCls: String,
    value: String,
    count: Number
  },
  setup(props) {
    const originValue = (0, _vue.computed)(() => Number(props.value));
    const originCount = (0, _vue.computed)(() => Math.abs(props.count));
    const state = (0, _vue.reactive)({
      prevValue: originValue.value,
      prevCount: originCount.value
    });
    // ============================= Events =============================
    const onTransitionEnd = () => {
      state.prevValue = originValue.value;
      state.prevCount = originCount.value;
    };
    const timeout = (0, _vue.ref)();
    // Fallback if transition event not support
    (0, _vue.watch)(originValue, () => {
      clearTimeout(timeout.value);
      timeout.value = setTimeout(() => {
        onTransitionEnd();
      }, 1000);
    }, {
      flush: 'post'
    });
    (0, _vue.onUnmounted)(() => {
      clearTimeout(timeout.value);
    });
    return () => {
      let unitNodes;
      let offsetStyle = {};
      const value = originValue.value;
      if (state.prevValue === value || Number.isNaN(value) || Number.isNaN(state.prevValue)) {
        // Nothing to change
        unitNodes = [UnitNumber((0, _extends2.default)((0, _extends2.default)({}, props), {
          current: true
        }))];
        offsetStyle = {
          transition: 'none'
        };
      } else {
        unitNodes = [];
        // Fill basic number units
        const end = value + 10;
        const unitNumberList = [];
        for (let index = value; index <= end; index += 1) {
          unitNumberList.push(index);
        }
        // Fill with number unit nodes
        const prevIndex = unitNumberList.findIndex(n => n % 10 === state.prevValue);
        unitNodes = unitNumberList.map((n, index) => {
          const singleUnit = n % 10;
          return UnitNumber((0, _extends2.default)((0, _extends2.default)({}, props), {
            value: singleUnit,
            offset: index - prevIndex,
            current: index === prevIndex
          }));
        });
        // Calculate container offset value
        const unit = state.prevCount < originCount.value ? 1 : -1;
        offsetStyle = {
          transform: `translateY(${-getOffset(state.prevValue, value, unit)}00%)`
        };
      }
      return (0, _vue.createVNode)("span", {
        "class": `${props.prefixCls}-only`,
        "style": offsetStyle,
        "onTransitionend": () => onTransitionEnd()
      }, [unitNodes]);
    };
  }
});