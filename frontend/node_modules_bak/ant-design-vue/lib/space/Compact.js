"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useCompactItemContext = exports.spaceCompactProps = exports.spaceCompactItemProps = exports.default = exports.SpaceCompactItemContext = exports.NoCompactStyle = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _createContext = _interopRequireDefault(require("../_util/createContext"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _style = _interopRequireDefault(require("./style"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _type = require("../_util/type");
var _lodashEs = require("lodash");
var _propsUtil = require("../_util/props-util");
const spaceCompactItemProps = () => ({
  compactSize: String,
  compactDirection: _vueTypes.default.oneOf((0, _type.tuple)('horizontal', 'vertical')).def('horizontal'),
  isFirstItem: (0, _type.booleanType)(),
  isLastItem: (0, _type.booleanType)()
});
exports.spaceCompactItemProps = spaceCompactItemProps;
const SpaceCompactItemContext = exports.SpaceCompactItemContext = (0, _createContext.default)(null);
const useCompactItemContext = (prefixCls, direction) => {
  const compactItemContext = SpaceCompactItemContext.useInject();
  const compactItemClassnames = (0, _vue.computed)(() => {
    if (!compactItemContext || (0, _lodashEs.isEmpty)(compactItemContext)) return '';
    const {
      compactDirection,
      isFirstItem,
      isLastItem
    } = compactItemContext;
    const separator = compactDirection === 'vertical' ? '-vertical-' : '-';
    return (0, _classNames.default)({
      [`${prefixCls.value}-compact${separator}item`]: true,
      [`${prefixCls.value}-compact${separator}first-item`]: isFirstItem,
      [`${prefixCls.value}-compact${separator}last-item`]: isLastItem,
      [`${prefixCls.value}-compact${separator}item-rtl`]: direction.value === 'rtl'
    });
  });
  return {
    compactSize: (0, _vue.computed)(() => compactItemContext === null || compactItemContext === void 0 ? void 0 : compactItemContext.compactSize),
    compactDirection: (0, _vue.computed)(() => compactItemContext === null || compactItemContext === void 0 ? void 0 : compactItemContext.compactDirection),
    compactItemClassnames
  };
};
exports.useCompactItemContext = useCompactItemContext;
const NoCompactStyle = exports.NoCompactStyle = (0, _vue.defineComponent)({
  name: 'NoCompactStyle',
  setup(_, _ref) {
    let {
      slots
    } = _ref;
    SpaceCompactItemContext.useProvide(null);
    return () => {
      var _a;
      return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
    };
  }
});
const spaceCompactProps = () => ({
  prefixCls: String,
  size: {
    type: String
  },
  direction: _vueTypes.default.oneOf((0, _type.tuple)('horizontal', 'vertical')).def('horizontal'),
  align: _vueTypes.default.oneOf((0, _type.tuple)('start', 'end', 'center', 'baseline')),
  block: {
    type: Boolean,
    default: undefined
  }
});
exports.spaceCompactProps = spaceCompactProps;
const CompactItem = (0, _vue.defineComponent)({
  name: 'CompactItem',
  props: spaceCompactItemProps(),
  setup(props, _ref2) {
    let {
      slots
    } = _ref2;
    SpaceCompactItemContext.useProvide(props);
    return () => {
      var _a;
      return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
    };
  }
});
const Compact = (0, _vue.defineComponent)({
  name: 'ASpaceCompact',
  inheritAttrs: false,
  props: spaceCompactProps(),
  setup(props, _ref3) {
    let {
      attrs,
      slots
    } = _ref3;
    const {
      prefixCls,
      direction: directionConfig
    } = (0, _useConfigInject.default)('space-compact', props);
    const compactItemContext = SpaceCompactItemContext.useInject();
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const clx = (0, _vue.computed)(() => {
      return (0, _classNames.default)(prefixCls.value, hashId.value, {
        [`${prefixCls.value}-rtl`]: directionConfig.value === 'rtl',
        [`${prefixCls.value}-block`]: props.block,
        [`${prefixCls.value}-vertical`]: props.direction === 'vertical'
      });
    });
    return () => {
      var _a;
      const childNodes = (0, _propsUtil.flattenChildren)(((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)) || []);
      // =========================== Render ===========================
      if (childNodes.length === 0) {
        return null;
      }
      return wrapSSR((0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "class": [clx.value, attrs.class]
      }), [childNodes.map((child, i) => {
        var _a;
        const key = child && child.key || `${prefixCls.value}-item-${i}`;
        const noCompactItemContext = !compactItemContext || (0, _lodashEs.isEmpty)(compactItemContext);
        return (0, _vue.createVNode)(CompactItem, {
          "key": key,
          "compactSize": (_a = props.size) !== null && _a !== void 0 ? _a : 'middle',
          "compactDirection": props.direction,
          "isFirstItem": i === 0 && (noCompactItemContext || (compactItemContext === null || compactItemContext === void 0 ? void 0 : compactItemContext.isFirstItem)),
          "isLastItem": i === childNodes.length - 1 && (noCompactItemContext || (compactItemContext === null || compactItemContext === void 0 ? void 0 : compactItemContext.isLastItem))
        }, {
          default: () => [child]
        });
      })]));
    };
  }
});
var _default = exports.default = Compact;