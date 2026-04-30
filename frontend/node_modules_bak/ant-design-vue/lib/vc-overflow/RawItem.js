"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _context = require("./context");
var _Item = _interopRequireDefault(require("./Item"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'RawItem',
  inheritAttrs: false,
  props: {
    component: _vueTypes.default.any,
    title: _vueTypes.default.any,
    id: String,
    onMouseenter: {
      type: Function
    },
    onMouseleave: {
      type: Function
    },
    onClick: {
      type: Function
    },
    onKeydown: {
      type: Function
    },
    onFocus: {
      type: Function
    },
    role: String,
    tabindex: Number
  },
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const context = (0, _context.useInjectOverflowContext)();
    return () => {
      var _a;
      // Render directly when context not provided
      if (!context.value) {
        const {
            component: Component = 'div'
          } = props,
          restProps = __rest(props, ["component"]);
        return (0, _vue.createVNode)(Component, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, restProps), attrs), {
          default: () => [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]
        });
      }
      const _b = context.value,
        {
          className: contextClassName
        } = _b,
        restContext = __rest(_b, ["className"]);
      const {
          class: className
        } = attrs,
        restProps = __rest(attrs, ["class"]);
      // Do not pass context to sub item to avoid multiple measure
      return (0, _vue.createVNode)(_context.OverflowContextProvider, {
        "value": null
      }, {
        default: () => [(0, _vue.createVNode)(_Item.default, (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({
          "class": (0, _classNames.default)(contextClassName, className)
        }, restContext), restProps), props), slots)]
      });
    };
  }
});