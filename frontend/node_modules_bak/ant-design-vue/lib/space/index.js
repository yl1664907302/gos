"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Compact", {
  enumerable: true,
  get: function () {
    return _Compact.default;
  }
});
exports.spaceProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _propsUtil = require("../_util/props-util");
var _type = require("../_util/type");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _useFlexGapSupport = _interopRequireDefault(require("../_util/hooks/useFlexGapSupport"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _Compact = _interopRequireDefault(require("./Compact"));
var _style = _interopRequireDefault(require("./style"));
const spaceSize = {
  small: 8,
  middle: 16,
  large: 24
};
const spaceProps = () => ({
  prefixCls: String,
  size: {
    type: [String, Number, Array]
  },
  direction: _vueTypes.default.oneOf((0, _type.tuple)('horizontal', 'vertical')).def('horizontal'),
  align: _vueTypes.default.oneOf((0, _type.tuple)('start', 'end', 'center', 'baseline')),
  wrap: (0, _type.booleanType)()
});
exports.spaceProps = spaceProps;
function getNumberSize(size) {
  return typeof size === 'string' ? spaceSize[size] : size || 0;
}
const Space = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ASpace',
  inheritAttrs: false,
  props: spaceProps(),
  slots: Object,
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const {
      prefixCls,
      space,
      direction: directionConfig
    } = (0, _useConfigInject.default)('space', props);
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const supportFlexGap = (0, _useFlexGapSupport.default)();
    const size = (0, _vue.computed)(() => {
      var _a, _b, _c;
      return (_c = (_a = props.size) !== null && _a !== void 0 ? _a : (_b = space === null || space === void 0 ? void 0 : space.value) === null || _b === void 0 ? void 0 : _b.size) !== null && _c !== void 0 ? _c : 'small';
    });
    const horizontalSize = (0, _vue.ref)();
    const verticalSize = (0, _vue.ref)();
    (0, _vue.watch)(size, () => {
      [horizontalSize.value, verticalSize.value] = (Array.isArray(size.value) ? size.value : [size.value, size.value]).map(item => getNumberSize(item));
    }, {
      immediate: true
    });
    const mergedAlign = (0, _vue.computed)(() => props.align === undefined && props.direction === 'horizontal' ? 'center' : props.align);
    const cn = (0, _vue.computed)(() => {
      return (0, _classNames.default)(prefixCls.value, hashId.value, `${prefixCls.value}-${props.direction}`, {
        [`${prefixCls.value}-rtl`]: directionConfig.value === 'rtl',
        [`${prefixCls.value}-align-${mergedAlign.value}`]: mergedAlign.value
      });
    });
    const marginDirection = (0, _vue.computed)(() => directionConfig.value === 'rtl' ? 'marginLeft' : 'marginRight');
    const style = (0, _vue.computed)(() => {
      const gapStyle = {};
      if (supportFlexGap.value) {
        gapStyle.columnGap = `${horizontalSize.value}px`;
        gapStyle.rowGap = `${verticalSize.value}px`;
      }
      return (0, _extends2.default)((0, _extends2.default)({}, gapStyle), props.wrap && {
        flexWrap: 'wrap',
        marginBottom: `${-verticalSize.value}px`
      });
    });
    return () => {
      var _a, _b;
      const {
        wrap,
        direction = 'horizontal'
      } = props;
      const children = (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
      const items = (0, _propsUtil.filterEmpty)(children);
      const len = items.length;
      if (len === 0) {
        return null;
      }
      const split = (_b = slots.split) === null || _b === void 0 ? void 0 : _b.call(slots);
      const itemClassName = `${prefixCls.value}-item`;
      const horizontalSizeVal = horizontalSize.value;
      const latestIndex = len - 1;
      return (0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "class": [cn.value, attrs.class],
        "style": [style.value, attrs.style]
      }), [items.map((child, index) => {
        let originIndex = children.indexOf(child);
        if (originIndex === -1) {
          originIndex = `$$space-${index}`;
        }
        let itemStyle = {};
        if (!supportFlexGap.value) {
          if (direction === 'vertical') {
            if (index < latestIndex) {
              itemStyle = {
                marginBottom: `${horizontalSizeVal / (split ? 2 : 1)}px`
              };
            }
          } else {
            itemStyle = (0, _extends2.default)((0, _extends2.default)({}, index < latestIndex && {
              [marginDirection.value]: `${horizontalSizeVal / (split ? 2 : 1)}px`
            }), wrap && {
              paddingBottom: `${verticalSize.value}px`
            });
          }
        }
        return wrapSSR((0, _vue.createVNode)(_vue.Fragment, {
          "key": originIndex
        }, [(0, _vue.createVNode)("div", {
          "class": itemClassName,
          "style": itemStyle
        }, [child]), index < latestIndex && split && (0, _vue.createVNode)("span", {
          "class": `${itemClassName}-split`,
          "style": itemStyle
        }, [split])]));
      })]);
    };
  }
});
Space.Compact = _Compact.default;
Space.install = function (app) {
  app.component(Space.name, Space);
  app.component(_Compact.default.name, _Compact.default);
  return app;
};
var _default = exports.default = Space;