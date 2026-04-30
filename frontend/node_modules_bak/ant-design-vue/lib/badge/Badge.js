"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.badgeProps = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _ScrollNumber = _interopRequireDefault(require("./ScrollNumber"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _propsUtil = require("../_util/props-util");
var _vnode = require("../_util/vnode");
var _transition = require("../_util/transition");
var _Ribbon = _interopRequireDefault(require("./Ribbon"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _isNumeric = _interopRequireDefault(require("../_util/isNumeric"));
var _style = _interopRequireDefault(require("./style"));
var _colors = require("../_util/colors");
const badgeProps = () => ({
  /** Number to show in badge */
  count: _vueTypes.default.any.def(null),
  showZero: {
    type: Boolean,
    default: undefined
  },
  /** Max count to show */
  overflowCount: {
    type: Number,
    default: 99
  },
  /** whether to show red dot without number */
  dot: {
    type: Boolean,
    default: undefined
  },
  prefixCls: String,
  scrollNumberPrefixCls: String,
  status: {
    type: String
  },
  size: {
    type: String,
    default: 'default'
  },
  color: String,
  text: _vueTypes.default.any,
  offset: Array,
  numberStyle: {
    type: Object,
    default: undefined
  },
  title: String
});
exports.badgeProps = badgeProps;
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ABadge',
  Ribbon: _Ribbon.default,
  inheritAttrs: false,
  props: badgeProps(),
  slots: Object,
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const {
      prefixCls,
      direction
    } = (0, _useConfigInject.default)('badge', props);
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    // ================================ Misc ================================
    const numberedDisplayCount = (0, _vue.computed)(() => {
      return props.count > props.overflowCount ? `${props.overflowCount}+` : props.count;
    });
    const isZero = (0, _vue.computed)(() => numberedDisplayCount.value === '0' || numberedDisplayCount.value === 0);
    const ignoreCount = (0, _vue.computed)(() => props.count === null || isZero.value && !props.showZero);
    const hasStatus = (0, _vue.computed)(() => (props.status !== null && props.status !== undefined || props.color !== null && props.color !== undefined) && ignoreCount.value);
    const showAsDot = (0, _vue.computed)(() => props.dot && !isZero.value);
    const mergedCount = (0, _vue.computed)(() => showAsDot.value ? '' : numberedDisplayCount.value);
    const isHidden = (0, _vue.computed)(() => {
      const isEmpty = mergedCount.value === null || mergedCount.value === undefined || mergedCount.value === '';
      return (isEmpty || isZero.value && !props.showZero) && !showAsDot.value;
    });
    // Count should be cache in case hidden change it
    const livingCount = (0, _vue.ref)(props.count);
    // We need cache count since remove motion should not change count display
    const displayCount = (0, _vue.ref)(mergedCount.value);
    // We will cache the dot status to avoid shaking on leaved motion
    const isDotRef = (0, _vue.ref)(showAsDot.value);
    (0, _vue.watch)([() => props.count, mergedCount, showAsDot], () => {
      if (!isHidden.value) {
        livingCount.value = props.count;
        displayCount.value = mergedCount.value;
        isDotRef.value = showAsDot.value;
      }
    }, {
      immediate: true
    });
    // InternalColor
    const isInternalColor = (0, _vue.computed)(() => (0, _colors.isPresetColor)(props.color, false));
    // Shared styles
    const statusCls = (0, _vue.computed)(() => ({
      [`${prefixCls.value}-status-dot`]: hasStatus.value,
      [`${prefixCls.value}-status-${props.status}`]: !!props.status,
      [`${prefixCls.value}-color-${props.color}`]: isInternalColor.value
    }));
    const statusStyle = (0, _vue.computed)(() => {
      if (props.color && !isInternalColor.value) {
        return {
          background: props.color,
          color: props.color
        };
      } else {
        return {};
      }
    });
    const scrollNumberCls = (0, _vue.computed)(() => ({
      [`${prefixCls.value}-dot`]: isDotRef.value,
      [`${prefixCls.value}-count`]: !isDotRef.value,
      [`${prefixCls.value}-count-sm`]: props.size === 'small',
      [`${prefixCls.value}-multiple-words`]: !isDotRef.value && displayCount.value && displayCount.value.toString().length > 1,
      [`${prefixCls.value}-status-${props.status}`]: !!props.status,
      [`${prefixCls.value}-color-${props.color}`]: isInternalColor.value
    }));
    return () => {
      var _a, _b;
      const {
        offset,
        title,
        color
      } = props;
      const style = attrs.style;
      const text = (0, _propsUtil.getPropsSlot)(slots, props, 'text');
      const pre = prefixCls.value;
      const count = livingCount.value;
      let children = (0, _propsUtil.flattenChildren)((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots));
      children = children.length ? children : null;
      const visible = !!(!isHidden.value || slots.count);
      // =============================== Styles ===============================
      const mergedStyle = (() => {
        if (!offset) {
          return (0, _extends2.default)({}, style);
        }
        const offsetStyle = {
          marginTop: (0, _isNumeric.default)(offset[1]) ? `${offset[1]}px` : offset[1]
        };
        if (direction.value === 'rtl') {
          offsetStyle.left = `${parseInt(offset[0], 10)}px`;
        } else {
          offsetStyle.right = `${-parseInt(offset[0], 10)}px`;
        }
        return (0, _extends2.default)((0, _extends2.default)({}, offsetStyle), style);
      })();
      // =============================== Render ===============================
      // >>> Title
      const titleNode = title !== null && title !== void 0 ? title : typeof count === 'string' || typeof count === 'number' ? count : undefined;
      // >>> Status Text
      const statusTextNode = visible || !text ? null : (0, _vue.createVNode)("span", {
        "class": `${pre}-status-text`
      }, [text]);
      // >>> Display Component
      const displayNode = typeof count === 'object' || count === undefined && slots.count ? (0, _vnode.cloneElement)(count !== null && count !== void 0 ? count : (_b = slots.count) === null || _b === void 0 ? void 0 : _b.call(slots), {
        style: mergedStyle
      }, false) : null;
      const badgeClassName = (0, _classNames.default)(pre, {
        [`${pre}-status`]: hasStatus.value,
        [`${pre}-not-a-wrapper`]: !children,
        [`${pre}-rtl`]: direction.value === 'rtl'
      }, attrs.class, hashId.value);
      // <Badge status="success" />
      if (!children && hasStatus.value) {
        const statusTextColor = mergedStyle.color;
        return wrapSSR((0, _vue.createVNode)("span", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
          "class": badgeClassName,
          "style": mergedStyle
        }), [(0, _vue.createVNode)("span", {
          "class": statusCls.value,
          "style": statusStyle.value
        }, null), (0, _vue.createVNode)("span", {
          "style": {
            color: statusTextColor
          },
          "class": `${pre}-status-text`
        }, [text])]));
      }
      const transitionProps = (0, _transition.getTransitionProps)(children ? `${pre}-zoom` : '', {
        appear: false
      });
      let scrollNumberStyle = (0, _extends2.default)((0, _extends2.default)({}, mergedStyle), props.numberStyle);
      if (color && !isInternalColor.value) {
        scrollNumberStyle = scrollNumberStyle || {};
        scrollNumberStyle.background = color;
      }
      return wrapSSR((0, _vue.createVNode)("span", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "class": badgeClassName
      }), [children, (0, _vue.createVNode)(_vue.Transition, transitionProps, {
        default: () => [(0, _vue.withDirectives)((0, _vue.createVNode)(_ScrollNumber.default, {
          "prefixCls": props.scrollNumberPrefixCls,
          "show": visible,
          "class": scrollNumberCls.value,
          "count": displayCount.value,
          "title": titleNode,
          "style": scrollNumberStyle,
          "key": "scrollNumber"
        }, {
          default: () => [displayNode]
        }), [[_vue.vShow, visible]])]
      }), statusTextNode]));
    };
  }
});