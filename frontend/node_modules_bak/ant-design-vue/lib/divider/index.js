"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dividerProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _propsUtil = require("../_util/props-util");
var _type = require("../_util/type");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _style = _interopRequireDefault(require("./style"));
const dividerProps = () => ({
  prefixCls: String,
  type: {
    type: String,
    default: 'horizontal'
  },
  dashed: {
    type: Boolean,
    default: false
  },
  orientation: {
    type: String,
    default: 'center'
  },
  plain: {
    type: Boolean,
    default: false
  },
  orientationMargin: [String, Number]
});
exports.dividerProps = dividerProps;
const Divider = (0, _vue.defineComponent)({
  name: 'ADivider',
  inheritAttrs: false,
  compatConfig: {
    MODE: 3
  },
  props: dividerProps(),
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const {
      prefixCls: prefixClsRef,
      direction
    } = (0, _useConfigInject.default)('divider', props);
    const [wrapSSR, hashId] = (0, _style.default)(prefixClsRef);
    const hasCustomMarginLeft = (0, _vue.computed)(() => props.orientation === 'left' && props.orientationMargin != null);
    const hasCustomMarginRight = (0, _vue.computed)(() => props.orientation === 'right' && props.orientationMargin != null);
    const classString = (0, _vue.computed)(() => {
      const {
        type,
        dashed,
        plain
      } = props;
      const prefixCls = prefixClsRef.value;
      return {
        [prefixCls]: true,
        [hashId.value]: !!hashId.value,
        [`${prefixCls}-${type}`]: true,
        [`${prefixCls}-dashed`]: !!dashed,
        [`${prefixCls}-plain`]: !!plain,
        [`${prefixCls}-rtl`]: direction.value === 'rtl',
        [`${prefixCls}-no-default-orientation-margin-left`]: hasCustomMarginLeft.value,
        [`${prefixCls}-no-default-orientation-margin-right`]: hasCustomMarginRight.value
      };
    });
    const innerStyle = (0, _vue.computed)(() => {
      const marginValue = typeof props.orientationMargin === 'number' ? `${props.orientationMargin}px` : props.orientationMargin;
      return (0, _extends2.default)((0, _extends2.default)({}, hasCustomMarginLeft.value && {
        marginLeft: marginValue
      }), hasCustomMarginRight.value && {
        marginRight: marginValue
      });
    });
    const orientationPrefix = (0, _vue.computed)(() => props.orientation.length > 0 ? '-' + props.orientation : props.orientation);
    return () => {
      var _a;
      const children = (0, _propsUtil.flattenChildren)((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots));
      return wrapSSR((0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "class": [classString.value, children.length ? `${prefixClsRef.value}-with-text ${prefixClsRef.value}-with-text${orientationPrefix.value}` : '', attrs.class],
        "role": "separator"
      }), [children.length ? (0, _vue.createVNode)("span", {
        "class": `${prefixClsRef.value}-inner-text`,
        "style": innerStyle.value
      }, [children]) : null]));
    };
  }
});
var _default = exports.default = (0, _type.withInstall)(Divider);