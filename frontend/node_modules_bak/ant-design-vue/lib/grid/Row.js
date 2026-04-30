"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rowProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _responsiveObserve = _interopRequireWildcard(require("../_util/responsiveObserve"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _useFlexGapSupport = _interopRequireDefault(require("../_util/hooks/useFlexGapSupport"));
var _context = _interopRequireDefault(require("./context"));
var _style = require("./style");
var _type = require("../_util/type");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const RowAligns = ['top', 'middle', 'bottom', 'stretch'];
const RowJustify = ['start', 'end', 'center', 'space-around', 'space-between', 'space-evenly'];
const rowProps = () => ({
  align: (0, _type.someType)([String, Object]),
  justify: (0, _type.someType)([String, Object]),
  prefixCls: String,
  gutter: (0, _type.someType)([Number, Array, Object], 0),
  wrap: {
    type: Boolean,
    default: undefined
  }
});
exports.rowProps = rowProps;
const ARow = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ARow',
  inheritAttrs: false,
  props: rowProps(),
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const {
      prefixCls,
      direction
    } = (0, _useConfigInject.default)('row', props);
    const [wrapSSR, hashId] = (0, _style.useRowStyle)(prefixCls);
    let token;
    const responsiveObserve = (0, _responsiveObserve.default)();
    const screens = (0, _vue.ref)({
      xs: true,
      sm: true,
      md: true,
      lg: true,
      xl: true,
      xxl: true
    });
    const curScreens = (0, _vue.ref)({
      xs: false,
      sm: false,
      md: false,
      lg: false,
      xl: false,
      xxl: false
    });
    const mergePropsByScreen = oriProp => {
      return (0, _vue.computed)(() => {
        if (typeof props[oriProp] === 'string') {
          return props[oriProp];
        }
        if (typeof props[oriProp] !== 'object') {
          return '';
        }
        for (let i = 0; i < _responsiveObserve.responsiveArray.length; i++) {
          const breakpoint = _responsiveObserve.responsiveArray[i];
          // if do not match, do nothing
          if (!curScreens.value[breakpoint]) continue;
          const curVal = props[oriProp][breakpoint];
          if (curVal !== undefined) {
            return curVal;
          }
        }
        return '';
      });
    };
    const mergeAlign = mergePropsByScreen('align');
    const mergeJustify = mergePropsByScreen('justify');
    const supportFlexGap = (0, _useFlexGapSupport.default)();
    (0, _vue.onMounted)(() => {
      token = responsiveObserve.value.subscribe(screen => {
        curScreens.value = screen;
        const currentGutter = props.gutter || 0;
        if (!Array.isArray(currentGutter) && typeof currentGutter === 'object' || Array.isArray(currentGutter) && (typeof currentGutter[0] === 'object' || typeof currentGutter[1] === 'object')) {
          screens.value = screen;
        }
      });
    });
    (0, _vue.onBeforeUnmount)(() => {
      responsiveObserve.value.unsubscribe(token);
    });
    const gutter = (0, _vue.computed)(() => {
      const results = [undefined, undefined];
      const {
        gutter = 0
      } = props;
      const normalizedGutter = Array.isArray(gutter) ? gutter : [gutter, undefined];
      normalizedGutter.forEach((g, index) => {
        if (typeof g === 'object') {
          for (let i = 0; i < _responsiveObserve.responsiveArray.length; i++) {
            const breakpoint = _responsiveObserve.responsiveArray[i];
            if (screens.value[breakpoint] && g[breakpoint] !== undefined) {
              results[index] = g[breakpoint];
              break;
            }
          }
        } else {
          results[index] = g;
        }
      });
      return results;
    });
    (0, _context.default)({
      gutter,
      supportFlexGap,
      wrap: (0, _vue.computed)(() => props.wrap)
    });
    const classes = (0, _vue.computed)(() => (0, _classNames.default)(prefixCls.value, {
      [`${prefixCls.value}-no-wrap`]: props.wrap === false,
      [`${prefixCls.value}-${mergeJustify.value}`]: mergeJustify.value,
      [`${prefixCls.value}-${mergeAlign.value}`]: mergeAlign.value,
      [`${prefixCls.value}-rtl`]: direction.value === 'rtl'
    }, attrs.class, hashId.value));
    const rowStyle = (0, _vue.computed)(() => {
      const gt = gutter.value;
      // Add gutter related style
      const style = {};
      const horizontalGutter = gt[0] != null && gt[0] > 0 ? `${gt[0] / -2}px` : undefined;
      const verticalGutter = gt[1] != null && gt[1] > 0 ? `${gt[1] / -2}px` : undefined;
      if (horizontalGutter) {
        style.marginLeft = horizontalGutter;
        style.marginRight = horizontalGutter;
      }
      if (supportFlexGap.value) {
        // Set gap direct if flex gap support
        style.rowGap = `${gt[1]}px`;
      } else if (verticalGutter) {
        style.marginTop = verticalGutter;
        style.marginBottom = verticalGutter;
      }
      return style;
    });
    return () => {
      var _a;
      return wrapSSR((0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "class": classes.value,
        "style": (0, _extends2.default)((0, _extends2.default)({}, rowStyle.value), attrs.style)
      }), [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]));
    };
  }
});
var _default = exports.default = ARow;